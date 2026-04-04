"use client";

import { Clock, Heart, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getRelationLabel } from "@/lib/family-constants";

const CATEGORY_EMOJI: Record<string, string> = {
  Appetizer: "🥗",
  Breakfast: "🍳",
  Bread: "🍞",
  Condiment: "🧂",
  Dessert: "🍰",
  Dinner: "🍽️",
  Drink: "🥤",
  Holiday: "🎊",
  Lunch: "🥙",
  "Main dish": "🍲",
  Noodles: "🍜",
  Preserve: "🫙",
  "Rice dish": "🍚",
  Salad: "🥗",
  Sauce: "🫕",
  "Side dish": "🥦",
  Snack: "🥨",
  Soup: "🍵",
  Stew: "🥘",
  "Street food": "🌮",
};

function getCategoryEmoji(culture_tag: string | null): string {
  if (!culture_tag) return "🍴";
  return CATEGORY_EMOJI[culture_tag] ?? "🍴";
}

function getMemberInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    is_favorite: boolean;
    prep_time: string | null;
    cook_time: string | null;
    country_of_origin: string | null;
    culture_tag: string | null;
    image_url: string | null;
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
    ratingCount > 0 && recipe.recipe_ratings
      ? recipe.recipe_ratings.reduce((sum, review) => sum + review.rating, 0) / ratingCount
      : null;

  const displayBadge = recipe.culture_tag ?? recipe.country_of_origin;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-amber-100 bg-amber-50/30 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50/60 hover:shadow-md dark:border-amber-900/20 dark:bg-amber-950/10 dark:hover:border-amber-800/40 dark:hover:bg-amber-950/20">
      {/* Stretched link — covers the whole card, sits below interactive children */}
      <a
        href={href ?? `/dashboard/recipes/${recipe.id}`}
        className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        <span className="sr-only">{recipe.title}</span>
      </a>

      {/* Image area */}
      <div className="relative aspect-[3/1] overflow-hidden">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/20 dark:to-amber-800/20">
            <span className="text-4xl leading-none select-none" aria-hidden>
              {getCategoryEmoji(recipe.culture_tag)}
            </span>
          </div>
        )}

        {/* Favorite heart overlay */}
        {recipe.is_favorite && (
          <div className="absolute top-2 right-2 z-10 flex size-7 items-center justify-center rounded-full bg-white/80 dark:bg-black/40">
            <Heart className="size-3.5 fill-amber-400 text-amber-400" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="font-semibold text-foreground leading-snug group-hover:text-amber-800 dark:group-hover:text-amber-300">
          {recipe.title}
        </p>

        {member && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            {/* Member avatar */}
            <div className="relative z-10 flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-amber-200 text-[9px] font-bold uppercase text-amber-800 dark:bg-amber-800/50 dark:text-amber-300">
              {member.photo_url ? (
                <img
                  src={member.photo_url}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                getMemberInitials(member.name)
              )}
            </div>
            <span>
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
            </span>
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
          {displayBadge && (
            <Badge
              variant="secondary"
              className="border-0 bg-amber-100 px-2 py-0 text-amber-700 text-xs dark:bg-amber-900/30 dark:text-amber-300"
            >
              {displayBadge}
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
