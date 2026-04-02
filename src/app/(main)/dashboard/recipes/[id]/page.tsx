import { ArrowLeft, ChefHat, Edit, Heart, MessageSquare } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <a href="/dashboard/recipes">
            <ArrowLeft className="size-4" />
          </a>
        </Button>
      </div>

      {/* Hero */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-amber-100 bg-amber-50/30 dark:border-amber-900/20 dark:bg-amber-950/10">
        <div className="aspect-[3/1] bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/20 dark:to-amber-800/20" />
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-bold text-2xl leading-tight">Recipe Title</h1>
              <p className="mt-1 text-muted-foreground text-sm">By Family Member · Vietnam</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="text-amber-500 hover:text-amber-600">
                <Heart className="size-5" />
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={`/dashboard/recipes/${id}/edit`}>
                  <Edit className="size-3.5" /> Edit
                </a>
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span>⏱ Prep: 30 min</span>
            <span>·</span>
            <span>🔥 Cook: 2 hours</span>
            <span>·</span>
            <span>🍽 4 servings</span>
          </div>
        </div>
      </div>

      {/* Memory / Story — shown before ingredients, as per design principles */}
      <div className="mb-6 rounded-xl border border-amber-100 bg-amber-50/50 p-5 dark:border-amber-900/20 dark:bg-amber-950/10">
        <p className="mb-2 font-semibold text-amber-800 text-sm dark:text-amber-300">The story behind this dish</p>
        <p className="text-muted-foreground text-sm leading-relaxed italic">
          Memory and story will appear here once added. This is where the soul of the recipe lives.
        </p>
        <Button variant="ghost" size="sm" className="mt-3 h-8 text-amber-700 hover:text-amber-800">
          <MessageSquare className="size-3.5" />
          Add a memory
        </Button>
      </div>

      <Separator className="my-6" />

      {/* Ingredients */}
      <div className="mb-6">
        <h2 className="mb-4 font-semibold text-lg">Ingredients</h2>
        <p className="text-muted-foreground text-sm">Ingredients will appear here once added.</p>
      </div>

      <Separator className="my-6" />

      {/* Steps */}
      <div className="mb-6">
        <h2 className="mb-4 font-semibold text-lg">Steps</h2>
        <p className="text-muted-foreground text-sm">Steps will appear here once added.</p>
      </div>

      <Separator className="my-6" />

      {/* Cook CTA */}
      <Button asChild size="lg" className="w-full bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600">
        <a href={`/dashboard/recipes/${id}/cook`}>
          <ChefHat className="size-5" />
          Start cooking
        </a>
      </Button>
    </div>
  );
}
