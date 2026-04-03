"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { BookOpen, Heart, Pencil, Star, X } from "lucide-react";

import { getRelationLabel } from "@/lib/family-constants";
import type { FamilyMember } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

interface BookOpenModalProps {
  member: FamilyMember;
  recipes: { id: string; title: string; is_favorite: boolean }[];
  coverColors: { bg: string; spine: string };
  onClose: () => void;
  readOnly?: boolean;
}

const CLOSE_DURATION = 550;

export function BookOpenModal({ member, recipes, coverColors, onClose, readOnly }: BookOpenModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isClosingRef = useRef(false);

  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsOpen(false);
    setTimeout(onClose, CLOSE_DURATION);
  }, [onClose]);

  // Trigger open animation on mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Keyboard dismiss — window-level so it works regardless of focus
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  const visibleRecipes = recipes.slice(0, 6);
  const hasMore = recipes.length > 6;
  const relationLabel = getRelationLabel(member.relation);

  return (
    /* Backdrop */
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape handled by window keydown listener above
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss is a secondary affordance; dialog role handles a11y
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: aria-label omitted intentionally on presentation element
    <div
      role="presentation"
      className={cn(
        "fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm",
        "transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0",
      )}
      onClick={handleClose}
    >
      {/* Book container — role="dialog" handles a11y; stops click propagation */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${member.name}'s cookbook`}
        className="relative"
        style={{ perspective: "1200px" }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") handleClose();
        }}
      >
        {/* Open book pages — fade in when open, fade out as cover swings back */}
        <div
          className="flex overflow-hidden rounded-r-2xl shadow-2xl transition-opacity duration-300"
          style={{ width: 600, height: 380, opacity: isOpen ? 1 : 0 }}
        >
          {/* ── Left page: member info ─────────────────────────────────────── */}
          <div className="relative flex w-1/2 flex-col gap-3 bg-[#f0ece3] p-6">
            {/* Spine strip */}
            <div className={cn("absolute top-0 left-0 h-full w-3 shrink-0", coverColors.spine)} />

            <div className="pl-4">
              <div className="flex items-start gap-2">
                <div>
                  <h2 className="font-bold text-amber-800 text-xl leading-tight dark:text-amber-700">{member.name}</h2>
                  {(relationLabel || member.country_of_origin) && (
                    <p className="mt-0.5 text-muted-foreground text-xs capitalize">
                      {[relationLabel, member.country_of_origin].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
                {member.is_memorial && (
                  <span className="mt-0.5 shrink-0 rounded-full bg-stone-300/60 px-2 py-0.5 text-[10px] text-stone-600">
                    In memory
                  </span>
                )}
              </div>

              {member.bio ? (
                <p className="mt-3 line-clamp-5 text-muted-foreground text-sm italic leading-relaxed">{member.bio}</p>
              ) : (
                <p className="mt-3 text-muted-foreground/60 text-sm italic">No story written yet.</p>
              )}

              <div className="mt-4 flex gap-2">
                {!readOnly && (
                  <a
                    href={`/dashboard/tree/member/${member.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-3 py-1.5 font-medium text-sm text-white transition-colors hover:bg-amber-800"
                  >
                    <BookOpen className="size-3.5" />
                    View profile
                  </a>
                )}
                {!readOnly && (
                  <a
                    href={`/dashboard/tree/member/${member.id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-3 py-1.5 font-medium text-amber-800 text-sm transition-colors hover:bg-amber-50"
                  >
                    <Pencil className="size-3.5" />
                    Edit / Link
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* ── Right page: recipe list ────────────────────────────────────── */}
          <div className="flex w-1/2 flex-col bg-stone-50 p-6 dark:bg-stone-100">
            <p className="font-semibold text-[10px] text-stone-500 uppercase tracking-widest">Recipes</p>

            {recipes.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                <p className="text-muted-foreground text-sm">No recipes yet.</p>
                <a
                  href={`/dashboard/recipes/new?member=${member.id}`}
                  className="text-amber-700 text-xs hover:underline"
                >
                  Add the first recipe
                </a>
              </div>
            ) : (
              <>
                <ul className="mt-3 flex flex-1 flex-col gap-1 overflow-y-auto">
                  {visibleRecipes.map((recipe) => (
                    <li key={recipe.id}>
                      <a
                        href={`/dashboard/recipes/${recipe.id}`}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-stone-700 transition-colors hover:bg-amber-50 hover:text-amber-800"
                      >
                        {recipe.is_favorite && <Star className="size-3 shrink-0 fill-amber-400 text-amber-400" />}
                        <span className="line-clamp-1">{recipe.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>

                {hasMore && (
                  <a
                    href={`/dashboard/tree/member/${member.id}`}
                    className="mt-2 text-amber-700 text-xs hover:underline"
                  >
                    View all {recipes.length} recipes →
                  </a>
                )}
              </>
            )}

            {/* Heart / favorite visual — bottom-right */}
            <div className="mt-auto flex justify-end pt-2">
              <Heart className="size-4 text-stone-300" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* ── Cover (animates open on mount, closed on dismiss) ──────────── */}
        <div
          className={cn("absolute inset-0 flex overflow-hidden rounded-2xl", "pointer-events-none")}
          style={{
            transformOrigin: "left center",
            transition: `transform ${CLOSE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            transform: isOpen ? "rotateY(-160deg)" : "rotateY(0deg)",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Spine */}
          <div className={cn("w-3 shrink-0", coverColors.spine)} />

          {/* Cover face */}
          <div className={cn("flex flex-1 flex-col justify-between p-5", coverColors.bg)}>
            <p className="text-[9px] text-white/40 uppercase tracking-widest">Made with Love</p>
            <div>
              <p className="font-bold text-base text-white leading-tight">{member.name}</p>
              {relationLabel && <p className="mt-1 text-white/60 text-xs capitalize">{relationLabel}</p>}
            </div>
            <p className="text-[9px] text-white/40">
              {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
            </p>
          </div>
        </div>

        {/* ── Close button (top-right of open book) ─────────────────────── */}
        <button
          type="button"
          onClick={handleClose}
          className={cn(
            "absolute top-3 right-3 z-20 rounded-full bg-white/80 p-1 text-stone-500 shadow-sm transition-all hover:bg-white hover:text-stone-800",
            "opacity-0 transition-opacity delay-300 duration-300",
            isOpen && "opacity-100",
          )}
          aria-label="Close"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
