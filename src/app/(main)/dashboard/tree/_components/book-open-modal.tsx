"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Link from "next/link";

import { BookOpen, Heart, MapPin, Pencil, Star, UtensilsCrossed, X } from "lucide-react";

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

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
      if (!closeButtonRef.current) dialogRef.current?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, []);

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

  const relationLabel = getRelationLabel(member.relation);
  const favoriteRecipes = recipes.filter((r) => r.is_favorite);
  const otherRecipes = recipes.filter((r) => !r.is_favorite);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss is secondary
    <div
      role="presentation"
      className={cn(
        "fixed inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4",
        "transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0",
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${member.name}'s cookbook`}
        tabIndex={-1}
        className="relative w-full max-w-lg"
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
        {/* ── Drag handle (mobile) ──────────────────────────────────────────── */}
        <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-white/30 sm:hidden" aria-hidden />

        {/* ── Book pages (the actual content) ──────────────────────────────── */}
        <div
          className={cn("overflow-hidden rounded-2xl shadow-2xl", "transition-opacity duration-300")}
          style={{
            background: "#f5efe6",
            maxHeight: "min(85dvh, 640px)",
            opacity: isOpen ? 1 : 0,
          }}
        >
          {/* ── Hero header ────────────────────────────────────────────────── */}
          <div className={cn("relative overflow-hidden px-6 pt-7 pb-5", coverColors.bg)}>
            {/* Spine strip */}
            <div className={cn("absolute top-0 left-0 h-full w-3", coverColors.spine)} />

            {/* Subtle paper texture overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='none'/%3E%3Ccircle cx='1' cy='1' r='0.6' fill='%23ffffff'/%3E%3C/svg%3E\")",
              }}
              aria-hidden
            />

            <div className="relative pl-4">
              {/* Eyebrow */}
              <p className="mb-2 font-medium text-[10px] text-white/50 uppercase tracking-[0.2em]">Family Cookbook</p>

              {/* Name + memorial badge */}
              <div className="flex items-start gap-2">
                <h2 className="font-bold text-2xl text-white leading-tight sm:text-3xl">{member.name}</h2>
                {member.is_memorial && (
                  <span className="mt-1.5 shrink-0 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] text-white/70 backdrop-blur-sm">
                    In memory
                  </span>
                )}
              </div>

              {/* Relation + origin */}
              {(relationLabel || member.country_of_origin) && (
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                  {relationLabel && <p className="font-medium text-sm text-white/70 capitalize">{relationLabel}</p>}
                  {member.country_of_origin && (
                    <span className="flex items-center gap-1 text-white/50 text-xs">
                      <MapPin className="size-3" aria-hidden />
                      {member.country_of_origin}
                    </span>
                  )}
                </div>
              )}

              {/* Recipe count pill */}
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
                <UtensilsCrossed className="size-3" aria-hidden />
                {recipes.length === 0
                  ? "No recipes yet"
                  : `${recipes.length} ${recipes.length === 1 ? "recipe" : "recipes"}`}
              </div>
            </div>
          </div>

          {/* ── Scrollable body ─────────────────────────────────────────────── */}
          <div
            className="overflow-y-auto"
            style={{
              background: "#f5efe6",
              maxHeight: "min(55dvh, 400px)",
            }}
          >
            {/* Divider rule */}
            <div className="mx-6 border-[#d4c0a8] border-t" />

            {/* Bio section */}
            <div className="px-6 pt-5 pb-4">
              {member.bio ? (
                <p className="font-serif text-[#5c4a37] text-sm italic leading-relaxed">{member.bio}</p>
              ) : (
                <p className="font-serif text-[#a08060]/70 text-sm italic leading-relaxed">
                  {readOnly
                    ? "No story has been written yet for this cookbook."
                    : "Every cook has a story. Add a memory, a tradition, or a few words about this person."}
                </p>
              )}
            </div>

            {/* Action buttons */}
            {!readOnly && (
              <div className="flex flex-wrap gap-2 px-6 pb-5">
                <Link
                  href={`/dashboard/tree/member/${member.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#803d3b] px-3.5 py-2.5 font-medium text-sm text-white shadow-sm transition-colors hover:bg-[#6e3230]"
                >
                  <BookOpen className="size-3.5" />
                  View full profile
                </Link>
                <Link
                  href={`/dashboard/tree/member/${member.id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#c9a882] bg-white px-3.5 py-2.5 font-medium text-[#7a5a3a] text-sm shadow-sm transition-colors hover:bg-[#faf5ee]"
                >
                  <Pencil className="size-3.5" />
                  Edit &amp; link recipes
                </Link>
              </div>
            )}

            {/* Recipes section */}
            <div className="px-6 pb-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold text-[#7a5a3a] text-[11px] uppercase tracking-widest">Recipes</p>
                {recipes.length > 0 && <Heart className="size-3.5 fill-[#c97d6a]/40 text-[#c97d6a]" aria-hidden />}
              </div>

              {recipes.length === 0 ? (
                /* Empty state */
                <div className="rounded-xl border border-dashed border-[#c9a882]/60 bg-[#fdf8f1] px-5 py-8 text-center">
                  <UtensilsCrossed className="mx-auto mb-3 size-8 text-[#c9a882]/60" aria-hidden />
                  <p className="font-serif text-[#7a5a3a] text-sm italic leading-relaxed">
                    No recipes yet — start this cookbook
                    <br />
                    with a dish worth remembering.
                  </p>
                  {!readOnly && (
                    <Link
                      href={`/dashboard/recipes/new?member=${member.id}`}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#803d3b] px-4 py-2.5 font-medium text-sm text-white shadow-sm transition-colors hover:bg-[#6e3230]"
                    >
                      Add first recipe
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {/* Favorites first */}
                  {favoriteRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} isFavorite memberId={member.id} />
                  ))}
                  {otherRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} isFavorite={false} memberId={member.id} />
                  ))}

                  {/* View all link if more than shown */}
                  {recipes.length > 6 && (
                    <Link
                      href={`/dashboard/tree/member/${member.id}`}
                      className="mt-1 text-center text-[#803d3b] text-xs hover:underline"
                    >
                      View all {recipes.length} recipes →
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Animated cover (flips open on mount) ─────────────────────────── */}
        <div
          className={cn("absolute inset-0 flex overflow-hidden rounded-2xl", "pointer-events-none")}
          style={{
            transformOrigin: "left center",
            transition: `transform ${CLOSE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            transform: isOpen ? "rotateY(-160deg)" : "rotateY(0deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <div className={cn("w-3 shrink-0", coverColors.spine)} />
          <div className={cn("flex flex-1 flex-col justify-between p-6", coverColors.bg)}>
            <p className="font-medium text-[10px] text-white/40 uppercase tracking-widest">Made with Love</p>
            <div>
              <p className="font-bold text-lg text-white leading-tight">{member.name}</p>
              {relationLabel && <p className="mt-1 text-white/60 text-xs capitalize">{relationLabel}</p>}
            </div>
            <p className="text-[9px] text-white/40">
              {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
            </p>
          </div>
        </div>

        {/* ── Close button ─────────────────────────────────────────────────── */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={handleClose}
          disabled={isClosingRef.current}
          className={cn(
            "absolute top-2 right-2 z-20 flex size-10 items-center justify-center rounded-full bg-white/80 text-[#7a5a3a] shadow-sm transition-all hover:bg-white hover:text-[#322c2b]",
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

// ── Recipe card ───────────────────────────────────────────────────────────────

function RecipeCard({
  recipe,
  isFavorite,
  memberId,
}: {
  recipe: { id: string; title: string };
  isFavorite: boolean;
  memberId: string;
}) {
  return (
    <Link
      href={`/dashboard/recipes/${recipe.id}`}
      className={cn(
        "group flex items-center gap-3 rounded-xl border px-4 py-3 transition-all",
        "border-[#d4bfa0] bg-white/70 shadow-sm",
        "hover:border-[#c9a882] hover:bg-[#fdf8f1] hover:shadow-md",
      )}
    >
      {isFavorite ? (
        <Star className="size-3.5 shrink-0 fill-[#c97d6a] text-[#c97d6a]" aria-label="Favorite" />
      ) : (
        <UtensilsCrossed
          className="size-3.5 shrink-0 text-[#c9a882]/60 transition-colors group-hover:text-[#c97d6a]/80"
          aria-hidden
        />
      )}
      <span className="line-clamp-1 font-medium text-[#5c4a37] text-sm group-hover:text-[#803d3b]">{recipe.title}</span>
    </Link>
  );
}
