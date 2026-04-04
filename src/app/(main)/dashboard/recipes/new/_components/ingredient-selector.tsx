"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Image from "next/image";

import { Search, X } from "lucide-react";

import { type CatalogIngredient, INGREDIENT_CATALOG } from "@/data/ingredients";
import { cn } from "@/lib/utils";

import { IngredientChip } from "./ingredient-chip";

// ─── Popular quick-picks ──────────────────────────────────────────────────────

const POPULAR_IDS = [
  "garlic",
  "onion",
  "tomato",
  "chicken",
  "rice",
  "flour",
  "salt",
  "black-pepper",
  "olive-oil",
  "butter",
  "egg",
  "ginger",
  "lemon",
  "soy-sauce",
  "broccoli",
  "mushroom",
];

const POPULAR = POPULAR_IDS.map((id) => INGREDIENT_CATALOG.find((item) => item.id === id)).filter(
  Boolean,
) as CatalogIngredient[];

// ─── Data helpers ─────────────────────────────────────────────────────────────

interface SelectedIngredient {
  uid: string;
  displayText: string; // full ingredient string as stored ("2 cups Flour" or "Garlic")
  emoji: string;
  imageUrl?: string;
}

/** Best-effort emoji lookup: scan catalog for any name present in the line. */
function findEmoji(line: string): string {
  const lower = line.toLowerCase();
  // Prefer exact name match first, then partial
  const exact = INGREDIENT_CATALOG.find((i) => i.name.toLowerCase() === lower);
  if (exact) return exact.emoji;
  const partial = INGREDIENT_CATALOG.find((i) => lower.includes(i.name.toLowerCase()));
  return partial?.emoji ?? "🍽️";
}

/** Find image URL for an ingredient line. */
function findImageUrl(line: string): string | undefined {
  const lower = line.toLowerCase();
  // Prefer exact name match first
  const exact = INGREDIENT_CATALOG.find((i) => i.name.toLowerCase() === lower);
  if (exact?.imageUrl) return exact.imageUrl;
  const partial = INGREDIENT_CATALOG.find((i) => lower.includes(i.name.toLowerCase()));
  return partial?.imageUrl;
}

function parseIngredients(raw: string): SelectedIngredient[] {
  if (!raw?.trim()) return [];
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line, i) => ({
      uid: `p-${i}-${line}`,
      displayText: line,
      emoji: findEmoji(line),
      imageUrl: findImageUrl(line),
    }));
}

function serializeIngredients(items: SelectedIngredient[]): string {
  return items.map((i) => i.displayText).join("\n");
}

// ─── Component ────────────────────────────────────────────────────────────────

interface IngredientSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function IngredientSelector({ value = "", onChange }: IngredientSelectorProps) {
  const [selected, setSelected] = useState<SelectedIngredient[]>(() => parseIngredients(value));
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Prevent our own onChange from triggering a re-parse
  const syncingRef = useRef(false);

  // ── Sync external value changes (AI suggestion / image extraction) ──────────
  // biome-ignore lint/correctness/useExhaustiveDependencies: selected intentionally omitted — syncingRef prevents infinite loop
  useEffect(() => {
    if (syncingRef.current) return;
    const current = serializeIngredients(selected);
    const normalized = serializeIngredients(parseIngredients(value));
    if (normalized !== current) {
      setSelected(parseIngredients(value));
    }
  }, [value]);

