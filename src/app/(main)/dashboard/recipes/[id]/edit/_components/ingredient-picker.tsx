"use client";

import { useMemo, useState } from "react";

import { Check, Minus, Plus, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  INGREDIENT_CATALOG,
  INGREDIENT_CATEGORIES,
  type CatalogIngredient,
} from "@/data/ingredients";
import { cn } from "@/lib/utils";

// ─── Units ────────────────────────────────────────────────────────────────────

const UNITS = [
  "",
  "tsp",
  "tbsp",
  "cup",
  "oz",
  "lb",
  "g",
  "kg",
  "ml",
  "L",
  "clove",
  "piece",
  "pinch",
  "bunch",
  "can",
  "slice",
  "to taste",
  "as needed",
] as const;

type Unit = (typeof UNITS)[number];

/** Formats a decimal qty into a readable fraction string. */
function fmtQty(n: number): string {
  if (n === 0) return "0";
  const whole = Math.floor(n);
  const frac = Math.round((n - whole) * 4); // 0–4 quarters
  const fracStr = ["", "¼", "½", "¾", ""][frac] ?? "";
  if (whole === 0) return fracStr || String(n);
  return fracStr ? `${whole}${fracStr}` : String(whole);
}

const UNIT_NO_QTY: Unit[] = ["to taste", "as needed"];

// ─── Types ────────────────────────────────────────────────────────────────────

interface SelectedIngredient {
  uid: string;
  name: string;
  emoji: string;
  qty: number; // 0 = no quantity shown
  unit: Unit;
}

// ─── Parse existing saved value ───────────────────────────────────────────────

const UNIT_ALIASES: Record<string, Unit> = {
  tsp: "tsp",
  teaspoon: "tsp",
  teaspoons: "tsp",
  tbsp: "tbsp",
  tablespoon: "tbsp",
  tablespoons: "tbsp",
  cup: "cup",
  cups: "cup",
  oz: "oz",
  ounce: "oz",
  ounces: "oz",
  lb: "lb",
  lbs: "lb",
  pound: "lb",
  pounds: "lb",
  g: "g",
  gram: "g",
  grams: "g",
  kg: "kg",
  ml: "ml",
  l: "L",
  clove: "clove",
  cloves: "clove",
  piece: "piece",
  pieces: "piece",
  pinch: "pinch",
  bunch: "bunch",
  can: "can",
  cans: "can",
  slice: "slice",
  slices: "slice",
  "to taste": "to taste",
  "as needed": "as needed",
};

function parseFraction(s: string): number | null {
  if (/^½$/.test(s)) return 0.5;
  if (/^¼$/.test(s)) return 0.25;
  if (/^¾$/.test(s)) return 0.75;
  if (/^⅓$/.test(s)) return 1 / 3;
  if (/^⅔$/.test(s)) return 2 / 3;
  if (/^⅛$/.test(s)) return 0.125;
  if (s.includes("/")) {
    const [a, b] = s.split("/").map(Number);
    if (b) return a / b;
  }
  const n = parseFloat(s);
  return Number.isNaN(n) ? null : n;
}

function parseDefaultValue(raw: string | null | undefined): SelectedIngredient[] {
  if (!raw) return [];

  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line, index) => {
      // Try: "2 cups flour", "½ tsp salt", "3 cloves garlic", "to taste salt"
      const re =
        /^([\d½¼¾⅓⅔⅛][.\d/½¼¾⅓⅔⅛]*)?\s*(tsp|tbsp|cups?|oz|lbs?|g|kg|ml|L|cloves?|pieces?|pinch|bunch|cans?|slices?|to taste|as needed)?\s*(.+)$/i;
      const m = line.match(re);

      let qty = 0;
      let unit: Unit = "";
      let name = line;

      if (m) {
        qty = m[1] ? (parseFraction(m[1]) ?? 0) : 0;
        unit = (UNIT_ALIASES[m[2]?.toLowerCase() ?? ""] as Unit) ?? "";
        name = m[3]?.trim() || line;
      }

      const catalogMatch = INGREDIENT_CATALOG.find(
        (item) => item.name.toLowerCase() === name.toLowerCase(),
      );

      return {
        uid: `parsed-${index}`,
        name: catalogMatch ? catalogMatch.name : name,
        emoji: catalogMatch ? catalogMatch.emoji : "🍽️",
        qty,
        unit,
      };
    });
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  defaultValue?: string | null;
}

