"use client";

import { type ChangeEvent, useEffect, useRef, useState, useTransition } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, ImageUp, PenLine, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { COUNTRY_OPTIONS, RECIPE_CATEGORY_OPTIONS } from "@/data/recipe-options";
import { getRelationLabel } from "@/lib/family-constants";
import { createClient } from "@/lib/supabase/client";
import type { FamilyMember } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { createRecipe } from "@/server/recipe-actions";

import { IngredientSelector } from "./ingredient-selector";

const schema = z.object({
  title: z.string().min(1, "Recipe title is required"),
  member_id: z.string().optional(),
  culture_tag: z.string().optional(),
  country_of_origin: z.string().optional(),
  prep_time: z.string().optional(),
  cook_time: z.string().optional(),
  servings: z.string().optional(),
  ingredients: z.string().optional(),
  steps: z.string().optional(),
  step_images: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface NewRecipeFormProps {
  members: FamilyMember[];
  preselectedMemberId?: string;
  preselectedMemberName?: string;
}

export function NewRecipeForm({ members, preselectedMemberId, preselectedMemberName }: NewRecipeFormProps) {
  const router = useRouter();
  const recipeImageInputRef = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"manual" | "image">("manual");
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isEstimatingCalories, setIsEstimatingCalories] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isExtractingImage, setIsExtractingImage] = useState(false);
  const [calorieEstimate, setCalorieEstimate] = useState<{
    calories_per_serving: number;
    total_calories: number;
    servings: number;
    note: string;
  } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      culture_tag: "",
      country_of_origin: "",
      member_id: preselectedMemberId ?? "",
    },
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  function closeCountryPicker() {
    setIsCountryPickerOpen(false);
    requestAnimationFrame(() => setIsCountryPickerOpen(false));
  }

  useEffect(() => {
    if (!selectedImageFile) {
      setImagePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImageFile);
    setImagePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedImageFile]);

  function validateImageFile(file: File) {
    const supportedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
    if (!supportedTypes.has(file.type)) {
      return "Upload a JPG, PNG, WebP, or GIF image.";
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return "Image must be 10 MB or smaller.";
    }

    return null;
  }

  function handleSelectImage(file: File | null) {
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSelectedImageFile(file);
    setUploadedImageUrl(null);
  }

  function onImageInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    handleSelectImage(file);
  }

  async function uploadRecipeImage() {
    if (!selectedImageFile) {
      return uploadedImageUrl;
    }

    if (uploadedImageUrl) {
      return uploadedImageUrl;
    }

    setIsUploadingImage(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("You must be signed in to upload recipe images.");
        return null;
      }

      const extension = selectedImageFile.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/recipe-${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage.from("recipe-images").upload(path, selectedImageFile, {
        cacheControl: "3600",
        upsert: false,
      });

      if (uploadError) {
        if (uploadError.message.toLowerCase().includes("bucket")) {
          toast.error("Storage bucket 'recipe-images' is missing. Create it in Supabase Storage first.");
        } else {
          toast.error(uploadError.message);
        }
        return null;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("recipe-images").getPublicUrl(path);

      setUploadedImageUrl(publicUrl);
      return publicUrl;
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function handlePrepareImageRecipe() {
    if (!selectedImageFile) {
      toast.error("Select an image first.");
      return;
    }

    setIsExtractingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedImageFile);

      const response = await fetch("/api/ai/extract-recipe", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        title?: string;
        ingredients?: string;
        steps?: string;
        notes?: string;
        confidence_note?: string;
        error?: string;
      };

      if (!response.ok || data.error) {
        toast.error(data.error || "Could not extract recipe from image.");
        return;
      }

      if (data.title?.trim()) {
        setValue("title", data.title.trim(), { shouldDirty: true });
      }
      if (data.ingredients?.trim()) {
        setValue("ingredients", data.ingredients.trim(), { shouldDirty: true });
      }
      if (data.steps?.trim()) {
        setValue("steps", data.steps.trim(), { shouldDirty: true });
      }
      if (data.notes?.trim()) {
        setValue("notes", data.notes.trim(), { shouldDirty: true });
      }

      toast.success(data.confidence_note?.trim() || "Recipe extracted. Review and save.");
    } catch {
      toast.error("Could not send this image to Groq AI.");
    } finally {
      setIsExtractingImage(false);
    }

    setActiveTab("manual");
  }

  async function handleSuggestRecipe() {
    const title = form.getValues("title");
    if (!title.trim()) {
      toast.error("Enter a recipe title first.");
      return;
    }

    setIsSuggesting(true);
    setValue("ingredients", "", { shouldDirty: true });
    setValue("steps", "", { shouldDirty: true });
    setCalorieEstimate(null);

    try {
      const response = await fetch("/api/ai/suggest-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), memberName: preselectedMemberName }),
      });

      if (!response.ok || !response.body) {
        toast.error("AI suggestion failed. Please try again.");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const splitIdx = buffer.indexOf("===STEPS===");
        if (splitIdx === -1) {
          const ingredientsText = buffer.replace("===INGREDIENTS===", "").trim();
          setValue("ingredients", ingredientsText, { shouldDirty: true });
        } else {
          const ingredientsRaw = buffer.slice(0, splitIdx).replace("===INGREDIENTS===", "").trim();
          const stepsRaw = buffer.slice(splitIdx + "===STEPS===".length).trim();
          setValue("ingredients", ingredientsRaw, { shouldDirty: true });
          setValue("steps", stepsRaw, { shouldDirty: true });
        }
      }
    } catch {
      toast.error("Network error. Please check your connection.");
    } finally {
      setIsSuggesting(false);
    }
  }

  async function handleEstimateCalories() {
    const ingredients = form.getValues("ingredients");
    if (!ingredients?.trim()) {
      toast.error("Add ingredients before estimating calories.");
      return;
    }

    setIsEstimatingCalories(true);
    setCalorieEstimate(null);

    try {
      const response = await fetch("/api/ai/calories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, servings: form.getValues("servings") }),
      });

      const data = await response.json();
      if (data.error || !data.calories_per_serving) {
        toast.error("Could not estimate calories for these ingredients.");
        return;
      }
      setCalorieEstimate(data);
    } catch {
      toast.error("Network error. Please check your connection.");
    } finally {
      setIsEstimatingCalories(false);
    }
  }

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const imageUrl = await uploadRecipeImage();
      if (selectedImageFile && !imageUrl) {
        return;
      }

      const result = await createRecipe({
        title: values.title,
        member_id: values.member_id || undefined,
        culture_tag: values.culture_tag || undefined,
        country_of_origin: values.country_of_origin || undefined,
        prep_time: values.prep_time || undefined,
        cook_time: values.cook_time || undefined,
        servings: values.servings || undefined,
        ingredients: values.ingredients || undefined,
        steps: values.steps || undefined,
        step_images: values.step_images || undefined,
        notes: values.notes || undefined,
        image_url: imageUrl || undefined,
      });

      if ("error" in result) {
        alert(result.error);
        return;
      }

      if (preselectedMemberId) {
        router.push(`/dashboard/tree/member/${preselectedMemberId}`);
      } else {
        router.push(`/dashboard/recipes/${result.recipe.id}`);
      }
    });
  }

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "manual" | "image")}>
      <TabsList className="mb-6 w-full">
        <TabsTrigger value="manual" className="flex-1 gap-2">
          <PenLine className="size-4" />
          Write manually
        </TabsTrigger>
        <TabsTrigger value="image" className="flex-1 gap-2">
          <ImageUp className="size-4" />
          Upload image
        </TabsTrigger>
      </TabsList>

      {/* Manual creation */}
      <TabsContent value="manual">
        <Card className="border-amber-100 dark:border-amber-900/20">
          <CardHeader>
            <CardTitle className="text-lg">Recipe details</CardTitle>
            <CardDescription>Fill in the recipe as you know it. You can always edit later.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                {/* ── AI Assistant panel ────────────────────────────────── */}
                <div className="rounded-xl border border-amber-200/70 bg-gradient-to-br from-amber-50/80 to-amber-50/20 p-4 dark:border-amber-800/30 dark:from-amber-950/20 dark:to-transparent">
                  <div className="mb-3 flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
                      <Sparkles className="size-4 text-amber-700 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="font-medium text-amber-800 text-sm dark:text-amber-300">AI Recipe Assistant</p>
                      <p className="mt-0.5 text-muted-foreground text-xs">
                        Enter a title and let AI suggest ingredients and steps to get you started.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Input id="title" placeholder="e.g. Grandma's Pho Bo" className="flex-1" {...register("title")} />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isSuggesting}
                        onClick={handleSuggestRecipe}
                        className="shrink-0 gap-1.5 border-amber-200 bg-white text-amber-700 hover:bg-amber-50 dark:border-amber-800/50 dark:bg-transparent dark:text-amber-400 dark:hover:bg-amber-950/30"
                      >
                        {isSuggesting ? <Spinner className="size-3.5" /> : <Sparkles className="size-3.5" />}
                        {isSuggesting ? "Suggesting..." : "Suggest"}
                      </Button>
                    </div>
                    {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
                  </div>
                </div>

                {/* ── Who & What ────────────────────────────────────────── */}
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <p className="shrink-0 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
                      Who &amp; What
                    </p>
                    <Separator className="flex-1" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      {preselectedMemberId ? (
                        <>
                          <Label>Family member</Label>
                          <div className="flex items-center gap-2 rounded-md border border-input bg-muted/30 px-3 py-2">
                            <span className="text-sm">{preselectedMemberName}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Label htmlFor="member">Family member</Label>
                          {members.length > 0 ? (
                            <Select onValueChange={(value) => setValue("member_id", value, { shouldDirty: true })}>
                              <SelectTrigger id="member">
                                <SelectValue placeholder="Who is this recipe from?" />
                              </SelectTrigger>
                              <SelectContent>
                                {members.map((member) => (
                                  <SelectItem key={member.id} value={member.id}>
                                    {member.name}
                                    {member.relation ? ` (${getRelationLabel(member.relation)})` : ""}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input disabled placeholder="Add family members first" />
                          )}
                        </>
                      )}
                    </div>

                    <FormField
                      control={control}
                      name="culture_tag"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl>
                              <SelectTrigger id="category">
                                <SelectValue placeholder="Choose a recipe category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {RECIPE_CATEGORY_OPTIONS.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-5">
                    <FormField
                      control={control}
                      name="country_of_origin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country of origin</FormLabel>
                          <Popover open={isCountryPickerOpen} onOpenChange={setIsCountryPickerOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  type="button"
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={isCountryPickerOpen}
                                  className={cn(
                                    "w-full justify-between font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value || "Search and select a country"}
                                  <ChevronsUpDown className="size-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                              <Command>
                                <CommandInput placeholder="Search countries..." />
                                <CommandList>
                                  <CommandEmpty>No country found.</CommandEmpty>
                                  <CommandGroup>
                                    {COUNTRY_OPTIONS.map((country) => (
                                      <CommandItem
                                        key={country}
                                        value={country}
                                        onSelect={() => {
                                          field.onChange(country === field.value ? "" : country);
                                          closeCountryPicker();
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "size-4",
                                            field.value === country ? "opacity-100" : "opacity-0",
                                          )}
                                        />
                                        {country}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* ── Timing ────────────────────────────────────────────── */}
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <p className="shrink-0 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
                      Timing
                    </p>
                    <Separator className="flex-1" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-3">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="prep">Prep time</Label>
                      <Input id="prep" placeholder="e.g. 30 min" {...register("prep_time")} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="cook">Cook time</Label>
                      <Input id="cook" placeholder="e.g. 2 hours" {...register("cook_time")} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="servings">Servings</Label>
                      <Input id="servings" placeholder="e.g. 4" {...register("servings")} />
                    </div>
                  </div>
                </div>

                {/* ── Ingredients ───────────────────────────────────────── */}
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <p className="shrink-0 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
                      Ingredients
                    </p>
                    <Separator className="flex-1" />
                  </div>

                  <FormField
                    control={control}
                    name="ingredients"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="sr-only">Ingredients</FormLabel>
                        <IngredientSelector value={field.value ?? ""} onChange={field.onChange} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="mt-3 flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isEstimatingCalories}
                        onClick={handleEstimateCalories}
                        className="gap-1.5 text-muted-foreground hover:text-amber-700"
                      >
                        {isEstimatingCalories ? <Spinner className="size-3.5" /> : <Sparkles className="size-3.5" />}
                        {isEstimatingCalories ? "Estimating..." : "Estimate calories"}
                      </Button>
                    </div>
                    {calorieEstimate && (
                      <div className="flex items-center gap-2 rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-1.5 dark:border-amber-900/20 dark:bg-amber-950/10">
                        <Sparkles className="size-3 text-amber-600 dark:text-amber-400" />
                        <span className="font-semibold text-amber-800 text-xs dark:text-amber-300">
                          ~{calorieEstimate.calories_per_serving} kcal
                        </span>
                        <span className="text-muted-foreground text-xs">/ serving · {calorieEstimate.note}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Steps ─────────────────────────────────────────────── */}
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <p className="shrink-0 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
                      Steps
                    </p>
                    <Separator className="flex-1" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="steps">Steps</Label>
                    <Textarea
                      id="steps"
                      className="min-h-[160px] resize-none text-sm"
                      placeholder={
                        "1. Roast the bones at 200°C for 30 minutes...\n2. Bring a large pot of water to boil..."
                      }
                      {...register("steps")}
                    />
                  </div>
                </div>

                {/* ── Memory & Story ────────────────────────────────────── */}
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <p className="shrink-0 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
                      Memory &amp; Story
                    </p>
                    <Separator className="flex-1" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      className="min-h-[100px] resize-none text-sm"
                      placeholder="When did this dish matter? Who made it? What does it mean to your family?"
                      {...register("notes")}
                    />
                    <p className="text-muted-foreground text-xs">
                      Optional — this becomes the heart of the recipe. You can add more memories later.
                    </p>
                  </div>
                </div>

                <Button type="submit" disabled={isPending} className="bg-amber-700 text-white hover:bg-amber-800">
                  {isPending ? "Saving..." : "Save recipe"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Image upload with Groq extraction */}
      <TabsContent value="image">
        <Card className="border-amber-100 dark:border-amber-900/20">
          <CardHeader>
            <CardTitle className="text-lg">Upload a recipe photo</CardTitle>
            <CardDescription>
              Upload a photo of a handwritten recipe card, notebook page, or printed recipe. Groq AI will extract the
              text and structure it for you to review before saving.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-5">
              <div className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-amber-200 border-dashed bg-amber-50/50 py-12 transition-colors hover:bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/10">
                <ImageUp className="size-10 text-amber-400" />
                <div className="text-center">
                  <p className="font-medium">Drop your image here or click to browse</p>
                  <p className="mt-1 text-muted-foreground text-xs">Supports JPG, PNG, WebP, GIF up to 10MB</p>
                </div>
                <Input
                  ref={recipeImageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  id="recipe-image"
                  onChange={onImageInputChange}
                />
                <Button variant="outline" asChild>
                  <label htmlFor="recipe-image" className="cursor-pointer">
                    Choose file
                  </label>
                </Button>
              </div>
              {selectedImageFile && (
                <div className="grid gap-3 rounded-lg border border-amber-100 bg-background p-3 sm:grid-cols-[120px_1fr] dark:border-amber-900/20">
                  {imagePreviewUrl ? (
                    <Image
                      src={imagePreviewUrl}
                      alt="Recipe upload preview"
                      width={120}
                      height={112}
                      className="h-28 w-full rounded-md object-cover sm:h-full"
                      unoptimized
                    />
                  ) : (
                    <div className="h-28 w-full rounded-md bg-muted sm:h-full" />
                  )}
                  <div className="flex flex-col justify-center gap-1">
                    <p className="font-medium text-sm">{selectedImageFile.name}</p>
                    <p className="text-muted-foreground text-xs">{Math.round(selectedImageFile.size / 1024)} KB</p>
                    {uploadedImageUrl && (
                      <p className="text-emerald-600 text-xs">Image uploaded and attached to this recipe.</p>
                    )}
                  </div>
                </div>
              )}
              <div className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm dark:border-amber-900/20 dark:bg-amber-950/10">
                <p className="font-medium text-amber-800 dark:text-amber-300">How Groq extraction works</p>
                <p className="mt-1 text-muted-foreground">
                  Choose an image and Groq will extract the title, ingredients, and steps into the manual form for your
                  review. The photo is only uploaded when you save the recipe.
                </p>
              </div>
              <Button
                className="bg-amber-700 text-white hover:bg-amber-800"
                disabled={!selectedImageFile || isUploadingImage || isExtractingImage}
                onClick={handlePrepareImageRecipe}
              >
                {isUploadingImage ? "Uploading..." : isExtractingImage ? "Extracting..." : "Extract recipe with AI"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
