import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const RELATIONS = [
  "Myself",
  "Mother",
  "Father",
  "Grandmother",
  "Grandfather",
  "Aunt",
  "Uncle",
  "Sister",
  "Brother",
  "Cousin",
  "Child",
  "Family friend",
  "Mentor",
  "Other",
];

export default function NewMemberPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <a href="/dashboard/tree">
            <ArrowLeft className="size-4" />
          </a>
        </Button>
        <div>
          <h1 className="font-semibold text-2xl">Add Family Member</h1>
          <p className="text-muted-foreground text-sm">Create a profile for someone special in your family.</p>
        </div>
      </div>

      <Card className="border-amber-100 dark:border-amber-900/20">
        <CardHeader>
          <CardTitle className="text-lg">About this person</CardTitle>
          <CardDescription>These details help connect recipes and memories to the right person.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Full name *</Label>
                <Input id="name" placeholder="e.g. Grandma Rosa" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="relation">Relation to you *</Label>
                <Select>
                  <SelectTrigger id="relation">
                    <SelectValue placeholder="Select relation" />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATIONS.map((r) => (
                      <SelectItem key={r} value={r.toLowerCase().replace(/\s+/g, "-")}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="country">Country of origin</Label>
                <Input id="country" placeholder="e.g. Vietnam, Italy, Mexico" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="culture">Cultural background</Label>
                <Input id="culture" placeholder="e.g. Southern Vietnamese" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="bio">Short biography</Label>
              <Textarea
                id="bio"
                placeholder="A few words about who they are, their cooking style, or what makes them special..."
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="photo">Profile photo</Label>
              <Input id="photo" type="file" accept="image/*" />
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 dark:border-amber-900/20 dark:bg-amber-950/10">
              <input type="checkbox" id="memorial" className="size-4 accent-amber-700" />
              <div>
                <Label htmlFor="memorial" className="cursor-pointer font-medium">
                  Memorial profile
                </Label>
                <p className="text-muted-foreground text-xs">
                  This person has passed away. Their profile will be handled with care and respect.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                className="flex-1 bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700"
              >
                Add to family tree
              </Button>
              <Button variant="outline" asChild>
                <a href="/dashboard/tree">Cancel</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
