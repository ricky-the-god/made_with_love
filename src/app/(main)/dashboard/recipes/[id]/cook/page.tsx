import { notFound } from "next/navigation";

import { getRecipe } from "@/server/recipe-actions";

import { CookingSession } from "./_components/cooking-session";

export default async function GuidedCookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    notFound();
  }

  const steps: string[] = recipe.steps
    ? recipe.steps
        .split("\n")
        .map((l: string) => l.trim())
        .filter(Boolean)
        .map((l: string) => l.replace(/^\d+\.\s*/, ""))
    : [];

  return (
    <CookingSession recipeId={id} recipeTitle={recipe.title} steps={steps} ingredients={recipe.ingredients ?? ""} />
  );
}
