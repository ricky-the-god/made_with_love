"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function RecipesFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("filter");

  function setFilter(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("filter", value);
    } else {
      params.delete("filter");
    }
    router.push(`?${params.toString()}`);
  }

  const isAll = !current || current !== "favorites";
  const isFavorites = current === "favorites";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setFilter(null)}
        className={[
          "inline-flex items-center rounded-full px-4 py-1.5 font-medium text-sm transition-colors",
          isAll
            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
            : "text-muted-foreground hover:bg-accent hover:text-foreground",
        ].join(" ")}
      >
        All recipes
      </button>
      <button
        type="button"
        onClick={() => setFilter("favorites")}
        className={[
          "inline-flex items-center gap-1 rounded-full px-4 py-1.5 font-medium text-sm transition-colors",
          isFavorites
            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
            : "text-muted-foreground hover:bg-accent hover:text-foreground",
        ].join(" ")}
      >
        Favourites ♥
      </button>
    </div>
  );
}
