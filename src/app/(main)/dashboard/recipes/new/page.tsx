import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getFamilyMember, getFamilyMembers } from "@/server/family-actions";

import { NewRecipeForm } from "./_components/new-recipe-form";

export default async function NewRecipePage({ searchParams }: { searchParams?: Promise<{ member?: string }> }) {
  const resolvedParams = await searchParams;
  const memberId = resolvedParams?.member;

  const [members, memberData] = await Promise.all([
    getFamilyMembers(),
    memberId ? getFamilyMember(memberId) : Promise.resolve(null),
  ]);

  const memberName = memberData?.name ?? null;
  const backHref = memberId ? `/dashboard/tree/member/${memberId}` : "/dashboard/recipes";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <a href={backHref}>
            <ArrowLeft className="size-4" />
          </a>
        </Button>
        <div>
          <h1 className="font-semibold text-2xl">Add Recipe</h1>
          <p className="text-muted-foreground text-sm">
            {memberId && memberName
              ? `Adding a recipe for ${memberName}`
              : "Preserve a family recipe — from a photo or by hand."}
          </p>
        </div>
      </div>

      <NewRecipeForm members={members} preselectedMemberId={memberId} preselectedMemberName={memberName ?? undefined} />
    </div>
  );
}