  // ── Close dropdown on outside click ────────────────────────────────────────
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  // ── Filtered suggestions ────────────────────────────────────────────────────
  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    const selectedLower = new Set(selected.map((s) => s.displayText.toLowerCase()));
    return INGREDIENT_CATALOG.filter(
      (item) => item.name.toLowerCase().includes(q) && !selectedLower.has(item.name.toLowerCase()),
    ).slice(0, 8);
  }, [search, selected]);

  // Set of selected display texts for quick lookup (popular grid state)
  const selectedLowerSet = useMemo(() => new Set(selected.map((s) => s.displayText.toLowerCase())), [selected]);

  // ── Mutators ────────────────────────────────────────────────────────────────

  function commit(next: SelectedIngredient[]) {
    syncingRef.current = true;
    setSelected(next);
    onChange?.(serializeIngredients(next));
    requestAnimationFrame(() => {
      syncingRef.current = false;
    });
  }

  function addFromCatalog(item: CatalogIngredient) {
    if (selectedLowerSet.has(item.name.toLowerCase())) return;
    commit([
      ...selected,
      { uid: `${item.id}-${Date.now()}`, displayText: item.name, emoji: item.emoji, imageUrl: item.imageUrl },
    ]);
    setSearch("");
    setDropdownOpen(false);
    inputRef.current?.focus();
  }

  function addCustom(text: string) {
    const trimmed = text.trim();
    if (!trimmed || selectedLowerSet.has(trimmed.toLowerCase())) return;
    commit([
      ...selected,
      { uid: `custom-${Date.now()}`, displayText: trimmed, emoji: findEmoji(trimmed), imageUrl: findImageUrl(trimmed) },
    ]);
    setSearch("");
    setDropdownOpen(false);
    inputRef.current?.focus();
  }

  function remove(uid: string) {
    commit(selected.filter((s) => s.uid !== uid));
  }

  // ── Keyboard nav ────────────────────────────────────────────────────────────
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0) {
        addFromCatalog(suggestions[0]);
      } else if (search.trim()) {
        addCustom(search);
      }
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
      setSearch("");
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((item) => (
            <IngredientChip
              key={item.uid}
              emoji={item.emoji}
              displayText={item.displayText}
              imageUrl={item.imageUrl}
              onRemove={() => remove(item.uid)}
            />
          ))}
        </div>
      )}

      {/* Search + autocomplete dropdown */}
      <div ref={containerRef} className="relative">
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 transition-all",
            dropdownOpen && "border-amber-400 ring-2 ring-amber-500/20",
          )}
        >
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            placeholder="Search and add ingredients…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            onChange={(e) => {
              setSearch(e.target.value);
              setDropdownOpen(true);
            }}
            onFocus={() => setDropdownOpen(true)}
            onKeyDown={handleKeyDown}
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                inputRef.current?.focus();
              }}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {dropdownOpen && (suggestions.length > 0 || search.trim()) && (
          <div className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-lg border border-input bg-background shadow-xl">
            {suggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault(); // keep focus in input
                  addFromCatalog(item);
                }}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                {item.imageUrl ? (
                  <div className="relative size-8 shrink-0 overflow-hidden rounded-md bg-amber-100 dark:bg-amber-900/40">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={32}
                      height={32}
                      className="size-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <span className="text-xl leading-none">{item.emoji}</span>
                )}
                <span className="font-medium">{item.name}</span>
                <span className="ml-auto text-[11px] text-muted-foreground">{item.category}</span>
              </button>
            ))}

            {/* Add custom */}
            {search.trim() && !INGREDIENT_CATALOG.some((i) => i.name.toLowerCase() === search.trim().toLowerCase()) && (
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  addCustom(search);
                }}
                className="flex w-full items-center gap-3 border-input border-t px-3 py-2.5 text-left text-sm transition-colors hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                <span className="text-xl">🍽️</span>
                <span className="text-muted-foreground">
                  Add <strong className="text-foreground">&ldquo;{search.trim()}&rdquo;</strong>
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Popular quick-picks */}
      <div>
        <p className="mb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Popular Ingredients</p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {POPULAR.map((item) => {
            const isSelected = selectedLowerSet.has(item.name.toLowerCase());
            return (
              <button
                key={item.id}
                type="button"
                disabled={isSelected}
                onClick={() => addFromCatalog(item)}
                aria-pressed={isSelected}
                aria-label={item.name}
                className={cn(
                  "group flex flex-col items-center gap-1.5 rounded-lg border-2 p-2 text-center transition-all",
                  isSelected
                    ? "cursor-default border-amber-400 bg-amber-100/80 dark:border-amber-600 dark:bg-amber-900/40"
                    : "border-amber-100 hover:border-amber-300 hover:bg-amber-50 dark:border-amber-900/30 dark:hover:border-amber-700 dark:hover:bg-amber-900/15",
                )}
              >
                <span className="text-2xl leading-none" aria-hidden="true">
                  {item.emoji}
                </span>
                <span className="line-clamp-1 w-full text-center font-medium text-[11px] text-foreground leading-tight">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty nudge */}
      {selected.length === 0 && (
        <p className="text-center text-muted-foreground text-xs">
          Search above or tap a popular ingredient to get started.
        </p>
      )}
    </div>
  );
}
