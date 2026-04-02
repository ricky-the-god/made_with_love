import { getFavoriteRecipes } from "@/server/recipe-actions";

import { FavoritesTabs } from "./_components/favorites-tabs";

export default async function FavoritesPage() {
  const { personal, family } = await getFavoriteRecipes();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl">Favorites</h1>
        <p className="mt-1 text-muted-foreground text-sm">The recipes that matter most — to you and your family.</p>
      </div>

      <FavoritesTabs personal={personal} family={family} />
    </div>
  );
}
