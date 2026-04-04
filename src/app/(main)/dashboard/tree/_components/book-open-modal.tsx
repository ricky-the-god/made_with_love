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

const CLOSE_DURATION = 320;

export function BookOpenModal({ member, recipes, coverColors, onClose, readOnly }: BookOpenModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [swipeOffsetX, setSwipeOffsetX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const isClosingRef = useRef(false);
  const closeTimerRef = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
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
    closeTimerRef.current = window.setTimeout(completeClose, CLOSE_DURATION + 60);
  }, [completeClose]);

  // Trigger open animation on mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Move focus into the panel after mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
      if (!closeButtonRef.current) panelRef.current?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Keyboard dismiss
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    },
    [],
  );

  const SWIPE_DISMISS_THRESHOLD = 80;

  function onTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    if (isClosingRef.current) return;
    const touch = event.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    shouldTrackSwipeRef.current = true;
  }

  function onTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    if (!shouldTrackSwipeRef.current || !touchStartRef.current || isClosingRef.current) return;
    const touch = event.touches[0];
    if (!touch) return;
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    // Only track rightward swipes
    if (dx <= 0 || Math.abs(dy) > Math.abs(dx)) return;
    setIsSwiping(true);
    setSwipeOffsetX(Math.min(dx, 200));
  }

  function onTouchEnd() {
    if (swipeOffsetX >= SWIPE_DISMISS_THRESHOLD) {
      handleClose();
    }
    setIsSwiping(false);
    setSwipeOffsetX(0);
    touchStartRef.current = null;
    shouldTrackSwipeRef.current = false;
  }

  const visibleRecipes = recipes.slice(0, 8);
  const hasMore = recipes.length > 8;
  const relationLabel = getRelationLabel(member.relation);

  return (
    <>
      {/* Backdrop */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss is a secondary affordance */}
      <div
        role="presentation"
        className={cn(
          "fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px]",
          "transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={handleClose}
      />

      {/* Side panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${member.name}'s cookbook`}
        tabIndex={-1}
        className={cn(
          "fixed top-0 right-0 z-40 flex h-full w-full flex-col bg-[#f0ece3] shadow-2xl",
          "sm:w-[420px]",
          "transition-transform ease-[cubic-bezier(0.22,1,0.36,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        style={{
          transitionDuration: `${CLOSE_DURATION}ms`,
          transform: isSwiping ? `translateX(${swipeOffsetX}px)` : isOpen ? "translateX(0)" : "translateX(100%)",
          transition: isSwiping ? "none" : undefined,
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        onKeyDown={(e) => {
          if (e.key === "Escape") handleClose();
        }}
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className={cn("flex items-center gap-3 border-b border-[#d4c4a8] px-5 py-4", coverColors.bg)}>
          {/* Spine accent */}
          <div className={cn("absolute left-0 top-0 h-full w-2", coverColors.spine)} />

          <div className="ml-2 flex-1 min-w-0">
            <p className="font-bold text-white text-lg leading-tight truncate">{member.name}</p>
            {(relationLabel || member.country_of_origin) && (
              <p className="text-white/70 text-xs capitalize mt-0.5">
                {[relationLabel, member.country_of_origin].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>

          {member.is_memorial && (
            <span className="shrink-0 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] text-white/90">In memory</span>
          )}

          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            disabled={isClosingRef.current}
            className="shrink-0 rounded-full bg-white/20 p-1.5 text-white/80 transition-colors hover:bg-white/30 hover:text-white"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* ── Scrollable body ──────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Member bio */}
          <div className="px-6 py-5 border-b border-[#d4c4a8]">
            {member.bio ? (
              <p className="text-stone-600 text-sm italic leading-relaxed">{member.bio}</p>
            ) : (
              <p className="text-stone-400 text-sm italic">No story written yet.</p>
            )}

            {!readOnly && (
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/dashboard/tree/member/${member.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700 px-3 py-1.5 font-medium text-sm text-white transition-colors hover:bg-amber-800"
                >
                  <BookOpen className="size-3.5" />
                  View profile
                </Link>
                <Link
                  href={`/dashboard/tree/member/${member.id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-3 py-1.5 font-medium text-amber-800 text-sm transition-colors hover:bg-amber-50"
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Link>
              </div>
            )}
          </div>

          {/* Recipe list */}
          <div className="flex flex-1 flex-col px-6 py-5">
            <p className="font-semibold text-[10px] text-stone-400 uppercase tracking-widest mb-3">Recipes</p>

            {recipes.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center py-10">
                <p className="text-stone-400 text-sm">No recipes yet.</p>
                {!readOnly && (
                  <Link
                    href={`/dashboard/recipes/new?member=${member.id}`}
                    className="text-amber-700 text-xs hover:underline"
                  >
                    Add the first recipe
                  </Link>
                )}
              </div>
            ) : (
              <>
                <ul className="flex flex-col gap-1">
                  {visibleRecipes.map((recipe) => (
                    <li key={recipe.id}>
                      <Link
                        href={`/dashboard/recipes/${recipe.id}`}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-stone-700 transition-colors hover:bg-amber-50 hover:text-amber-800"
                      >
                        {recipe.is_favorite && <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" />}
                        <span className="line-clamp-1">{recipe.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {hasMore && (
                  <Link
                    href={`/dashboard/tree/member/${member.id}`}
                    className="mt-3 text-amber-700 text-xs hover:underline"
                  >
                    View all {recipes.length} recipes →
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-t border-[#d4c4a8] px-6 py-3">
          <p className="text-[9px] text-stone-400 uppercase tracking-widest">Made with Love</p>
          <Heart className="size-4 text-stone-300" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}
