import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getFamilyMembers } from "@/server/family-actions";

import { NewRecipeForm } from "./_components/new-recipe-form";

export default async function NewRecipePage() {
  const members = await getFamilyMembers();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <a href="/dashboard/recipes">
            <ArrowLeft className="size-4" />
          </a>
        </Button>
        <div>
          <h1 className="font-semibold text-2xl">Add Recipe</h1>
          <p className="text-muted-foreground text-sm">Preserve a family recipe — from a photo or by hand.</p>
        </div>
      </div>

      <NewRecipeForm members={members} />
    </div>
  );
}
