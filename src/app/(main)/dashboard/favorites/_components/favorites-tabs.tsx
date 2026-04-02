"use client";

import { Clock, Heart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FamilyMember, Recipe } from "@/lib/supabase/types";

type RecipeWithMember = Recipe & {
  family_members: Pick<FamilyMember, "id" | "name" | "photo_url"> | null;
};

interface FavoritesTabsProps {
  personal: RecipeWithMember[];
  family: RecipeWithMember[];
}

function RecipeCard({ recipe }: { recipe: RecipeWithMember }) {
  const member = recipe.family_members;

  return (
    <a
      href={`/dashboard/recipes/${recipe.id}`}
      className="group flex flex-col rounded-2xl border border-amber-100 bg-amber-50/30 transition-colors hover:border-amber-300 hover:bg-amber-50/60 dark:border-amber-900/20 dark:bg-amber-950/10 dark:hover:border-amber-800/40 dark:hover:bg-amber-950/20 overflow-hidden"
    >
      <div className="aspect-[3/1] bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/20 dark:to-amber-800/20" />

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="font-semibold text-foreground leading-snug group-hover:text-amber-800 dark:group-hover:text-amber-300">
          {recipe.title}
        </p>

        {member && <p className="text-muted-foreground text-sm">By {member.name}</p>}

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
              {[recipe.prep_time && `Prep ${recipe.prep_time}`, recipe.cook_time && `Cook ${recipe.cook_time}`]
                .filter(Boolean)
                .join(" · ")}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

export function FavoritesTabs({ personal, family }: FavoritesTabsProps) {
  return (
    <Tabs defaultValue="personal">
      <TabsList>
        <TabsTrigger value="personal">My Favorites</TabsTrigger>
        <TabsTrigger value="family">Family Favorites</TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="mt-6">
        {personal.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-amber-200 bg-amber-50/50 py-20 dark:border-amber-900/30 dark:bg-amber-950/10">
            <Heart className="mb-3 size-10 text-amber-300" />
            <p className="font-medium">No personal favorites yet</p>
            <p className="mt-1 max-w-xs text-center text-muted-foreground text-sm">
              Star any recipe to save it here for quick access.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {personal.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="family" className="mt-6">
        {family.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-amber-200 bg-amber-50/50 py-20 dark:border-amber-900/30 dark:bg-amber-950/10">
            <Heart className="mb-3 size-10 fill-amber-300 text-amber-300" />
            <p className="font-medium">No family favorites yet</p>
            <p className="mt-1 max-w-xs text-center text-muted-foreground text-sm">
              Mark a recipe as a family favorite to celebrate your most iconic dishes.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {family.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
