import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import { getFamilyMembers } from "@/server/family-actions";

const GENERATION_LABELS: Record<number, string> = {
  1: "Great-grandparent",
  2: "Grandparent",
  3: "Parent",
  4: "My generation",
  5: "Child",
};

export default async function TreePage() {
  const members = await getFamilyMembers();

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

      {members.length === 0 ? (
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
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <a
              key={member.id}
              href={`/dashboard/tree/member/${member.id}`}
              className="group flex items-start gap-4 rounded-2xl border border-amber-100 bg-amber-50/30 p-4 transition-colors hover:border-amber-300 hover:bg-amber-50/60 dark:border-amber-900/20 dark:bg-amber-950/10 dark:hover:border-amber-800/40 dark:hover:bg-amber-950/20"
            >
              {/* Avatar */}
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-amber-100 font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                {member.photo_url ? (
                  <img src={member.photo_url} alt={member.name} className="size-14 rounded-xl object-cover" />
                ) : (
                  <span className="text-lg">{getInitials(member.name)}</span>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-semibold text-foreground">{member.name}</p>
                  {member.is_memorial && (
                    <Badge
                      variant="secondary"
                      className="shrink-0 border-0 bg-stone-100 text-stone-500 text-xs dark:bg-stone-800/50 dark:text-stone-400"
                    >
                      In memory
                    </Badge>
                  )}
                </div>
                {member.relation && (
                  <p className="mt-0.5 text-muted-foreground text-sm capitalize">{member.relation}</p>
                )}
                {(member.country_of_origin || member.generation) && (
                  <p className="mt-1 text-muted-foreground text-xs">
                    {[member.country_of_origin, member.generation ? GENERATION_LABELS[member.generation] : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
