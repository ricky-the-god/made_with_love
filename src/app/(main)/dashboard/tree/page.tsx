import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function TreePage() {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl text-foreground">Family Tree</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Your living family archive — tap a person to explore their recipes and memories.
          </p>
        </div>
        <Button
          asChild
          className="bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
        >
          <a href="/dashboard/tree/member/new">
            <Plus className="size-4" />
            Add Member
          </a>
        </Button>
      </div>

      {/* Empty state — replace with tree visualization once Supabase is wired */}
      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-amber-200 bg-amber-50/50 py-24 dark:border-amber-900/30 dark:bg-amber-950/10">
        <div className="mb-4 text-6xl">🌳</div>
        <h2 className="font-semibold text-lg text-foreground">Start your family tree</h2>
        <p className="mt-2 max-w-sm text-center text-muted-foreground text-sm">
          Add a family member to begin preserving their recipes, stories, and memories.
        </p>
        <Button
          asChild
          className="mt-6 bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
        >
          <a href="/dashboard/tree/member/new">
            <Plus className="size-4" />
            Add your first family member
          </a>
        </Button>
      </div>
    </div>
  );
}