export function IngredientPicker({ defaultValue }: Props) {
  const [selected, setSelected] = useState<SelectedIngredient[]>(() =>
    parseDefaultValue(defaultValue),
  );
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [customInput, setCustomInput] = useState("");

  // ── Catalog filtering ──────────────────────────────────────────────────────
  const filtered = useMemo(
    () =>
      INGREDIENT_CATALOG.filter((item) => {
        const matchCat = activeCategory === "All" || item.category === activeCategory;
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
      }),
    [search, activeCategory],
  );

  const selectedNameSet = useMemo(
    () => new Set(selected.map((s) => s.name.toLowerCase())),
    [selected],
  );

  // ── Handlers ───────────────────────────────────────────────────────────────
  function toggleCatalogItem(item: CatalogIngredient) {
    setSelected((prev) => {
      const already = prev.some((s) => s.name.toLowerCase() === item.name.toLowerCase());
      if (already) {
        return prev.filter((s) => s.name.toLowerCase() !== item.name.toLowerCase());
      }
      return [
        ...prev,
        { uid: `${item.id}-${Date.now()}`, name: item.name, emoji: item.emoji, qty: 1, unit: "" },
      ];
    });
  }

  function setQty(uid: string, qty: number) {
    setSelected((prev) => prev.map((s) => (s.uid === uid ? { ...s, qty: Math.max(0, qty) } : s)));
  }

  function setUnit(uid: string, unit: Unit) {
    setSelected((prev) => prev.map((s) => (s.uid === uid ? { ...s, unit } : s)));
  }

  function removeItem(uid: string) {
    setSelected((prev) => prev.filter((s) => s.uid !== uid));
  }

  function addCustom() {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    setSelected((prev) => [
      ...prev,
      { uid: `custom-${Date.now()}`, name: trimmed, emoji: "🍽️", qty: 0, unit: "" },
    ]);
    setCustomInput("");
  }

  // ── Serialisation ──────────────────────────────────────────────────────────
  const serialized = selected
    .map(({ name, qty, unit }) => {
      const noQtyUnit = UNIT_NO_QTY.includes(unit as (typeof UNIT_NO_QTY)[number]);
      const parts: string[] = [];
      if (qty > 0 && !noQtyUnit) parts.push(fmtQty(qty));
      if (unit) parts.push(unit);
      parts.push(name);
      return parts.join(" ");
    })
    .join("\n");

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name="ingredients" value={serialized} />

      {/* ── Browse panel ────────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-lg border border-input bg-background">
        {/* Search */}
        <div className="flex items-center gap-2 border-b border-input px-3 py-2">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ingredients…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="overflow-x-auto border-b border-input">
          <div className="flex min-w-max items-center gap-1 p-2">
            {INGREDIENT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  activeCategory === cat
                    ? "bg-amber-700 text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Ingredient grid */}
        <div className="h-52 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <span className="text-2xl">🔍</span>
              <p className="text-sm">No ingredients found.</p>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-xs text-amber-700 underline dark:text-amber-400"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5 md:grid-cols-6">
              {filtered.map((item) => {
                const isSelected = selectedNameSet.has(item.name.toLowerCase());
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleCatalogItem(item)}
                    aria-pressed={isSelected}
                    aria-label={item.name}
                    className={cn(
                      "relative flex flex-col items-center gap-1 rounded-lg border p-2 text-center transition-all",
                      isSelected
                        ? "border-amber-500 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/20"
                        : "border-transparent hover:border-amber-200 hover:bg-amber-50/60 dark:hover:border-amber-800/50 dark:hover:bg-amber-900/10",
                    )}
                  >
                    {isSelected && (
                      <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-amber-600 text-white">
                        <Check className="size-2.5" />
                      </span>
                    )}
                    <span className="text-2xl leading-none">{item.emoji}</span>
                    <span className="line-clamp-2 w-full text-center text-[10px] leading-tight text-muted-foreground">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Custom ingredient */}
        <div className="flex items-center gap-2 border-t border-input bg-muted/30 px-3 py-2">
          <span className="text-base leading-none">🍽️</span>
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
            placeholder="Add unlisted ingredient…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <Button
            type="button"
            size="sm"
            disabled={!customInput.trim()}
            onClick={addCustom}
            className="h-7 shrink-0 bg-amber-700 px-2 text-white hover:bg-amber-800 disabled:opacity-40"
          >
            <Plus className="size-3.5" />
            Add
          </Button>
        </div>
      </div>

      {/* ── Selected list ────────────────────────────────────────────────────── */}
      {selected.length > 0 ? (
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Added ({selected.length})
          </p>

          {selected.map((item, index) => {
            const noQtyUnit = UNIT_NO_QTY.includes(item.unit as (typeof UNIT_NO_QTY)[number]);

            return (
              <div
                key={item.uid}
                className="flex items-center gap-2 rounded-lg border border-input bg-muted/20 px-2 py-1.5"
              >
                {/* Index */}
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                  {index + 1}
                </span>

                {/* Emoji + Name */}
                <span className="text-base leading-none">{item.emoji}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.name}</span>

                {/* Qty stepper — hidden for "to taste" / "as needed" */}
                {!noQtyUnit && (
                  <div className="flex shrink-0 items-center gap-0.5 rounded-md border border-input bg-background">
                    <button
                      type="button"
                      onClick={() => setQty(item.uid, Math.max(0, item.qty - 0.25))}
                      className="flex size-6 items-center justify-center rounded-l-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="w-7 select-none text-center text-xs font-medium tabular-nums">
                      {item.qty === 0 ? "—" : fmtQty(item.qty)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(item.uid, item.qty + 0.25)}
                      className="flex size-6 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                )}

                {/* Unit dropdown */}
                <select
                  value={item.unit}
                  onChange={(e) => setUnit(item.uid, e.target.value as Unit)}
                  className="h-7 shrink-0 cursor-pointer rounded-md border border-input bg-background px-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  aria-label={`Unit for ${item.name}`}
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u === "" ? "— unit" : u}
                    </option>
                  ))}
                </select>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeItem(item.uid)}
                  className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Remove ${item.name}`}
                >
                  <X className="size-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-amber-200 py-5 text-center text-muted-foreground text-sm dark:border-amber-800/30">
          Click any ingredient above to add it to your recipe.
        </div>
      )}
    </div>
  );
}
