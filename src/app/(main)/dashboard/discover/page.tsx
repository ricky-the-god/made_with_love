import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function DiscoverPage() {
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
            No public family trees yet. When families choose to share their stories, they'll appear here.
          </p>
          <a
            href="/dashboard/profile/family"
            className="mt-4 text-amber-700 text-sm hover:underline dark:text-amber-400"
          >
            Share my family's recipes →
          </a>
        </div>
      </div>
    </div>
  );
}
