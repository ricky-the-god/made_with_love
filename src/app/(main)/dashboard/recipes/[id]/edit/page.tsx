import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <a href={`/dashboard/recipes/${id}`}>
            <ArrowLeft className="size-4" />
          </a>
        </Button>
        <div>
          <h1 className="font-semibold text-2xl">Edit Recipe</h1>
          <p className="text-muted-foreground text-sm">Update this recipe's details.</p>
        </div>
      </div>

      <Card className="border-amber-100 dark:border-amber-900/20">
        <CardHeader>
          <CardTitle className="text-lg">Recipe details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" defaultValue="Recipe Title" />
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="prep">Prep time</Label>
                <Input id="prep" placeholder="30 min" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="cook">Cook time</Label>
                <Input id="cook" placeholder="2 hours" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="servings">Servings</Label>
                <Input id="servings" placeholder="4" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" placeholder="e.g. Soup, Dessert, Noodle dish" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="ingredients">Ingredients</Label>
              <Textarea id="ingredients" className="min-h-[120px] resize-none font-mono text-sm" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="steps">Steps</Label>
              <Textarea id="steps" className="min-h-[160px] resize-none text-sm" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="story">Memory or story</Label>
              <Textarea id="story" className="min-h-[100px] resize-none text-sm" />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1 bg-amber-700 text-white hover:bg-amber-800">
                Save changes
              </Button>
              <Button variant="outline" asChild>
                <a href={`/dashboard/recipes/${id}`}>Cancel</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
