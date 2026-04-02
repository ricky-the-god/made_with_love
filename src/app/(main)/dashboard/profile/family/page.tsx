import { ArrowLeft, Plus, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function FamilyManagementPage() {
  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <a href="/dashboard/profile">
            <ArrowLeft className="size-4" />
          </a>
        </Button>
        <div>
          <h1 className="font-semibold text-2xl">Family Management</h1>
          <p className="text-muted-foreground text-sm">Manage your family space and collaborators.</p>
        </div>
      </div>

      {/* Family name */}
      <Card className="border-amber-100 dark:border-amber-900/20">
        <CardHeader>
          <CardTitle className="text-base">Family Space</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="family-name">Family name</Label>
            <div className="flex gap-2">
              <Input id="family-name" placeholder="e.g. The Nguyen Family" />
              <Button variant="outline">Save</Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Privacy</Label>
            <div className="flex gap-2">
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
              >
                Private
              </Badge>
              <p className="text-muted-foreground text-xs self-center">Only family members can see your archive.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members */}
      <Card className="border-amber-100 dark:border-amber-900/20">
        <CardHeader>
          <CardTitle className="text-base">Members</CardTitle>
          <CardDescription>Invite family members to contribute recipes and memories.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-amber-200 py-8 dark:border-amber-900/30">
            <Users className="mb-2 size-8 text-amber-300" />
            <p className="text-muted-foreground text-sm">Only you are in this family space so far.</p>
          </div>
          <Separator />
          <div>
            <Label htmlFor="invite" className="mb-2 block">
              Invite by email
            </Label>
            <div className="flex gap-2">
              <Input id="invite" type="email" placeholder="family@example.com" />
              <Button className="bg-amber-700 text-white hover:bg-amber-800">
                <Plus className="size-4" />
                Invite
              </Button>
            </div>
            <p className="mt-2 text-muted-foreground text-xs">
              Invited members can view and contribute to your family archive.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
