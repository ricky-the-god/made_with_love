import { ArrowLeft, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function PublicFamilyTreePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <a href="/dashboard/discover">
            <ArrowLeft className="size-4" />
          </a>
        </Button>
        <h1 className="font-semibold text-xl text-muted-foreground">Discover</h1>
      </div>

      <div className="mb-6 rounded-2xl border border-amber-100 bg-amber-50/30 p-6 dark:border-amber-900/20 dark:bg-amber-950/10">
        <h2 className="font-bold text-2xl">Family Archive</h2>
        <p className="mt-1 text-muted-foreground text-sm">Shared publicly by this family</p>
        <p className="mt-3 text-muted-foreground text-sm">
          This is a read-only view of this family's public recipes and stories.
        </p>
      </div>

      <Separator className="my-6" />

      <div>
        <h3 className="mb-4 font-semibold text-lg">Public Recipes</h3>
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-amber-200 py-12 dark:border-amber-900/30">
          <BookOpen className="mb-3 size-10 text-amber-300" />
          <p className="text-muted-foreground text-sm">No public recipes shared yet.</p>
        </div>
      </div>
    </div>
  );
}
