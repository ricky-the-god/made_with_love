import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getFamilyMembers } from "@/server/family-actions";
import { getFamilyRecipes } from "@/server/recipe-actions";

import { FamilyTreeCanvas } from "./_components/family-tree-canvas";

const GENERATION_LABELS: Record<number, string> = {
  1: "Great-grandparents",
  2: "Grandparents",
  3: "Parents",
  4: "My Generation",
  5: "Children",
};

export default async function TreePage() {
  const [members, recipes] = await Promise.all([getFamilyMembers(), getFamilyRecipes()]);

  // recipe count per member
  const recipeCountByMember: Record<string, number> = {};
  const recipesByMember: Record<string, { id: string; title: string; is_favorite: boolean }[]> = {};
  for (const recipe of recipes) {
    if (recipe.member_id) {
      recipeCountByMember[recipe.member_id] = (recipeCountByMember[recipe.member_id] ?? 0) + 1;
      if (!recipesByMember[recipe.member_id]) recipesByMember[recipe.member_id] = [];
      recipesByMember[recipe.member_id].push({ id: recipe.id, title: recipe.title, is_favorite: recipe.is_favorite });
    }
  }

  // Group by generation
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl text-foreground">Family Tree</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Your living family archive — tap a person to explore their recipes and memories.
          </p>
        </div>
        <Button
          asChild
          className="bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
        >
          <a href="/dashboard/tree/member/new">
            <Plus className="size-4" />
            Add Member
          </a>
        </Button>
      </div>

      {/* Empty state */}
      {members.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-amber-200 border-dashed bg-amber-50/50 py-24 dark:border-amber-900/30 dark:bg-amber-950/10">
          <h2 className="font-semibold text-foreground text-lg">Your family tree starts here</h2>
          <p className="mt-2 max-w-sm text-center text-muted-foreground text-sm">
            Add the first person whose recipes and stories you want to preserve.
          </p>
          <Button
            asChild
            className="mt-6 bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
          >
            <a href="/dashboard/tree/member/new">
              <Plus className="size-4" />
              Add your first family member
            </a>
          </Button>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden rounded-2xl border border-amber-100 bg-amber-50/20 dark:border-amber-900/20 dark:bg-amber-950/5">
          <FamilyTreeCanvas
            rows={rows}
            members={members}
            recipeCountByMember={recipeCountByMember}
            recipesByMember={recipesByMember}
          />
        </div>
      )}
    </div>
  );
}
