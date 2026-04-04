import { notFound } from "next/navigation";

import { CookingSession } from "@/app/(main)/dashboard/recipes/[id]/cook/_components/cooking-session";
import { getPublicRecipe } from "@/server/recipe-actions";

export default async function PublicCookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = await getPublicRecipe(id);

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

  const stepImages: string[] = recipe.step_images
    ? recipe.step_images
        .split("\n")
        .map((l: string) => l.trim())
        .filter(Boolean)
    : [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/70 to-white px-4 py-8 sm:px-6 lg:px-8 dark:from-stone-900/70 dark:to-stone-950">
      <CookingSession
        recipeId={id}
        recipeTitle={recipe.title}
        steps={steps}
        stepImages={stepImages}
        ingredients={recipe.ingredients ?? ""}
        backHref={`/recipes/${id}`}
      />
    </main>
  );
}
