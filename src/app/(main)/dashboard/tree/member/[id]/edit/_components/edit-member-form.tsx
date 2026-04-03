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
import type { FamilyMember } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { updateFamilyMember } from "@/server/family-actions";

const RELATIONS = [
  "Myself",
  "Mother",
  "Father",
  "Grandmother",
  "Grandfather",
  "Aunt",
  "Uncle",
  "Sister",
  "Brother",
  "Cousin",
  "Child",
  "Family friend",
  "Mentor",
  "Other",
];

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  relation: z.string().optional(),
  country_of_origin: z.string().optional(),
  cultural_background: z.string().optional(),
  bio: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface EditMemberFormProps {
  member: FamilyMember;
}

export function EditMemberForm({ member }: EditMemberFormProps) {
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
    defaultValues: {
      name: member.name,
      relation: member.relation ?? "",
      country_of_origin: member.country_of_origin ?? "",
      cultural_background: member.cultural_background ?? "",
      bio: member.bio ?? "",
    },
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await updateFamilyMember(member.id, {
        name: values.name,
        relation: values.relation || undefined,
        country_of_origin: values.country_of_origin || undefined,
        cultural_background: values.cultural_background || undefined,
        bio: values.bio || undefined,
      });

      if ("error" in result) {
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
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="relation">Relation</Label>
          <Select
            defaultValue={member.relation ?? undefined}
            onValueChange={(value) => setValue("relation", value, { shouldDirty: true })}
          >
            <SelectTrigger id="relation">
              <SelectValue placeholder="Select relation" />
            </SelectTrigger>
            <SelectContent>
              {RELATIONS.map((relation) => (
                <SelectItem key={relation} value={relation.toLowerCase().replace(/\s+/g, "-")}>
                  {relation}
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
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="culture">Cultural background</Label>
          <Input id="culture" placeholder="e.g. Southern Vietnamese" {...register("cultural_background")} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="bio">Biography</Label>
        <Textarea
          id="bio"
          className="min-h-[100px] resize-none"
          placeholder="A few words about this person..."
          {...register("bio")}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending} className="flex-1 bg-amber-700 text-white hover:bg-amber-800">
          {isPending ? "Saving..." : "Save changes"}
        </Button>
        <Button variant="outline" asChild>
          <a href={`/dashboard/tree/member/${member.id}`}>Cancel</a>
        </Button>
      </div>
    </form>
  );
}
