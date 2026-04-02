import { ArrowLeft, BookOpen, Edit, Heart, Plus } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <a href="/dashboard/tree">
            <ArrowLeft className="size-4" />
          </a>
        </Button>
        <h1 className="font-semibold text-xl text-muted-foreground">Family Tree</h1>
      </div>

      {/* Profile header */}
      <div className="mb-6 flex items-start gap-5 rounded-2xl border border-amber-100 bg-amber-50/30 p-6 dark:border-amber-900/20 dark:bg-amber-950/10">
        <Avatar className="size-20 rounded-xl">
          <AvatarFallback className="rounded-xl bg-amber-100 text-2xl text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            G
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bold text-2xl">Family Member</h2>
              <p className="text-muted-foreground">Grandmother · Vietnam</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={`/dashboard/tree/member/${id}/edit`}>
                <Edit className="size-3.5" />
                Edit
              </a>
            </Button>
          </div>
          <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
            Biography will appear here once added. Share who this person is, their cooking style, and what makes their
            food so meaningful.
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Button
          asChild
          className="bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
        >
          <a href="/dashboard/recipes/new">
            <Plus className="size-4" />
            Add Recipe
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/dashboard/recipes">
            <BookOpen className="size-4" />
            View Recipes
          </a>
        </Button>
      </div>

      <Separator className="my-6" />

      {/* Recipes */}
      <div>
        <h3 className="mb-4 font-semibold text-lg">Recipe Book</h3>
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-amber-200 py-12 dark:border-amber-900/30">
          <BookOpen className="mb-3 size-10 text-amber-300" />
          <p className="font-medium">No recipes yet</p>
          <p className="mt-1 text-muted-foreground text-sm">Add the first recipe to their collection.</p>
          <Button asChild className="mt-4 bg-amber-700 text-white hover:bg-amber-800">
            <a href="/dashboard/recipes/new">
              <Plus className="size-4" />
              Add Recipe
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
