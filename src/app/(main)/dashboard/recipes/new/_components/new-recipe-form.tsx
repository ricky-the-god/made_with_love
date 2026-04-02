"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp, PenLine } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { FamilyMember } from "@/lib/supabase/types";
import { createRecipe } from "@/server/recipe-actions";

const schema = z.object({
  title: z.string().min(1, "Recipe title is required"),
  member_id: z.string().optional(),
  country_of_origin: z.string().optional(),
  prep_time: z.string().optional(),
  cook_time: z.string().optional(),
  servings: z.string().optional(),
  ingredients: z.string().optional(),
  steps: z.string().optional(),
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
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      member_id: preselectedMemberId ?? "",
    },
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await createRecipe({
        title: values.title,
        member_id: values.member_id || undefined,
        country_of_origin: values.country_of_origin || undefined,
        prep_time: values.prep_time || undefined,
        cook_time: values.cook_time || undefined,
        servings: values.servings || undefined,
        ingredients: values.ingredients || undefined,
        steps: values.steps || undefined,
        notes: values.notes || undefined,
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
    <Tabs defaultValue="manual">
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
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Recipe title *</Label>
                <Input id="title" placeholder="e.g. Grandma's Pho Bo" {...register("title")} />
                {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
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
                        <Select onValueChange={(v) => setValue("member_id", v)}>
                          <SelectTrigger id="member">
                            <SelectValue placeholder="Who is this recipe from?" />
                          </SelectTrigger>
                          <SelectContent>
                            {members.map((m) => (
                              <SelectItem key={m.id} value={m.id}>
                                {m.name}
                                {m.relation ? ` (${m.relation})` : ""}
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
                <div className="flex flex-col gap-2">
                  <Label htmlFor="country">Country of origin</Label>
                  <Input id="country" placeholder="e.g. Vietnam" {...register("country_of_origin")} />
                </div>
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

              <div className="flex flex-col gap-2">
                <Label htmlFor="ingredients">Ingredients</Label>
                <Textarea
                  id="ingredients"
                  className="min-h-[120px] resize-none font-mono text-sm"
                  placeholder={"2 kg beef bones\n1 cinnamon stick\n3 star anise\n..."}
                  {...register("ingredients")}
                />
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

              <div className="flex flex-col gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  className="min-h-[100px] resize-none text-sm"
                  placeholder="When did this dish matter? Who made it? What does it mean to your family?"
                  {...register("notes")}
                />
              </div>

              <Button type="submit" disabled={isPending} className="bg-amber-700 text-white hover:bg-amber-800">
                {isPending ? "Saving..." : "Save recipe"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Image upload — AI integration pending */}
      <TabsContent value="image">
        <Card className="border-amber-100 dark:border-amber-900/20">
          <CardHeader>
            <CardTitle className="text-lg">Upload a recipe photo</CardTitle>
            <CardDescription>
              Upload a photo of a handwritten recipe card, notebook page, or printed recipe. Claude AI will extract the
              text and structure it for you to review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-5">
              <div className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-amber-200 border-dashed bg-amber-50/50 py-12 transition-colors hover:bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/10">
                <ImageUp className="size-10 text-amber-400" />
                <div className="text-center">
                  <p className="font-medium">Drop your image here or click to browse</p>
                  <p className="mt-1 text-muted-foreground text-xs">Supports JPG, PNG, HEIC up to 10MB</p>
                </div>
                <Input type="file" accept="image/*" className="hidden" id="recipe-image" />
                <Button variant="outline" asChild>
                  <label htmlFor="recipe-image" className="cursor-pointer">
                    Choose file
                  </label>
                </Button>
              </div>
              <div className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm dark:border-amber-900/20 dark:bg-amber-950/10">
                <p className="font-medium text-amber-800 dark:text-amber-300">How it works</p>
                <p className="mt-1 text-muted-foreground">
                  Claude AI will read the recipe and extract ingredients and steps. You'll review and confirm everything
                  before it's saved — uncertain fields will be flagged for you to correct.
                </p>
              </div>
              <Button className="bg-amber-700 text-white hover:bg-amber-800" disabled>
                Extract recipe with AI
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
