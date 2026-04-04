"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Link from "next/link";

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
  const [swipeOffsetY, setSwipeOffsetY] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const isClosingRef = useRef(false);
  const closeTimerRef = useRef<number | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const shouldTrackSwipeRef = useRef(false);

  const completeClose = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    onClose();
  }, [onClose]);

  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsOpen(false);
    closeTimerRef.current = window.setTimeout(completeClose, CLOSE_DURATION + 80);
  }, [completeClose]);

  // Trigger open animation on mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Lock body scroll while modal is mounted to keep interactions stable.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Move keyboard focus into the dialog after mount.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
      if (!closeButtonRef.current) dialogRef.current?.focus();
    });
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

  useEffect(
    () => () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    },
    [],
  );

  const visibleRecipes = recipes.slice(0, 6);
  const hasMore = recipes.length > 6;
  const relationLabel = getRelationLabel(member.relation);

  const SWIPE_DISMISS_THRESHOLD = 110;

  function onTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    if (window.matchMedia("(min-width: 640px)").matches || isClosingRef.current) return;

    const touch = event.touches[0];
    if (!touch) return;

    const rect = dialogRef.current?.getBoundingClientRect();
    if (rect) {
      const yFromTop = touch.clientY - rect.top;
      shouldTrackSwipeRef.current = yFromTop <= 96;
    } else {
      shouldTrackSwipeRef.current = true;
    }

    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }

  function onTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    if (!shouldTrackSwipeRef.current || !touchStartRef.current || isClosingRef.current) return;

    const touch = event.touches[0];
    if (!touch) return;

    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;

    if (dy <= 0 || Math.abs(dy) < Math.abs(dx)) return;

    setIsSwiping(true);
    setSwipeOffsetY(Math.min(dy, 180));
  }

  function onTouchEnd() {
    if (!shouldTrackSwipeRef.current) {
      touchStartRef.current = null;
      shouldTrackSwipeRef.current = false;
      return;
    }

    if (swipeOffsetY >= SWIPE_DISMISS_THRESHOLD) {
      handleClose();
    }

    setIsSwiping(false);
    setSwipeOffsetY(0);
    touchStartRef.current = null;
    shouldTrackSwipeRef.current = false;
  }

  return (
    /* Backdrop */
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss is a secondary affordance; dialog role handles a11y
    <div
      role="presentation"
      className={cn(
        "fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm",
        "transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0",
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* Book container — role="dialog" handles a11y; stops click propagation */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${member.name}'s cookbook`}
        tabIndex={-1}
        className="relative w-[min(92vw,640px)]"
        style={{
          perspective: "1200px",
          transform: `translateY(${swipeOffsetY}px)`,
          transition: isSwiping ? "none" : "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        onKeyDown={(e) => {
          if (e.key === "Escape") handleClose();
        }}
        onTransitionEnd={(e) => {
          if (
            e.target instanceof HTMLElement &&
            isClosingRef.current &&
            e.propertyName === "transform" &&
            e.target.style.transformOrigin === "left center"
          ) {
            completeClose();
          }
        }}
      >
        {/* Open book pages — fade in when open, fade out as cover swings back */}
        <div
          className="flex overflow-hidden rounded-r-2xl shadow-2xl transition-opacity duration-300"
          style={{ width: "100%", height: "min(80dvh, 420px)", opacity: isOpen ? 1 : 0 }}
        >
          {/* ── Left page: member info ─────────────────────────────────────── */}
          <div className="relative flex w-1/2 min-w-0 flex-col gap-3 bg-[#f0ece3] p-6 max-sm:p-4">
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
                  <Link
                    href={`/dashboard/tree/member/${member.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-3 py-1.5 font-medium text-sm text-white transition-colors hover:bg-amber-800"
                  >
                    <BookOpen className="size-3.5" />
                    View profile
                  </Link>
                )}
                {!readOnly && (
                  <Link
                    href={`/dashboard/tree/member/${member.id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-3 py-1.5 font-medium text-amber-800 text-sm transition-colors hover:bg-amber-50"
                  >
                    <Pencil className="size-3.5" />
                    Edit / Link
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* ── Right page: recipe list ────────────────────────────────────── */}
          <div className="flex w-1/2 min-w-0 flex-col bg-stone-50 p-6 max-sm:p-4 dark:bg-stone-100">
            <p className="font-semibold text-[10px] text-stone-500 uppercase tracking-widest">Recipes</p>

            {recipes.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                <p className="text-muted-foreground text-sm">No recipes yet.</p>
                <Link
                  href={`/dashboard/recipes/new?member=${member.id}`}
                  className="text-amber-700 text-xs hover:underline"
                >
                  Add the first recipe
                </Link>
              </div>
            ) : (
              <>
                <ul className="mt-3 flex flex-1 flex-col gap-1 overflow-y-auto">
                  {visibleRecipes.map((recipe) => (
                    <li key={recipe.id}>
                      <Link
                        href={`/dashboard/recipes/${recipe.id}`}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-stone-700 transition-colors hover:bg-amber-50 hover:text-amber-800"
                      >
                        {recipe.is_favorite && <Star className="size-3 shrink-0 fill-amber-400 text-amber-400" />}
                        <span className="line-clamp-1">{recipe.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {hasMore && (
                  <Link
                    href={`/dashboard/tree/member/${member.id}`}
                    className="mt-2 text-amber-700 text-xs hover:underline"
                  >
                    View all {recipes.length} recipes →
                  </Link>
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
          ref={closeButtonRef}
          type="button"
          onClick={handleClose}
          disabled={isClosingRef.current}
          className={cn(
            "absolute top-3 right-3 z-20 rounded-full bg-white/80 p-1 text-stone-500 shadow-sm transition-all hover:bg-white hover:text-stone-800",
            "opacity-0 transition-opacity delay-300 duration-300",
            isOpen && "opacity-100",
            isClosingRef.current && "pointer-events-none",
          )}
          aria-label="Close"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
