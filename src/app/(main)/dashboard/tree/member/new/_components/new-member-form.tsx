"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { COUNTRY_OPTIONS } from "@/data/recipe-options";
import { RELATION_OPTIONS } from "@/lib/family-constants";
import type { FamilyMember } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { createFamilyMember } from "@/server/family-actions";

const GENERATION_OPTIONS = [
  { value: "1", label: "1 — Great-grandparents" },
  { value: "2", label: "2 — Grandparents" },
  { value: "3", label: "3 — Parents" },
  { value: "4", label: "4 — My generation" },
  { value: "5", label: "5 — Children" },
];

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  relation: z.string().optional(),
  country_of_origin: z.string().optional(),
  cultural_background: z.string().optional(),
  bio: z.string().optional(),
  generation: z.coerce.number().int().min(1).max(5).optional(),
  is_memorial: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

interface NewMemberFormProps {
  members: FamilyMember[];
}

export function NewMemberForm({ members }: NewMemberFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { is_memorial: false },
  });

  const isMemorial = watch("is_memorial");

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await createFamilyMember({
        name: values.name,
        relation: values.relation || undefined,
        country_of_origin: values.country_of_origin || undefined,
        cultural_background: values.cultural_background || undefined,
        bio: values.bio || undefined,
        generation: values.generation || undefined,
        is_memorial: values.is_memorial ?? false,
      });

      if ("error" in result) {
        alert(result.error);
        return;
      }

      router.push("/dashboard/tree");
    });
  }

  return (
    <Card className="border-amber-100 dark:border-amber-900/20">
      <CardHeader>
        <CardTitle className="text-lg">About this person</CardTitle>
        <CardDescription>These details help connect recipes and memories to the right person.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full name *</Label>
              <Input id="name" placeholder="e.g. Grandma Rosa" {...register("name")} />
              {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="relation">Relation to you</Label>
              <Select onValueChange={(v) => setValue("relation", v)}>
                <SelectTrigger id="relation">
                  <SelectValue placeholder="Select relation" />
                </SelectTrigger>
                <SelectContent>
                  {RELATION_OPTIONS.map((relation) => (
                    <SelectItem key={relation.value} value={relation.label}>
                      {relation.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="country">Country of origin</Label>
              <Popover open={isCountryPickerOpen} onOpenChange={setIsCountryPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={isCountryPickerOpen}
                    className={cn(
                      "w-full justify-between font-normal",
                      !watch("country_of_origin") && "text-muted-foreground",
                    )}
                  >
                    {watch("country_of_origin") || "Search and select a country"}
                    <ChevronsUpDown className="size-4 opacity-50" />
                  </Button>
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
                              const nextCountry = country === watch("country_of_origin") ? "" : country;
                              setValue("country_of_origin", nextCountry, { shouldDirty: true });
                              setIsCountryPickerOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "size-4",
                                watch("country_of_origin") === country ? "opacity-100" : "opacity-0",
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
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="culture">Cultural background</Label>
              <Input id="culture" placeholder="e.g. Southern Vietnamese" {...register("cultural_background")} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="generation">Generation</Label>
            <Select onValueChange={(v) => setValue("generation", Number(v))}>
              <SelectTrigger id="generation">
                <SelectValue placeholder="Select generation" />
              </SelectTrigger>
              <SelectContent>
                {GENERATION_OPTIONS.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">Helps organise the family tree by time period.</p>
          </div>

          {members.length > 0 && (
            <p className="text-muted-foreground text-xs">
              Family links are connected automatically based on generation.
            </p>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="bio">Short biography</Label>
            <Textarea
              id="bio"
              placeholder="A few words about who they are, their cooking style, or what makes them special..."
              className="min-h-[100px] resize-none"
              {...register("bio")}
            />
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 dark:border-amber-900/20 dark:bg-amber-950/10">
            <input
              type="checkbox"
              id="memorial"
              className="size-4 accent-amber-700"
              checked={isMemorial ?? false}
              onChange={(e) => setValue("is_memorial", e.target.checked)}
            />
            <div>
              <Label htmlFor="memorial" className="cursor-pointer font-medium">
                Memorial profile
              </Label>
              <p className="text-muted-foreground text-xs">
                This person has passed away. Their profile will be handled with care and respect.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
            >
              {isPending ? "Saving..." : "Add to family tree"}
            </Button>
            <Button variant="outline" asChild>
              <a href="/dashboard/tree">Cancel</a>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
