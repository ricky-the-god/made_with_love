import { notFound } from "next/navigation";

import { ArrowLeft, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getConnectedFamilies, getPublicFamilyInfo, getPublicFamilyMembers } from "@/server/family-actions";
import { getPublicFamilyRecipes } from "@/server/recipe-actions";

import { FamilyTreeCanvas } from "../../../tree/_components/family-tree-canvas";
import { FriendButton } from "./_components/friend-button";

const GENERATION_LABELS: Record<number, string> = {
  1: "Great-grandparents",
  2: "Grandparents",
  3: "Parents",
  4: "My Generation",
  5: "Children",
};

export default async function PublicFamilyTreePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [familyInfo, members, recipes, connections] = await Promise.all([
    getPublicFamilyInfo(id),
    getPublicFamilyMembers(id),
    getPublicFamilyRecipes(id),
    getConnectedFamilies(),
  ]);

  if (!familyInfo) notFound();

  const isConnected = connections.some((c) => c.family_id === id);

  // Build recipe lookups for the tree canvas
  const recipeCountByMember: Record<string, number> = {};
  const recipesByMember: Record<string, { id: string; title: string; is_favorite: boolean }[]> = {};
  for (const recipe of recipes) {
    if (recipe.member_id) {
      recipeCountByMember[recipe.member_id] = (recipeCountByMember[recipe.member_id] ?? 0) + 1;
      if (!recipesByMember[recipe.member_id]) recipesByMember[recipe.member_id] = [];
      recipesByMember[recipe.member_id].push({ id: recipe.id, title: recipe.title, is_favorite: recipe.is_favorite });
    }
  }

  // Group members by generation (same logic as tree page)
  const grouped: Record<number, typeof members> = {};
  const ungrouped: typeof members = [];
  for (const member of members) {
    if (member.generation && member.generation >= 1 && member.generation <= 5) {
      if (!grouped[member.generation]) grouped[member.generation] = [];
      grouped[member.generation].push(member);
    } else {
      ungrouped.push(member);
    }
  }
  const rows = [
    ...[1, 2, 3, 4, 5]
      .filter((g) => (grouped[g]?.length ?? 0) > 0)
      .map((g) => ({ label: GENERATION_LABELS[g], members: grouped[g] })),
    ...(ungrouped.length > 0 ? [{ label: "Others", members: ungrouped }] : []),
  ];

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <a href="/dashboard/discover">
              <ArrowLeft className="size-4" />
            </a>
          </Button>
          <div>
            <h1 className="font-semibold text-2xl">{familyInfo.family_name}</h1>
            <p className="mt-0.5 text-muted-foreground text-sm">Public family cookbook</p>
          </div>
        </div>
        <FriendButton familyId={id} isConnected={isConnected} />
      </div>

      {/* Read-only family tree */}
      {members.length > 0 ? (
        <div className="h-[420px] overflow-hidden rounded-2xl border border-amber-100 bg-amber-50/20 dark:border-amber-900/20 dark:bg-amber-950/5">
          <FamilyTreeCanvas
            rows={rows}
            members={members}
            recipeCountByMember={recipeCountByMember}
            recipesByMember={recipesByMember}
            readOnly
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-200 border-dashed py-12 dark:border-amber-900/30">
          <p className="text-muted-foreground text-sm">No family members added to this tree yet.</p>
        </div>
      )}

      <Separator />

      {/* Public recipes */}
      <div>
        <h2 className="mb-4 font-semibold text-lg">Public Recipes</h2>
        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-amber-200 border-dashed py-12 dark:border-amber-900/30">
            <BookOpen className="mb-3 size-10 text-amber-300" />
            <p className="text-muted-foreground text-sm">No public recipes shared yet.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {recipes.map((recipe) => (
              <a
                key={recipe.id}
                href={`/recipes/${recipe.id}`}
                className="group rounded-xl border border-amber-100 bg-amber-50/30 p-4 transition-colors hover:border-amber-300 hover:bg-amber-50/60 dark:border-amber-900/20 dark:bg-amber-950/10 dark:hover:border-amber-800/40"
              >
                <p className="font-semibold group-hover:text-amber-800 dark:group-hover:text-amber-300">
                  {recipe.title}
                </p>
                {recipe.country_of_origin && (
                  <p className="mt-0.5 text-muted-foreground text-xs">{recipe.country_of_origin}</p>
                )}
                {recipe.description && (
                  <p className="mt-2 line-clamp-2 text-muted-foreground text-xs leading-relaxed">
                    {recipe.description}
                  </p>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
