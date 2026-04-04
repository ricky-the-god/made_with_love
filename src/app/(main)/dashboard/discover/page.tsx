import Link from "next/link";

import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getPublicFamilies } from "@/server/family-actions";
import { getPublicRecipes } from "@/server/recipe-actions";

import { RecipeCard } from "../recipes/_components/recipe-card";

type CulturalCollection = {
  slug: string;
  region: string;
  emoji: string;
  description: string;
  countries: readonly string[];
  iconClassName: string;
};

type DiscoverSearchParams = {
  region?: string | string[];
  q?: string | string[];
  recipes?: string | string[];
  traditions?: string | string[];
};

type PublicRecipe = Awaited<ReturnType<typeof getPublicRecipes>>[number];

function firstParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeFamilyMember(recipe: PublicRecipe) {
  const relatedMember = recipe.family_members;

  if (Array.isArray(relatedMember)) {
    return relatedMember[0] ?? null;
  }

  return relatedMember ?? null;
}

const CULTURAL_COLLECTIONS: readonly CulturalCollection[] = [
  {
    slug: "southeast-asia",
    region: "Southeast Asia",
    emoji: "🌿",
    description: "The flavors that Southeast Asian families carry across borders and generations.",
    countries: ["Philippines", "Vietnam", "Thailand", "Indonesia", "Malaysia", "Singapore"],
    iconClassName: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  {
    slug: "mediterranean",
    region: "Mediterranean",
    emoji: "🫒",
    description: "Slow-cooked, shared, and passed down through sun-drenched kitchens.",
    countries: ["Italy", "Greece", "Lebanon", "Turkey", "Spain", "Morocco"],
    iconClassName: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  },
  {
    slug: "west-africa",
    region: "West Africa",
    emoji: "🌍",
    description: "Bold, nourishing, and rooted in community — food as identity and love.",
    countries: ["Nigeria", "Ghana", "Senegal", "Sierra Leone", "Liberia", "Ivory Coast"],
    iconClassName: "bg-lime-100 text-lime-700 dark:bg-lime-950/40 dark:text-lime-300",
  },
  {
    slug: "latin-america",
    region: "Latin America",
    emoji: "🌶️",
    description: "From abuelas' tamales to Sunday asados — the recipes that hold families together.",
    countries: ["Mexico", "Colombia", "Peru", "Argentina", "Chile", "Brazil"],
    iconClassName: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  },
  {
    slug: "east-asia",
    region: "East Asia",
    emoji: "🥢",
    description: "Ritual, seasonality, and dishes shaped by memory, migration, and the family table.",
    countries: ["China", "Japan", "Korea", "Taiwan", "Hong Kong", "Mongolia"],
    iconClassName: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/40 dark:text-fuchsia-300",
  },
  {
    slug: "south-asia",
    region: "South Asia",
    emoji: "🫓",
    description: "Layered spices, everyday comfort, and recipes carried through generations of shared kitchens.",
    countries: ["India", "Pakistan", "Bangladesh", "Sri Lanka", "Nepal"],
    iconClassName: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
  },
  {
    slug: "middle-east",
    region: "Middle East",
    emoji: "🧿",
    description: "Hospitality-driven cooking, deep spice traditions, and meals built for passing plates around.",
    countries: ["Lebanon", "Syria", "Jordan", "Palestine", "Iran", "Iraq", "Saudi Arabia"],
    iconClassName: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  },
  {
    slug: "caribbean",
    region: "Caribbean",
    emoji: "🌴",
    description: "Island kitchens where heat, sweetness, and celebration all show up in the same pot.",
    countries: ["Jamaica", "Trinidad and Tobago", "Puerto Rico", "Haiti", "Dominican Republic", "Cuba"],
    iconClassName: "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300",
  },
  {
    slug: "eastern-europe",
    region: "Eastern Europe",
    emoji: "🥟",
    description: "Hearty, practical, deeply seasonal food made to gather people through long winters and holidays.",
    countries: ["Poland", "Ukraine", "Romania", "Hungary", "Croatia", "Serbia", "Georgia"],
    iconClassName: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200",
  },
];

const DEFAULT_RECIPE_COUNT = 6;
const DEFAULT_TRADITION_COUNT = 2;

function FeaturedStoryCard() {
  return (
    <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-6 dark:border-amber-900/20 dark:bg-amber-950/10">
      <p className="mb-3 font-medium text-amber-700 text-xs uppercase tracking-wider dark:text-amber-400">
        Featured story
      </p>
      <h2 className="mb-2 font-semibold text-foreground text-lg leading-snug">
        "She never measured anything. That was the point."
      </h2>
      <p className="mb-4 text-muted-foreground text-sm leading-relaxed">
        A family in Hanoi passed down their phở recipe entirely through memory — no quantities, no timers. Their
        granddaughter is preserving it here, one estimated cup at a time.
      </p>
      <span className="font-medium text-amber-700 text-xs dark:text-amber-400">Vietnamese · Family story</span>
    </div>
  );
}

export default async function DiscoverPage({ searchParams }: { searchParams: Promise<DiscoverSearchParams> }) {
  const resolvedParams = await searchParams;
  const region = firstParamValue(resolvedParams.region);
  const q = firstParamValue(resolvedParams.q);
  const recipes = firstParamValue(resolvedParams.recipes);
  const traditions = firstParamValue(resolvedParams.traditions);
  const [publicFamilies, rawRecipes] = await Promise.all([getPublicFamilies(20), getPublicRecipes(50)]);
  const publicRecipes = rawRecipes.map((recipe) => ({
    ...recipe,
    family_members: normalizeFamilyMember(recipe),
  }));
  const query = q?.trim().toLowerCase() ?? "";
  const showAllRecipes = recipes === "all";
  const showAllTraditions = traditions === "all";
  const activeCollection = CULTURAL_COLLECTIONS.find((collection) => collection.slug === region) ?? null;
  const recipesByRegion = activeCollection
    ? publicRecipes.filter((recipe) =>
        activeCollection.countries.includes(recipe.country_of_origin ?? recipe.family_members?.country_of_origin ?? ""),
      )
    : publicRecipes;
  const filteredRecipes = query
    ? recipesByRegion.filter((recipe) => {
        const haystack = [
          recipe.title,
          recipe.description,
          recipe.country_of_origin,
          recipe.culture_tag,
          recipe.occasion,
          recipe.family_members?.name,
          recipe.family_members?.country_of_origin,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(query);
      })
    : recipesByRegion;
  const visibleRecipes = showAllRecipes ? filteredRecipes : filteredRecipes.slice(0, DEFAULT_RECIPE_COUNT);
  const visibleTraditions = showAllTraditions
    ? CULTURAL_COLLECTIONS
    : CULTURAL_COLLECTIONS.slice(0, DEFAULT_TRADITION_COUNT);

  const buildDiscoverHref = (
    nextRegion?: string | null,
    nextQuery?: string | null,
    nextRecipes?: string | null,
    nextTraditions?: string | null,
  ) => {
    const params = new URLSearchParams();

    if (nextRegion) params.set("region", nextRegion);
    if (nextQuery) params.set("q", nextQuery);
    if (nextRecipes) params.set("recipes", nextRecipes);
    if (nextTraditions) params.set("traditions", nextTraditions);

    const queryString = params.toString();
    return queryString ? `/dashboard/discover?${queryString}` : "/dashboard/discover";
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-semibold text-2xl">Discover</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Explore family recipes and food traditions from around the world.
        </p>
      </div>

      {/* Featured editorial story */}
      <FeaturedStoryCard />

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
                {CULTURAL_COLLECTIONS.map((collection) => {
                  const isActive = activeCollection?.slug === collection.slug;
                  return (
                    <Button
                      key={collection.slug}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      className={isActive ? "bg-amber-700 text-white hover:bg-amber-800" : ""}
                      asChild
                    >
                      <Link href={buildDiscoverHref(collection.slug, q ?? null, recipes ?? null, traditions ?? null)}>
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

      {/* Shared recipes */}
      <div>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-semibold text-lg">
              {activeCollection ? `${activeCollection.region} Recipes` : "Shared Recipes"}
            </h2>
            <p className="mt-1 text-muted-foreground text-sm">
              {activeCollection
                ? `Public recipes connected to ${activeCollection.region.toLowerCase()} food traditions.`
                : "Recipes families have chosen to open up to the wider community."}
            </p>
            {q && <p className="mt-1 text-muted-foreground text-sm">Search results for "{q}".</p>}
          </div>
          {activeCollection && (
            <Link
              href={buildDiscoverHref(null, q ?? null, recipes ?? null, traditions ?? null)}
              className="text-amber-700 text-sm hover:underline dark:text-amber-400"
            >
              Clear filter
            </Link>
          )}
        </div>

        {filteredRecipes.length > 0 ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} href={`/recipes/${recipe.id}`} />
              ))}
            </div>

            {filteredRecipes.length > DEFAULT_RECIPE_COUNT && (
              <div className="mt-5 flex justify-center">
                <Button variant="outline" asChild>
                  <Link
                    href={buildDiscoverHref(
                      region ?? null,
                      q ?? null,
                      showAllRecipes ? null : "all",
                      traditions ?? null,
                    )}
                    scroll={false}
                  >
                    {showAllRecipes
                      ? "Show less"
                      : `See more recipes (${filteredRecipes.length - DEFAULT_RECIPE_COUNT} more)`}
                  </Link>
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-amber-200 border-dashed py-10 dark:border-amber-900/30">
            <p className="max-w-xs text-center text-muted-foreground text-sm">
              {activeCollection
                ? `No public recipes found for ${activeCollection.region}${q ? ` matching "${q}"` : ""} yet.`
                : q
                  ? `No public recipes matched "${q}".`
                  : "No public recipes yet. Share one from a recipe page and it will appear here."}
            </p>
          </div>
        )}
      </div>

      {/* Food traditions grid */}
      <div id="food-traditions">
        <h2 className="mb-4 font-semibold text-lg">Food Traditions</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {visibleTraditions.map((c) => (
            <Link key={c.slug} href={buildDiscoverHref(c.slug, q ?? null)} className="block h-full">
              <Card
                className={[
                  "h-full cursor-pointer border-amber-100 transition-shadow hover:shadow-md dark:border-amber-900/20",
                  activeCollection?.slug === c.slug
                    ? "border-amber-400 bg-amber-50/70 ring-1 ring-amber-300 dark:border-amber-700 dark:bg-amber-950/20"
                    : "",
                ].join(" ")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-base">
                    <span
                      className={[
                        "flex size-10 shrink-0 items-center justify-center rounded-full text-xl",
                        c.iconClassName,
                      ].join(" ")}
                    >
                      {c.emoji}
                    </span>
                    {c.region}
                  </CardTitle>
                  <CardDescription>{c.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {CULTURAL_COLLECTIONS.length > DEFAULT_TRADITION_COUNT && (
          <div className="mt-5 flex justify-center">
            <Button variant="outline" asChild>
              <Link
                href={buildDiscoverHref(region ?? null, q ?? null, recipes ?? null, showAllTraditions ? null : "all")}
                scroll={false}
              >
                {showAllTraditions
                  ? "Show less"
                  : `See more traditions (${CULTURAL_COLLECTIONS.length - DEFAULT_TRADITION_COUNT} more)`}
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Public family trees */}
      <div>
        <h2 className="mb-4 font-semibold text-lg">Public Family Trees</h2>
        {publicFamilies.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {publicFamilies.map((family) => (
              <Link
                key={family.id}
                href={`/dashboard/discover/family/${family.id}`}
                className="group block rounded-xl border border-amber-100 bg-amber-50/30 p-5 transition-colors hover:border-amber-300 hover:bg-amber-50/60 dark:border-amber-900/20 dark:bg-amber-950/10 dark:hover:border-amber-800/40"
              >
                <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-amber-100 text-xl dark:bg-amber-950/40">
                  🌳
                </div>
                <p className="font-semibold group-hover:text-amber-800 dark:group-hover:text-amber-300">
                  {family.family_name}
                </p>
                <p className="mt-1 text-muted-foreground text-xs">Public family cookbook</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-amber-200 border-dashed py-10 dark:border-amber-900/30">
            <p className="max-w-xs text-center text-muted-foreground text-sm">
              No public family trees yet. Make your family public from Profile → Family Settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
