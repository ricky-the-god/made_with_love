"use client";

import Link from "next/link";

import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type CulturalCollection = {
  slug: string;
  region: string;
  emoji: string;
};

type SortOption = {
  value: string;
  label: string;
};

type Props = {
  activeCollectionSlug: string | null;
  q: string | null;
  sort: string;
  recipes: string | null;
  traditions: string | null;
  sortOptions: SortOption[];
  collections: CulturalCollection[];
};

function buildHref(
  regionSlug: string | null,
  q: string | null,
  sort: string,
  recipes: string | null,
  traditions: string | null,
) {
  const params = new URLSearchParams();
  if (regionSlug) params.set("region", regionSlug);
  if (q) params.set("q", q);
  if (recipes) params.set("recipes", recipes);
  if (traditions) params.set("traditions", traditions);
  if (sort !== "newest") params.set("sort", sort);
  const qs = params.toString();
  return qs ? `/dashboard/discover?${qs}` : "/dashboard/discover";
}

export function DiscoverSearchForm({
  activeCollectionSlug,
  q,
  sort,
  recipes,
  traditions,
  sortOptions,
  collections,
}: Props) {
  const activeCollection = collections.find((c) => c.slug === activeCollectionSlug) ?? null;

  return (
    <div className="rounded-2xl border border-amber-100 bg-white/80 p-4 dark:border-amber-900/20 dark:bg-stone-950/60">
      <form action="/dashboard/discover" className="flex flex-col gap-3 sm:flex-row">
        {activeCollection && <input type="hidden" name="region" value={activeCollection.slug} />}
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search recipes, countries, traditions, or family members"
            className="pl-9"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline">
              <SlidersHorizontal className="size-4" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 p-3">
            <p className="mb-2 font-medium text-sm">Filter by region</p>
            <div className="flex flex-wrap gap-2">
              {collections.map((collection) => {
                const isActive = activeCollectionSlug === collection.slug;
                return (
                  <Button
                    key={collection.slug}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className={isActive ? "bg-amber-700 text-white hover:bg-amber-800" : ""}
                    asChild
                  >
                    <Link href={buildHref(collection.slug, q, sort, recipes, traditions)}>
                      {collection.emoji} {collection.region}
                    </Link>
                  </Button>
                );
              })}
            </div>
            {(activeCollection || q) && (
              <Button variant="ghost" size="sm" className="mt-2 w-full" asChild>
                <Link href="/dashboard/discover">Clear filters</Link>
              </Button>
            )}
          </PopoverContent>
        </Popover>
        <select
          name="sort"
          defaultValue={sort}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          aria-label="Sort recipes"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Button type="submit" className="bg-amber-700 text-white hover:bg-amber-800">
          Search
        </Button>
        {(q || activeCollection) && (
          <Button variant="outline" asChild>
            <Link href="/dashboard/discover">Reset</Link>
          </Button>
        )}
      </form>
    </div>
  );
}
