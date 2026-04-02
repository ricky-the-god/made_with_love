import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RecipesPage() {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl">Recipes</h1>
          <p className="mt-1 text-muted-foreground text-sm">All the recipes your family has preserved.</p>
        </div>
        <Button
          asChild
          className="bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
        >
          <a href="/dashboard/recipes/new">
            <Plus className="size-4" />
            Add Recipe
          </a>
        </Button>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search recipes, ingredients, family members..." />
        </div>
      </div>

      {/* Empty state */}
      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-amber-200 bg-amber-50/50 py-24 dark:border-amber-900/30 dark:bg-amber-950/10">
        <div className="mb-4 text-6xl">📖</div>
        <h2 className="font-semibold text-lg">No recipes yet</h2>
        <p className="mt-2 max-w-sm text-center text-muted-foreground text-sm">
          Preserve your first family recipe — upload a handwritten card or create one manually.
        </p>
        <Button asChild className="mt-6 bg-amber-700 text-white hover:bg-amber-800">
          <a href="/dashboard/recipes/new">
            <Plus className="size-4" />
            Add your first recipe
          </a>
        </Button>
      </div>
    </div>
  );
}
