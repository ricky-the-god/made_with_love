"use client";

import { useTransition } from "react";

import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleFavorite } from "@/server/recipe-actions";

interface FavoriteButtonProps {
  recipeId: string;
  isFavorite: boolean;
}

export function FavoriteButton({ recipeId, isFavorite }: FavoriteButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleFavorite(recipeId, isFavorite);
    });
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isPending}
      className={cn("text-amber-400 hover:text-amber-500", isFavorite && "text-amber-500")}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={cn("size-5", isFavorite && "fill-amber-400")} />
    </Button>
  );
}
