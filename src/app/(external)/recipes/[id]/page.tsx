import { notFound } from "next/navigation";

import { Clock, Globe, Heart, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/config/app-config";
import type { Memory } from "@/lib/supabase/types";
import { getPublicRecipe } from "@/server/recipe-actions";

export default async function PublicRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = await getPublicRecipe(id);

  if (!recipe) {
    notFound();
  }
  const memories = (recipe.memories ?? []) as Memory[];
  const ingredientLines = recipe.ingredients
    ? recipe.ingredients.split("\n").filter((line: string) => line.trim())
    : [];
  const stepLines = recipe.steps ? recipe.steps.split("\n").filter((line: string) => line.trim()) : [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50/70 to-white px-6 py-12 dark:from-stone-900/70 dark:to-stone-950">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-amber-100 bg-white/90 p-6 shadow-sm dark:border-amber-900/20 dark:bg-stone-950/70">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              <Globe className="size-3.5" />
              Shared publicly
            </Badge>
            {recipe.country_of_origin && (
              <Badge
                variant="outline"
                className="border-amber-200 text-amber-800 dark:border-amber-900/30 dark:text-amber-300"
              >
                <MapPin className="size-3.5" />
                {recipe.country_of_origin}
              </Badge>
            )}
            {recipe.is_family_favorite && (
              <Badge
                variant="outline"
                className="border-amber-200 text-amber-800 dark:border-amber-900/30 dark:text-amber-300"
              >
                <Heart className="size-3.5 fill-amber-400 text-amber-400" />
                Family favorite
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            <h1
              className="font-semibold text-4xl leading-tight"
              style={{ fontFamily: "var(--font-gabriela, Georgia, serif)" }}
            >
              {recipe.title}
            </h1>
            <p className="max-w-3xl text-muted-foreground text-base leading-relaxed">
              {recipe.description ?? "A family recipe shared from Made with Love."}
            </p>
            <p className="text-muted-foreground text-sm">Shared publicly from {APP_CONFIG.name}</p>
          </div>

          {(recipe.prep_time || recipe.cook_time || recipe.servings) && (
            <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
              {recipe.prep_time && (
                <span className="flex items-center gap-1">
                  <Clock className="size-4" /> Prep {recipe.prep_time}
                </span>
              )}
              {recipe.cook_time && <span>Cook {recipe.cook_time}</span>}
              {recipe.servings && <span>{recipe.servings} servings</span>}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-amber-700 text-white hover:bg-amber-800">
              <a href="/auth/v2/register">Start your own family cookbook</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/dashboard/discover">Back to Made with Love</a>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-amber-100 bg-white/90 p-6 dark:border-amber-900/20 dark:bg-stone-950/70">
              <h2 className="mb-4 font-semibold text-xl">Ingredients</h2>
              {ingredientLines.length > 0 ? (
                <ul className="space-y-3 text-sm leading-relaxed">
                  {ingredientLines.map((line: string, index: number) => (
                    <li key={`${recipe.id}-ingredient-${index}`} className="flex items-start gap-3">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-400" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">Ingredients have not been added yet.</p>
              )}
            </section>

            <section className="rounded-2xl border border-amber-100 bg-white/90 p-6 dark:border-amber-900/20 dark:bg-stone-950/70">
              <h2 className="mb-4 font-semibold text-xl">Steps</h2>
              {stepLines.length > 0 ? (
                <ol className="space-y-4 text-sm leading-relaxed">
                  {stepLines.map((line: string, index: number) => (
                    <li key={`${recipe.id}-step-${index}`} className="flex items-start gap-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-100 font-semibold text-amber-800 text-xs dark:bg-amber-900/30 dark:text-amber-300">
                        {index + 1}
                      </span>
                      <span>{line.replace(/^\d+\.\s*/, "")}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground text-sm">Cooking steps have not been added yet.</p>
              )}
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-2xl border border-amber-100 bg-amber-50/60 p-6 dark:border-amber-900/20 dark:bg-amber-950/10">
              <p className="mb-3 font-semibold text-amber-800 text-sm dark:text-amber-300">
                The story behind this dish
              </p>
              {memories.length > 0 ? (
                <div className="space-y-4">
                  {memories.map((memory) => (
                    <div key={memory.id} className="space-y-1">
                      {memory.occasion && (
                        <p className="font-medium text-amber-700 text-xs dark:text-amber-400">{memory.occasion}</p>
                      )}
                      {memory.text && <p className="text-sm italic leading-relaxed">{memory.text}</p>}
                      {memory.meaning_note && <p className="text-muted-foreground text-xs">{memory.meaning_note}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm italic">
                  No family story has been attached to this recipe yet.
                </p>
              )}
            </section>

            {recipe.notes && (
              <section className="rounded-2xl border border-amber-100 bg-white/90 p-6 dark:border-amber-900/20 dark:bg-stone-950/70">
                <h2 className="mb-3 font-semibold text-xl">Notes</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{recipe.notes}</p>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
