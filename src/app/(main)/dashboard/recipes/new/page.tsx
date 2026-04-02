"use client";

import { useState } from "react";

import { ArrowLeft, ImageUp, PenLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function NewRecipePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <a href="/dashboard/recipes">
            <ArrowLeft className="size-4" />
          </a>
        </Button>
        <div>
          <h1 className="font-semibold text-2xl">Add Recipe</h1>
          <p className="text-muted-foreground text-sm">Preserve a family recipe — from a photo or by hand.</p>
        </div>
      </div>

      <Tabs defaultValue="manual">
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="manual" className="flex-1 gap-2">
            <PenLine className="size-4" />
            Write manually
          </TabsTrigger>
          <TabsTrigger value="image" className="flex-1 gap-2">
            <ImageUp className="size-4" />
            Upload image
          </TabsTrigger>
        </TabsList>

        {/* Manual creation */}
        <TabsContent value="manual">
          <Card className="border-amber-100 dark:border-amber-900/20">
            <CardHeader>
              <CardTitle className="text-lg">Recipe details</CardTitle>
              <CardDescription>Fill in the recipe as you know it. You can always edit later.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title">Recipe title *</Label>
                  <Input id="title" placeholder="e.g. Grandma's Pho Bo" />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="member">Family member</Label>
                    <Input id="member" placeholder="Who is this recipe from?" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="country">Country of origin</Label>
                    <Input id="country" placeholder="e.g. Vietnam" />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-3">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="prep">Prep time</Label>
                    <Input id="prep" placeholder="e.g. 30 min" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="cook">Cook time</Label>
                    <Input id="cook" placeholder="e.g. 2 hours" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="servings">Servings</Label>
                    <Input id="servings" placeholder="e.g. 4" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="ingredients">Ingredients</Label>
                  <Textarea
                    id="ingredients"
                    className="min-h-[120px] resize-none font-mono text-sm"
                    placeholder={"2 kg beef bones\n1 cinnamon stick\n3 star anise\n..."}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="steps">Steps</Label>
                  <Textarea
                    id="steps"
                    className="min-h-[160px] resize-none text-sm"
                    placeholder={
                      "1. Roast the bones at 200°C for 30 minutes...\n2. Bring a large pot of water to boil..."
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="story">Memory or story</Label>
                  <Textarea
                    id="story"
                    className="min-h-[100px] resize-none text-sm"
                    placeholder="When did this dish matter? Who made it? What does it mean to your family?"
                  />
                </div>
                <Button type="submit" className="bg-amber-700 text-white hover:bg-amber-800">
                  Save recipe
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Image upload */}
        <TabsContent value="image">
          <Card className="border-amber-100 dark:border-amber-900/20">
            <CardHeader>
              <CardTitle className="text-lg">Upload a recipe photo</CardTitle>
              <CardDescription>
                Upload a photo of a handwritten recipe card, notebook page, or printed recipe. Claude AI will extract
                the text and structure it for you to review.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-5">
                <div className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-amber-200 bg-amber-50/50 py-12 transition-colors hover:bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/10">
                  <ImageUp className="size-10 text-amber-400" />
                  <div className="text-center">
                    <p className="font-medium">Drop your image here or click to browse</p>
                    <p className="mt-1 text-muted-foreground text-xs">Supports JPG, PNG, HEIC up to 10MB</p>
                  </div>
                  <Input type="file" accept="image/*" className="hidden" id="recipe-image" />
                  <Button variant="outline" asChild>
                    <label htmlFor="recipe-image" className="cursor-pointer">
                      Choose file
                    </label>
                  </Button>
                </div>
                <div className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 text-sm dark:border-amber-900/20 dark:bg-amber-950/10">
                  <p className="font-medium text-amber-800 dark:text-amber-300">How it works</p>
                  <p className="mt-1 text-muted-foreground">
                    Claude AI will read the recipe and extract ingredients and steps. You'll review and confirm
                    everything before it's saved — uncertain fields will be flagged for you to correct.
                  </p>
                </div>
                <Button className="bg-amber-700 text-white hover:bg-amber-800" disabled>
                  Extract recipe with AI
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
