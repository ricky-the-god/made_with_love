import { redirect } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RECIPE_CATEGORY_OPTIONS } from "@/data/recipe-options";
import { getRecipe, updateRecipe } from "@/server/recipe-actions";

import { DeleteRecipeButton } from "./_components/delete-recipe-button";

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    redirect("/dashboard/recipes");
  }

  async function handleUpdateRecipe(formData: FormData) {
    "use server";

    const title = String(formData.get("title") ?? "").trim();
    if (!title) {
      return;
    }

    await updateRecipe(id, {
      title,
      prep_time: String(formData.get("prep_time") ?? "").trim() || undefined,
      cook_time: String(formData.get("cook_time") ?? "").trim() || undefined,
      servings: String(formData.get("servings") ?? "").trim() || undefined,
      culture_tag: String(formData.get("culture_tag") ?? "").trim() || undefined,
      ingredients: String(formData.get("ingredients") ?? "").trim() || undefined,
      steps: String(formData.get("steps") ?? "").trim() || undefined,
      notes: String(formData.get("notes") ?? "").trim() || undefined,
    });

    redirect(`/dashboard/recipes/${id}`);
  }

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
          <form action={handleUpdateRecipe} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" defaultValue={recipe.title ?? ""} required />
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="prep">Prep time</Label>
                <Input id="prep" name="prep_time" placeholder="30 min" defaultValue={recipe.prep_time ?? ""} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="cook">Cook time</Label>
                <Input id="cook" name="cook_time" placeholder="2 hours" defaultValue={recipe.cook_time ?? ""} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="servings">Servings</Label>
                <Input id="servings" name="servings" placeholder="4" defaultValue={recipe.servings ?? ""} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="culture_tag"
                defaultValue={recipe.culture_tag ?? ""}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Choose a recipe category</option>
                {RECIPE_CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="ingredients">Ingredients</Label>
              <Textarea
                id="ingredients"
                name="ingredients"
                className="min-h-[120px] resize-none font-mono text-sm"
                defaultValue={recipe.ingredients ?? ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="steps">Steps</Label>
              <Textarea
                id="steps"
                name="steps"
                className="min-h-[160px] resize-none text-sm"
                defaultValue={recipe.steps ?? ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="story">Memory or story</Label>
              <Textarea
                id="story"
                name="notes"
                className="min-h-[100px] resize-none text-sm"
                defaultValue={recipe.notes ?? ""}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" className="flex-1 bg-amber-700 text-white hover:bg-amber-800">
                Save changes
              </Button>
              <Button variant="outline" asChild>
                <a href={`/dashboard/recipes/${id}`}>Cancel</a>
              </Button>
              <DeleteRecipeButton recipeId={id} />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
