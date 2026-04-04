import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getFamilyRecipes } from "@/server/recipe-actions";

import { RecipeCard } from "./_components/recipe-card";
import { RecipesFilterBar } from "./_components/recipes-filter-bar";

export default async function RecipesPage({ searchParams }: { searchParams?: Promise<{ filter?: string }> }) {
  const resolvedParams = await searchParams;
  const recipes = await getFamilyRecipes();

  const displayed = resolvedParams?.filter === "favorites" ? recipes.filter((r) => r.is_favorite) : recipes;

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl">Recipes</h1>
          <p className="mt-1 text-muted-foreground text-sm">All the recipes your family has preserved.</p>
        </div>
        <Button
          asChild
          className="bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
        >
          <a href="/dashboard/recipes/new">
            <Plus className="size-4" />
            Add Recipe
          </a>
        </Button>
      </div>

      <RecipesFilterBar />

      {displayed.length === 0 && recipes.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-amber-200 border-dashed bg-amber-50/50 py-24 dark:border-amber-900/30 dark:bg-amber-950/10">
          <h2 className="font-semibold text-lg">No recipes yet</h2>
          <p className="mt-2 max-w-sm text-center text-muted-foreground text-sm">
            Every recipe tells a story. Add the first one to your family's collection.
          </p>
          <Button asChild className="mt-6 bg-amber-700 text-white hover:bg-amber-800">
            <a href="/dashboard/recipes/new">
              <Plus className="size-4" />
              Add your first recipe
            </a>
          </Button>
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-amber-200 border-dashed bg-amber-50/50 py-24 dark:border-amber-900/30 dark:bg-amber-950/10">
          <h2 className="font-semibold text-lg">No favourites yet</h2>
          <p className="mt-2 max-w-sm text-center text-muted-foreground text-sm">
            Mark recipes with a heart to find them here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={{
                id: recipe.id,
                title: recipe.title,
                is_favorite: recipe.is_favorite,
                prep_time: recipe.prep_time,
                cook_time: recipe.cook_time,
                country_of_origin: recipe.country_of_origin,
                member_id: recipe.member_id,
                recipe_ratings: recipe.recipe_ratings as { rating: number }[] | null,
                family_members: recipe.family_members as {
                  id: string;
                  name: string;
                  photo_url: string | null;
                  relation: string | null;
                } | null,
                culture_tag: (recipe as Record<string, unknown>).culture_tag as string | null ?? null,
                image_url: (recipe as Record<string, unknown>).image_url as string | null ?? null,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
