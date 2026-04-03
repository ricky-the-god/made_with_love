import { notFound } from "next/navigation";

import { ArrowLeft, BookOpen, Clock, Edit, Plus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/lib/utils";
import { getFamilyMember } from "@/server/family-actions";
import { getMemberRecipes } from "@/server/recipe-actions";

import { DeleteMemberButton } from "./_components/delete-member-button";

export default async function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [member, recipes] = await Promise.all([getFamilyMember(id), getMemberRecipes(id)]);

  if (!member) {
    notFound();
  }

  const initials = getInitials(member.name);
  const firstName = member.name.split(" ")[0];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <a href="/dashboard/tree">
            <ArrowLeft className="size-4" />
          </a>
        </Button>
        <h1 className="font-semibold text-foreground text-xl">{member.name}&apos;s Cookbook</h1>
      </div>

      {/* Profile header */}
      <div className="mb-6 flex items-start gap-5 rounded-2xl border border-amber-100 bg-amber-50/30 p-6 dark:border-amber-900/20 dark:bg-amber-950/10">
        <Avatar className="size-20 rounded-xl">
          {member.photo_url && (
            <AvatarImage src={member.photo_url} alt={member.name} className="rounded-xl object-cover" />
          )}
          <AvatarFallback className="rounded-xl bg-amber-100 text-2xl text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-2xl">{member.name}</h2>
                {member.is_memorial && (
                  <Badge
                    variant="secondary"
                    className="border-0 bg-stone-100 text-stone-500 dark:bg-stone-800/50 dark:text-stone-400"
                  >
                    In memory
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 text-muted-foreground">
                {[member.relation, member.country_of_origin].filter(Boolean).join(" · ")}
              </p>
              {member.cultural_background && (
                <p className="text-muted-foreground text-sm">{member.cultural_background}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={`/dashboard/tree/member/${id}/edit`}>
                  <Edit className="size-3.5" />
                  Edit
                </a>
              </Button>
              <DeleteMemberButton memberId={id} memberName={member.name} />
            </div>
          </div>

          {member.bio ? (
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
          ) : (
            <p className="mt-3 text-muted-foreground text-sm italic leading-relaxed">
              No biography added yet. Share who this person is, their cooking style, and what makes their food so
              meaningful.
            </p>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Button
          asChild
          className="bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
        >
          <a href={`/dashboard/recipes/new?member=${member.id}`}>
            <Plus className="size-4" />
            Add recipe for {firstName}
          </a>
        </Button>
      </div>

      <Separator className="my-6" />

      {/* Recipes */}
      <div>
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h3 className="font-semibold text-lg">{firstName}&apos;s Recipes</h3>
          <p className="text-muted-foreground text-sm">
            {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"} preserved
          </p>
        </div>

        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-amber-200 border-dashed py-12 dark:border-amber-900/30">
            <BookOpen className="mb-3 size-10 text-amber-300" />
            <p className="font-medium">No recipes yet</p>
            <p className="mt-1 text-muted-foreground text-sm">
              Be the first to preserve one of {firstName}&apos;s dishes.
            </p>
            <Button asChild className="mt-4 bg-amber-700 text-white hover:bg-amber-800">
              <a href={`/dashboard/recipes/new?member=${member.id}`}>
                <Plus className="size-4" />
                Add recipe for {firstName}
              </a>
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {recipes.map((recipe) => (
              <a
                key={recipe.id}
                href={`/dashboard/recipes/${recipe.id}`}
                className="group rounded-xl border border-amber-100 bg-amber-50/30 p-4 transition-colors hover:border-amber-300 hover:bg-amber-50/60 dark:border-amber-900/20 dark:bg-amber-950/10 dark:hover:border-amber-800/40"
              >
                <p className="font-semibold text-foreground group-hover:text-amber-800 dark:group-hover:text-amber-300">
                  {recipe.title}
                </p>
                {recipe.country_of_origin && (
                  <p className="mt-0.5 text-muted-foreground text-xs">{recipe.country_of_origin}</p>
                )}
                {(recipe.prep_time || recipe.cook_time) && (
                  <div className="mt-2 flex items-center gap-1 text-muted-foreground text-xs">
                    <Clock className="size-3" />
                    <span>
                      {[recipe.prep_time && `Prep ${recipe.prep_time}`, recipe.cook_time && `Cook ${recipe.cook_time}`]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </div>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
