"use client";

import { useState } from "react";

import Image from "next/image";

import { X } from "lucide-react";

interface IngredientChipProps {
  emoji: string;
  displayText: string;
  imageUrl?: string;
  onRemove: () => void;
}

export function IngredientChip({ emoji, displayText, imageUrl, onRemove }: IngredientChipProps) {
  const [imageError, setImageError] = useState(false);
  const shouldShowImage = imageUrl && !imageError;

  return (
    <div className="group flex items-center gap-2 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-50/50 py-1.5 pr-1.5 pl-1.5 shadow-sm transition-all hover:border-amber-300 hover:shadow-md dark:border-amber-700/40 dark:bg-gradient-to-r dark:from-amber-900/20 dark:to-amber-900/10 dark:hover:border-amber-600/60">
      {/* Image or Emoji thumbnail */}
      <div className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-amber-200/50 bg-amber-100 dark:border-amber-700/30 dark:bg-amber-900/40">
        {shouldShowImage ? (
          <Image
            src={imageUrl}
            alt={displayText}
            width={28}
            height={28}
            className="size-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <span className="text-sm leading-none" aria-hidden>
            {emoji}
          </span>
        )}
      </div>

      {/* Name */}
      <span className="max-w-[120px] truncate font-medium text-amber-900 text-sm dark:text-amber-100">
        {displayText}
      </span>

      {/* Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${displayText}`}
        className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full text-amber-700 transition-colors hover:bg-amber-200 hover:text-amber-900 dark:text-amber-300 dark:hover:bg-amber-800/60 dark:hover:text-amber-100"
      >
        <X className="size-3.5" strokeWidth={3} />
      </button>
    </div>
  );
}
