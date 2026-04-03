import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicRecipes } from "@/server/recipe-actions";

import { RecipeCard } from "../recipes/_components/recipe-card";

const CULTURAL_COLLECTIONS = [
  {
    region: "Southeast Asia",
    emoji: "🌿",
    description: "The flavors that Southeast Asian families carry across borders and generations.",
  },
  {
    region: "Mediterranean",
    emoji: "🫒",
    description: "Slow-cooked, shared, and passed down through sun-drenched kitchens.",
  },
  {
    region: "West Africa",
    emoji: "🌍",
    description: "Bold, nourishing, and rooted in community — food as identity and love.",
  },
  {
    region: "Latin America",
    emoji: "🌶️",
    description: "From abuelas' tamales to Sunday asados — the recipes that hold families together.",
  },
];

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

export default async function DiscoverPage() {
  const publicRecipes = await getPublicRecipes(6);

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

      {/* Shared recipes */}
      <div>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-semibold text-lg">Shared Recipes</h2>
            <p className="mt-1 text-muted-foreground text-sm">
              Recipes families have chosen to open up to the wider community.
            </p>
          </div>
        </div>

        {publicRecipes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {publicRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} href={`/recipes/${recipe.id}`} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-amber-200 border-dashed py-10 dark:border-amber-900/30">
            <p className="max-w-xs text-center text-muted-foreground text-sm">
              No public recipes yet. Share one from a recipe page and it will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Food traditions grid */}
      <div>
        <h2 className="mb-4 font-semibold text-lg">Food Traditions</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {CULTURAL_COLLECTIONS.map((c) => (
            <Card
              key={c.region}
              className="cursor-pointer border-amber-100 transition-shadow hover:shadow-md dark:border-amber-900/20"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className="text-2xl">{c.emoji}</span>
                  {c.region}
                </CardTitle>
                <CardDescription>{c.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Public family trees */}
      <div>
        <h2 className="mb-4 font-semibold text-lg">Public Family Trees</h2>
        <div className="flex flex-col items-center justify-center rounded-xl border border-amber-200 border-dashed py-10 dark:border-amber-900/30">
          <p className="max-w-xs text-center text-muted-foreground text-sm">
            Public family trees are not live yet, but public recipes are. Start by sharing a recipe with the wider
            community.
          </p>
          <a href="/dashboard/recipes" className="mt-4 text-amber-700 text-sm hover:underline dark:text-amber-400">
            Go to my recipes →
          </a>
        </div>
      </div>
    </div>
  );
}
