"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RELATIONS } from "@/lib/family-constants";
import type { FamilyMember } from "@/lib/supabase/types";
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
  relation: z.string().optional(),
  country_of_origin: z.string().optional(),
  cultural_background: z.string().optional(),
  bio: z.string().optional(),
  generation: z.coerce.number().int().min(1).max(5).optional(),
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
      relation: member.relation ?? undefined,
      country_of_origin: member.country_of_origin ?? undefined,
      cultural_background: member.cultural_background ?? undefined,
      bio: member.bio ?? undefined,
      generation: member.generation ?? undefined,
      is_memorial: member.is_memorial,
      parent_ids: member.parent_ids ?? [],
    },
  });

  const isMemorial = watch("is_memorial");
  const _selectedRelation = watch("relation");
  const selectedParentIds = watch("parent_ids") ?? [];

  // Other members (exclude self from parent options)
  const otherMembers = members.filter((m) => m.id !== member.id);

  function toggleParent(id: string, checked: boolean) {
    const current = selectedParentIds;
    setValue("parent_ids", checked ? [...current, id] : current.filter((p) => p !== id));
  }

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await updateFamilyMember(member.id, {
        name: values.name,
        relation: values.relation || undefined,
        country_of_origin: values.country_of_origin || undefined,
        cultural_background: values.cultural_background || undefined,
        bio: values.bio || undefined,
        generation: values.generation || undefined,
        is_memorial: values.is_memorial ?? false,
        parent_ids: values.parent_ids ?? [],
      });

      if (result && "error" in result) {
        alert(result.error);
        return;
      }

      router.push(`/dashboard/tree/member/${member.id}`);
    });
  }

  return (
    <Card className="border-amber-100 dark:border-amber-900/20">
      <CardHeader>
        <CardTitle className="text-lg">Profile details</CardTitle>
        <CardDescription>Changes will be reflected across all their recipes and memories.</CardDescription>
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
              <Select defaultValue={member.relation ?? undefined} onValueChange={(v) => setValue("relation", v)}>
                <SelectTrigger id="relation">
                  <SelectValue placeholder="Select relation" />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONS.map((r) => (
                    <SelectItem key={r} value={r.toLowerCase().replace(/\s+/g, "-")}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="country">Country of origin</Label>
              <Input id="country" placeholder="e.g. Vietnam, Italy, Mexico" {...register("country_of_origin")} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="culture">Cultural background</Label>
              <Input id="culture" placeholder="e.g. Southern Vietnamese" {...register("cultural_background")} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="generation">Generation</Label>
            <Select
              defaultValue={member.generation?.toString() ?? undefined}
              onValueChange={(v) => setValue("generation", Number(v))}
            >
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
          </div>

          {otherMembers.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Parents in family tree</Label>
              <div className="flex flex-col gap-2 rounded-lg border border-amber-100 bg-amber-50/50 p-3 dark:border-amber-900/20 dark:bg-amber-950/10">
                {otherMembers.map((m) => (
                  <label key={m.id} htmlFor={`parent-${m.id}`} className="flex cursor-pointer items-center gap-2.5">
                    <Checkbox
                      id={`parent-${m.id}`}
                      checked={selectedParentIds.includes(m.id)}
                      onCheckedChange={(checked) => toggleParent(m.id, !!checked)}
                    />
                    <span className="text-sm">
                      {m.name}
                      {m.relation ? <span className="text-muted-foreground"> ({m.relation})</span> : null}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-muted-foreground text-xs">
                Select one or both parents. Determines connector lines in the tree.
              </p>
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
              {isPending ? "Saving..." : "Save changes"}
            </Button>
            <Button variant="outline" asChild>
              <a href={`/dashboard/tree/member/${member.id}`}>Cancel</a>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
