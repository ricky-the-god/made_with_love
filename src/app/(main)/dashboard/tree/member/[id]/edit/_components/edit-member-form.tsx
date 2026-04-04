"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { COUNTRY_OPTIONS } from "@/data/recipe-options";
import {
  getRelationLabel,
  normalizeRelationValue,
  RELATION_OPTIONS,
  RELATIONS_WITH_PARENTS,
} from "@/lib/family-constants";
import type { FamilyMember } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { updateFamilyMember } from "@/server/family-actions";

const GENERATION_OPTIONS = [
  { value: "1", label: "1 — Great-grandparents" },
  { value: "2", label: "2 — Grandparents" },
  { value: "3", label: "3 — Parents" },
  { value: "4", label: "4 — My generation" },
  { value: "5", label: "5 — Children" },
];

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  relation: z.string().min(1, "Relation is required"),
  country_of_origin: z.string().min(1, "Country of origin is required"),
  cultural_background: z.string().min(1, "Cultural background is required"),
  bio: z.string().optional(),
  generation: z.coerce.number().int().min(1, "Generation is required").max(5, "Generation is required"),
  is_memorial: z.boolean().optional(),
  parent_ids: z.array(z.string().uuid()).optional(),
});

type FormValues = z.infer<typeof schema>;

interface EditMemberFormProps {
  member: FamilyMember;
  members: FamilyMember[];
}

