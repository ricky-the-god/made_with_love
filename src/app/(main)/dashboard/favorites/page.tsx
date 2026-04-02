import { Heart } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FavoritesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl">Favorites</h1>
        <p className="mt-1 text-muted-foreground text-sm">The recipes that matter most — to you and your family.</p>
      </div>

      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">My Favorites</TabsTrigger>
          <TabsTrigger value="family">Family Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-amber-200 bg-amber-50/50 py-20 dark:border-amber-900/30 dark:bg-amber-950/10">
            <Heart className="mb-3 size-10 text-amber-300" />
            <p className="font-medium">No personal favorites yet</p>
            <p className="mt-1 max-w-xs text-center text-muted-foreground text-sm">
              Star any recipe to save it here for quick access.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="family" className="mt-6">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-amber-200 bg-amber-50/50 py-20 dark:border-amber-900/30 dark:bg-amber-950/10">
            <Heart className="mb-3 size-10 fill-amber-300 text-amber-300" />
            <p className="font-medium">No family favorites yet</p>
            <p className="mt-1 max-w-xs text-center text-muted-foreground text-sm">
              Mark a recipe as a family favorite to celebrate your most iconic dishes.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
