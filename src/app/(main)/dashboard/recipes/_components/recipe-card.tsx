"use client";

import { Clock, Heart, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getRelationLabel } from "@/lib/family-constants";

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    is_favorite: boolean;
    prep_time: string | null;
    cook_time: string | null;
    country_of_origin: string | null;
    member_id: string | null;
    recipe_ratings?: { rating: number }[] | null;
    family_members: {
      id: string;
      name: string;
      photo_url: string | null;
      relation: string | null;
    } | null;
  };
  href?: string;
}

export function RecipeCard({ recipe, href }: RecipeCardProps) {
  const member = recipe.family_members;
  const relationLabel = getRelationLabel(member?.relation);
  const ratingCount = Array.isArray(recipe.recipe_ratings) ? recipe.recipe_ratings.length : 0;
  const averageRating =
    ratingCount > 0 ? recipe.recipe_ratings?.reduce((sum, review) => sum + review.rating, 0) / ratingCount : null;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-amber-100 bg-amber-50/30 transition-colors hover:border-amber-300 hover:bg-amber-50/60 dark:border-amber-900/20 dark:bg-amber-950/10 dark:hover:border-amber-800/40 dark:hover:bg-amber-950/20">
      {/* Stretched link — covers the whole card, sits below interactive children */}
      <a
        href={href ?? `/dashboard/recipes/${recipe.id}`}
        className="absolute inset-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        <span className="sr-only">{recipe.title}</span>
      </a>

      {/* Image placeholder */}
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
            By{" "}
            {member.id ? (
              <a
                href={`/dashboard/tree/member/${member.id}`}
                className="relative z-10 hover:text-amber-700 hover:underline"
              >
                {member.name}
              </a>
            ) : (
              member.name
            )}
            {relationLabel ? ` · ${relationLabel}` : ""}
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
          {ratingCount > 0 && averageRating !== null && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/80 px-2 py-0.5 text-amber-700 text-xs dark:bg-amber-900/30 dark:text-amber-300">
              <Star className="size-3 fill-current" />
              {averageRating.toFixed(1)} ({ratingCount})
            </span>
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
    </div>
  );
}
