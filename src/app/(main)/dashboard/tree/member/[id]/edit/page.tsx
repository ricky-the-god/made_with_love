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

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <a href={`/dashboard/tree/member/${id}`}>
            <ArrowLeft className="size-4" />
          </a>
        </Button>
        <div>
          <h1 className="font-semibold text-2xl">Edit Family Member</h1>
          <p className="text-muted-foreground text-sm">Update this person's profile details.</p>
        </div>
      </div>

      <Card className="border-amber-100 dark:border-amber-900/20">
        <CardHeader>
          <CardTitle className="text-lg">Profile details</CardTitle>
          <CardDescription>Changes will be reflected across all their recipes and memories.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Full name *</Label>
                <Input id="name" defaultValue="Family Member" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="relation">Relation</Label>
                <Select defaultValue="grandmother">
                  <SelectTrigger id="relation">
                    <SelectValue />
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
                <Input id="country" placeholder="e.g. Vietnam" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="culture">Cultural background</Label>
                <Input id="culture" placeholder="e.g. Southern Vietnamese" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="bio">Biography</Label>
              <Textarea id="bio" className="min-h-[100px] resize-none" placeholder="A few words about this person..." />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1 bg-amber-700 text-white hover:bg-amber-800">
                Save changes
              </Button>
              <Button variant="outline" asChild>
                <a href={`/dashboard/tree/member/${id}`}>Cancel</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
