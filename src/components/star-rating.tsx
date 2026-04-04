"use client";

import { useState, useTransition } from "react";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { rateRecipe } from "@/server/recipe-actions";

interface StarRatingProps {
  recipeId: string;
  myRating: number | null;
  average: number | null;
  count: number;
  className?: string;
}

export function StarRating({ recipeId, myRating: initialMyRating, average, count, className }: StarRatingProps) {
  const [myRating, setMyRating] = useState<number | null>(initialMyRating);
  const [hovered, setHovered] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const active = hovered ?? myRating ?? 0;

  function handleRate(star: number) {
    startTransition(async () => {
      const prev = myRating;
      setMyRating(star);
      const result = await rateRecipe(recipeId, star);
      if (result?.error) {
        setMyRating(prev);
      }
    });
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <fieldset className="flex items-center gap-0.5 border-0 p-0 m-0" onMouseLeave={() => setHovered(null)}>
        <legend className="sr-only">Rate this recipe</legend>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={isPending}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHovered(star)}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            className="rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Star
              className={cn(
                "size-5 transition-colors",
                star <= active ? "fill-amber-400 text-amber-400" : "fill-none text-muted-foreground/40",
              )}
            />
          </button>
        ))}
      </fieldset>

      <div className="text-muted-foreground text-xs">
        {myRating ? (
          <span>
            Your rating: <span className="font-medium text-amber-700 dark:text-amber-400">{myRating}/5</span>
            {count > 1 && (
              <>
                {" "}
                · avg {average?.toFixed(1)} ({count})
              </>
            )}
          </span>
        ) : average !== null ? (
          <span>
            {average.toFixed(1)} / 5 · {count} {count === 1 ? "rating" : "ratings"}
          </span>
        ) : (
          <span>No ratings yet — be the first</span>
        )}
      </div>
    </div>
  );
}