export function EditMemberForm({ member, members }: EditMemberFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [selectedParentIds, setSelectedParentIds] = useState<string[]>(member.parent_ids ?? []);

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: member.name,
      relation: member.relation ? (normalizeRelationValue(member.relation) ?? undefined) : undefined,
      country_of_origin: member.country_of_origin ?? undefined,
      cultural_background: member.cultural_background ?? undefined,
      bio: member.bio ?? undefined,
      generation: member.generation ?? undefined,
      is_memorial: member.is_memorial,
    },
  });

  const isMemorial = watch("is_memorial");
  const otherMembers = members.filter((familyMember) => familyMember.id !== member.id);

  function closeCountryPicker() {
    setIsCountryPickerOpen(false);
    requestAnimationFrame(() => setIsCountryPickerOpen(false));
  }

  function toggleParent(id: string) {
    clearErrors("parent_ids");
    setSelectedParentIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : prev.length < 2 ? [...prev, id] : prev,
    );
  }

  const watchedRelation = watch("relation");
  const watchedGeneration = watch("generation");

  // Only show the picker for relations that have parents in the tree.
  const showParentPicker =
    otherMembers.length > 0 &&
    !!watchedRelation &&
    RELATIONS_WITH_PARENTS.has(normalizeRelationValue(watchedRelation) ?? "");

  // Filter to the generation immediately above so only plausible parents appear.
  const parentCandidates = showParentPicker
    ? otherMembers.filter((m) => {
        if (watchedGeneration && m.generation) return m.generation === watchedGeneration - 1;
        return true;
      })
    : [];

  function onSubmit(values: FormValues) {
    const parentCandidateIds = new Set(parentCandidates.map((candidate) => candidate.id));
    const sanitizedParentIds = selectedParentIds.filter((id) => parentCandidateIds.has(id)).slice(0, 2);

    if (showParentPicker && selectedParentIds.length !== sanitizedParentIds.length) {
      setSelectedParentIds(sanitizedParentIds);
      setError("parent_ids", {
        type: "manual",
        message: "Some selected parents are no longer valid. Please review your parent selection.",
      });
      return;
    }

    if (showParentPicker && sanitizedParentIds.length === 0) {
      setError("parent_ids", {
        type: "manual",
        message: "Please select at least one parent or guardian.",
      });
      return;
    }

    if (sanitizedParentIds.length > 2) {
      setError("parent_ids", {
        type: "manual",
        message: "You can select up to 2 parents or guardians.",
      });
      return;
    }

    startTransition(async () => {
      const result = await updateFamilyMember(member.id, {
        name: values.name,
        relation: values.relation,
        country_of_origin: values.country_of_origin,
        cultural_background: values.cultural_background,
        bio: values.bio || undefined,
        generation: values.generation,
        is_memorial: values.is_memorial ?? false,
        parent_ids: showParentPicker ? sanitizedParentIds : [],
      });

      if (result && "error" in result) {
        alert(result.error);
        return;
      }

      router.push(`/dashboard/tree/member/${member.id}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Full name *</Label>
          <Input id="name" placeholder="e.g. Grandma Rosa" {...register("name")} />
          {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="relation">Relation to you *</Label>
          <Select
            defaultValue={normalizeRelationValue(member.relation) ?? undefined}
            onValueChange={(value) => {
              setValue("relation", value, { shouldDirty: true, shouldValidate: true });
              setSelectedParentIds([]);
              clearErrors("parent_ids");
            }}
          >
            <SelectTrigger id="relation">
              <SelectValue placeholder="Select relation" />
            </SelectTrigger>
            <SelectContent>
              {RELATION_OPTIONS.map((relation) => (
                <SelectItem key={relation.value} value={relation.value}>
                  {relation.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.relation && <p className="text-destructive text-xs">{errors.relation.message}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="country">Country of origin *</Label>
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
                          setValue("country_of_origin", nextCountry, { shouldDirty: true, shouldValidate: true });
                          closeCountryPicker();
                        }}
                      >
                        <Check
                          className={cn("size-4", watch("country_of_origin") === country ? "opacity-100" : "opacity-0")}
                        />
                        {country}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.country_of_origin && <p className="text-destructive text-xs">{errors.country_of_origin.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="culture">Cultural background *</Label>
          <Input id="culture" placeholder="e.g. Southern Vietnamese" {...register("cultural_background")} />
          {errors.cultural_background && (
            <p className="text-destructive text-xs">{errors.cultural_background.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="generation">Generation *</Label>
        <Select
          defaultValue={member.generation?.toString() ?? undefined}
          onValueChange={(value) => {
            setValue("generation", Number(value), { shouldDirty: true, shouldValidate: true });
            setSelectedParentIds([]);
            clearErrors("parent_ids");
          }}
        >
          <SelectTrigger id="generation">
            <SelectValue placeholder="Select generation" />
          </SelectTrigger>
          <SelectContent>
            {GENERATION_OPTIONS.map((generation) => (
              <SelectItem key={generation.value} value={generation.value}>
                {generation.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.generation && <p className="text-destructive text-xs">{errors.generation.message}</p>}
      </div>

      {showParentPicker && (
        <div className="flex flex-col gap-2">
          <Label>Connected to (parent/guardian in tree)</Label>
          <p className="text-muted-foreground text-xs">
            Select up to 2 members who are this person&apos;s parents in the tree.
          </p>
          {parentCandidates.length === 0 && watchedGeneration && (
            <p className="text-muted-foreground text-xs">
              No members found in the generation above. Add generation {watchedGeneration - 1} members first, or skip to
              let the tree infer connections automatically.
            </p>
          )}
          <div className="flex max-h-40 flex-col gap-1.5 overflow-y-auto rounded-lg border border-input p-2">
            {parentCandidates.map((m) => (
              <label key={m.id} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="size-4 accent-amber-700"
                  checked={selectedParentIds.includes(m.id)}
                  onChange={() => toggleParent(m.id)}
                  disabled={!selectedParentIds.includes(m.id) && selectedParentIds.length >= 2}
                />
                <span className="font-medium">{m.name}</span>
                {m.relation && <span className="text-muted-foreground text-xs">({getRelationLabel(m.relation)})</span>}
              </label>
            ))}
          </div>
          {errors.parent_ids && <p className="text-destructive text-xs">{errors.parent_ids.message}</p>}
        </div>
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
          onChange={(event) => setValue("is_memorial", event.target.checked, { shouldDirty: true })}
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
          {isPending ? "Saving..." : "Save changes"}
        </Button>
        <Button variant="outline" asChild>
          <a href={`/dashboard/tree/member/${member.id}`}>Cancel</a>
        </Button>
      </div>
    </form>
  );
}
