import { Compass, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const CULTURAL_COLLECTIONS = [
  { region: "Southeast Asia", emoji: "🌿", description: "Vietnamese, Filipino, Thai, Indonesian family recipes" },
  { region: "Mediterranean", emoji: "🫒", description: "Italian, Greek, Lebanese, Spanish culinary traditions" },
  { region: "West Africa", emoji: "🌍", description: "Nigerian, Ghanaian, Senegalese family classics" },
  { region: "Latin America", emoji: "🌶️", description: "Mexican, Colombian, Peruvian, Brazilian family dishes" },
];

export default function DiscoverPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-semibold text-2xl">Discover</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Explore family recipes and food traditions from around the world.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search by country, culture, ingredient, or family name..." />
      </div>

      {/* Featured collections */}
      <div>
        <h2 className="mb-4 font-semibold text-lg">Cultural Collections</h2>
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
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-amber-200 bg-amber-50/50 py-16 dark:border-amber-900/30 dark:bg-amber-950/10">
          <Compass className="mb-3 size-10 text-amber-300" />
          <p className="font-medium">No public families yet</p>
          <p className="mt-1 max-w-sm text-center text-muted-foreground text-sm">
            When families choose to share their recipes, their stories will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
