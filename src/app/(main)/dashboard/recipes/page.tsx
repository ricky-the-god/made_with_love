import { Clock, Heart, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFamilyRecipes } from "@/server/recipe-actions";

export default async function RecipesPage() {
  const recipes = await getFamilyRecipes();

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

      {recipes.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-amber-200 bg-amber-50/50 py-24 dark:border-amber-900/30 dark:bg-amber-950/10">
          <div className="mb-4 text-6xl">📖</div>
          <h2 className="font-semibold text-lg">No recipes yet</h2>
          <p className="mt-2 max-w-sm text-center text-muted-foreground text-sm">
            Preserve your first family recipe — upload a handwritten card or create one manually.
          </p>
          <Button asChild className="mt-6 bg-amber-700 text-white hover:bg-amber-800">
            <a href="/dashboard/recipes/new">
              <Plus className="size-4" />
              Add your first recipe
            </a>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => {
            const member = recipe.family_members as {
              id: string;
              name: string;
              photo_url: string | null;
              relation: string | null;
            } | null;
            return (
              <a
                key={recipe.id}
                href={`/dashboard/recipes/${recipe.id}`}
                className="group flex flex-col rounded-2xl border border-amber-100 bg-amber-50/30 transition-colors hover:border-amber-300 hover:bg-amber-50/60 dark:border-amber-900/20 dark:bg-amber-950/10 dark:hover:border-amber-800/40 dark:hover:bg-amber-950/20 overflow-hidden"
              >
                {/* Image placeholder or tinted header */}
                <div className="aspect-[3/1] bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/20 dark:to-amber-800/20" />

                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-foreground leading-snug group-hover:text-amber-800 dark:group-hover:text-amber-300">
                      {recipe.title}
                    </p>
                    {recipe.is_favorite && <Heart className="mt-0.5 size-4 shrink-0 fill-amber-400 text-amber-400" />}
                  </div>

                  {member && (
                    <p className="text-muted-foreground text-sm">
                      By {member.name}
                      {member.relation ? ` · ${member.relation}` : ""}
                    </p>
                  )}

                  <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
                    {recipe.country_of_origin && (
                      <Badge
                        variant="secondary"
                        className="border-0 bg-amber-100 px-2 py-0 text-amber-700 text-xs dark:bg-amber-900/30 dark:text-amber-300"
                      >
                        {recipe.country_of_origin}
                      </Badge>
                    )}
                    {(recipe.prep_time || recipe.cook_time) && (
                      <span className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Clock className="size-3" />
                        {[
                          recipe.prep_time && `Prep ${recipe.prep_time}`,
                          recipe.cook_time && `Cook ${recipe.cook_time}`,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
