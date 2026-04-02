import { notFound } from "next/navigation";

import { ArrowLeft, ChefHat, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { FamilyMember, Memory } from "@/lib/supabase/types";
import { getRecipe } from "@/server/recipe-actions";

import { AddMemoryForm } from "./_components/add-memory-form";
import { FavoriteButton } from "./_components/favorite-button";

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const recipe = await getRecipe(id);

  if (!recipe) {
    notFound();
  }

  const member = recipe.family_members as Pick<
    FamilyMember,
    "id" | "name" | "photo_url" | "relation" | "country_of_origin"
  > | null;
  const memories = (recipe.memories ?? []) as Memory[];

  // Parse ingredients and steps into lines for display
  const ingredientLines: string[] = recipe.ingredients
    ? recipe.ingredients.split("\n").filter((l: string) => l.trim())
    : [];
  const stepLines: string[] = recipe.steps ? recipe.steps.split("\n").filter((l: string) => l.trim()) : [];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <a href="/dashboard/recipes">
            <ArrowLeft className="size-4" />
          </a>
        </Button>
      </div>

      {/* Hero */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-amber-100 bg-amber-50/30 dark:border-amber-900/20 dark:bg-amber-950/10">
        {recipe.image_url ? (
          <img src={recipe.image_url} alt={recipe.title} className="aspect-[3/1] w-full object-cover" />
        ) : (
          <div className="aspect-[3/1] bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/20 dark:to-amber-800/20" />
        )}

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-bold text-2xl leading-tight">{recipe.title}</h1>
              <p className="mt-1 text-muted-foreground text-sm">
                {[member ? `By ${member.name}` : null, member?.country_of_origin ?? recipe.country_of_origin]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            <div className="flex gap-2">
              <FavoriteButton recipeId={recipe.id} isFavorite={recipe.is_favorite} />
              <Button variant="outline" size="sm" asChild>
                <a href={`/dashboard/recipes/${id}/edit`}>
                  <Edit className="size-3.5" /> Edit
                </a>
              </Button>
            </div>
          </div>

          {(recipe.prep_time || recipe.cook_time || recipe.servings) && (
            <div className="mt-4 flex flex-wrap gap-2 text-muted-foreground text-sm">
              {recipe.prep_time && <span>Prep: {recipe.prep_time}</span>}
              {recipe.prep_time && recipe.cook_time && <span>·</span>}
              {recipe.cook_time && <span>Cook: {recipe.cook_time}</span>}
              {(recipe.prep_time || recipe.cook_time) && recipe.servings && <span>·</span>}
              {recipe.servings && <span>{recipe.servings} servings</span>}
            </div>
          )}
        </div>
      </div>

      {/* Memories / Stories — shown before ingredients by design */}
      <div className="mb-6 rounded-xl border border-amber-100 bg-amber-50/50 p-5 dark:border-amber-900/20 dark:bg-amber-950/10">
        <p className="mb-3 font-semibold text-amber-800 text-sm dark:text-amber-300">The story behind this dish</p>

        {memories.length > 0 ? (
          <div className="flex flex-col gap-4">
            {memories.map((memory) => (
              <div key={memory.id} className="flex flex-col gap-1">
                {memory.occasion && (
                  <p className="font-medium text-amber-700 text-xs dark:text-amber-400">{memory.occasion}</p>
                )}
                {memory.text && <p className="text-muted-foreground text-sm leading-relaxed italic">{memory.text}</p>}
                {memory.meaning_note && <p className="mt-1 text-muted-foreground text-xs">{memory.meaning_note}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm leading-relaxed italic">
            No memory added yet. This is where the soul of the recipe lives.
          </p>
        )}

        <AddMemoryForm recipeId={recipe.id} />
      </div>

      {/* Description */}
      {recipe.description && (
        <>
          <p className="mb-6 text-muted-foreground text-sm leading-relaxed">{recipe.description}</p>
          <Separator className="my-6" />
        </>
      )}

      <Separator className="my-6" />

      {/* Ingredients */}
      <div className="mb-6">
        <h2 className="mb-4 font-semibold text-lg">Ingredients</h2>
        {ingredientLines.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {ingredientLines.map((line, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static ordered list
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-400" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">No ingredients listed yet.</p>
        )}
      </div>

      <Separator className="my-6" />

      {/* Steps */}
      <div className="mb-6">
        <h2 className="mb-4 font-semibold text-lg">Steps</h2>
        {stepLines.length > 0 ? (
          <ol className="flex flex-col gap-4">
            {stepLines.map((line, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static ordered list
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-100 font-semibold text-amber-800 text-xs dark:bg-amber-900/30 dark:text-amber-300">
                  {i + 1}
                </span>
                <span className="mt-0.5 leading-relaxed">
                  {/* Strip leading "1. " style numbering if present */}
                  {line.replace(/^\d+\.\s*/, "")}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-muted-foreground text-sm">No steps listed yet.</p>
        )}
      </div>

      {/* Notes */}
      {recipe.notes && (
        <>
          <Separator className="my-6" />
          <div className="mb-6 rounded-xl border border-amber-100 bg-amber-50/30 p-4 dark:border-amber-900/20 dark:bg-amber-950/10">
            <p className="mb-1 font-semibold text-sm">Notes</p>
            <p className="text-muted-foreground text-sm leading-relaxed">{recipe.notes}</p>
          </div>
        </>
      )}

      <Separator className="my-6" />

      {/* Cook CTA */}
      <Button asChild size="lg" className="w-full bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600">
        <a href={`/dashboard/recipes/${id}/cook`}>
          <ChefHat className="size-5" />
          Start cooking
        </a>
      </Button>
    </div>
  );
}
