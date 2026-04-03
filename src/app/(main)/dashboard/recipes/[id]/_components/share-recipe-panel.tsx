"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { Globe, Link2, Lock, Users } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RecipeVisibility } from "@/lib/supabase/types";
import { setRecipeVisibility } from "@/server/recipe-actions";

interface ShareRecipePanelProps {
  recipeId: string;
  initialVisibility: RecipeVisibility;
}

const visibilityMeta: Record<RecipeVisibility, { label: string; description: string }> = {
  private: {
    label: "Private",
    description: "Only you and the people already inside your family space can access this recipe.",
  },
  family: {
    label: "Family",
    description: "Visible throughout your family space, but not to the wider public.",
  },
  public: {
    label: "Public",
    description: "Anyone with the link can view it, and it can appear in Discover.",
  },
};

export function ShareRecipePanel({ recipeId, initialVisibility }: ShareRecipePanelProps) {
  const router = useRouter();
  const [visibility, setVisibility] = useState<RecipeVisibility>(initialVisibility);
  const [isPending, startTransition] = useTransition();

  const publicUrl =
    typeof window === "undefined" ? `/recipes/${recipeId}` : `${window.location.origin}/recipes/${recipeId}`;
  const isPublic = visibility === "public";

  const updateVisibility = (nextVisibility: RecipeVisibility) => {
    if (nextVisibility === visibility) return;

    startTransition(async () => {
      const previousVisibility = visibility;
      setVisibility(nextVisibility);

      const result = await setRecipeVisibility(recipeId, nextVisibility);

      if (result?.error) {
        setVisibility(previousVisibility);
        toast.error(result.error);
        return;
      }

      toast.success(
        nextVisibility === "public"
          ? "Recipe is now public and can be shared outside your family."
          : `Recipe visibility updated to ${visibilityMeta[nextVisibility].label.toLowerCase()}.`,
      );
      router.refresh();
    });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Public recipe link copied.");
    } catch {
      toast.error("Could not copy the link.");
    }
  };

  return (
    <div className="mb-6 rounded-xl border border-amber-100 bg-amber-50/40 p-5 dark:border-amber-900/20 dark:bg-amber-950/10">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm">Sharing</p>
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              {visibilityMeta[visibility].label}
            </Badge>
            {isPublic && !isPending && (
              <Badge
                variant="outline"
                className="border-amber-300 text-amber-800 dark:border-amber-700 dark:text-amber-300"
              >
                Public link ready
              </Badge>
            )}
          </div>
          <p className="max-w-xl text-muted-foreground text-sm leading-relaxed">
            {visibilityMeta[visibility].description}
          </p>
          {isPending && <p className="text-amber-700 text-xs dark:text-amber-300">Saving visibility change...</p>}
        </div>

        {isPublic && !isPending && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyLink} disabled={isPending}>
              <Link2 className="size-4" />
              Copy link
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={`/recipes/${recipeId}`} target="_blank" rel="noreferrer">
                <Globe className="size-4" />
                View public page
              </a>
            </Button>
          </div>
        )}
      </div>

      {isPublic && !isPending && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-white/80 p-3 dark:border-amber-900/30 dark:bg-stone-950/40">
          <p className="mb-2 font-medium text-amber-700 text-xs uppercase tracking-wide dark:text-amber-300">
            Public URL
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input readOnly value={publicUrl} className="font-mono text-xs sm:text-sm" />
            <Button type="button" variant="outline" onClick={copyLink} className="shrink-0">
              <Link2 className="size-4" />
              Copy
            </Button>
          </div>
          <p className="mt-2 text-muted-foreground text-xs">
            Share this exact link with anyone. It opens without requiring a family invitation.
          </p>
        </div>
      )}

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <Button
          type="button"
          variant={visibility === "private" ? "default" : "outline"}
          className={
            visibility === "private"
              ? "bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900"
              : ""
          }
          onClick={() => updateVisibility("private")}
          disabled={isPending}
        >
          <Lock className="size-4" />
          Private
        </Button>
        <Button
          type="button"
          variant={visibility === "family" ? "default" : "outline"}
          className={visibility === "family" ? "bg-amber-700 text-white hover:bg-amber-800" : ""}
          onClick={() => updateVisibility("family")}
          disabled={isPending}
        >
          <Users className="size-4" />
          Family
        </Button>
        <Button
          type="button"
          variant={visibility === "public" ? "default" : "outline"}
          className={visibility === "public" ? "bg-amber-700 text-white hover:bg-amber-800" : ""}
          onClick={() => updateVisibility("public")}
          disabled={isPending}
        >
          <Globe className="size-4" />
          Public
        </Button>
      </div>
    </div>
  );
}
