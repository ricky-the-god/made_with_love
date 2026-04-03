import { ArrowRight, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

import { ProfileDetailsForm } from "./_components/profile-details-form";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).maybeSingle()
    : { data: null };

  const email = user?.email ?? null;
  const displayName = profile?.full_name?.trim() || (email ? email.split("@")[0] : "My Account");
  const initials = displayName.charAt(0).toUpperCase() || "M";
  const avatarUrl = profile?.avatar_url ?? null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="font-semibold text-2xl">Profile</h1>

      {/* User info */}
      <Card className="border-amber-100 dark:border-amber-900/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16 rounded-xl">
              <AvatarImage src={avatarUrl || undefined} alt={displayName} className="rounded-xl object-cover" />
              <AvatarFallback className="rounded-xl bg-amber-100 text-2xl text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg">{displayName}</p>
              <p className="text-muted-foreground text-sm">{email ?? "My Account"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-100 dark:border-amber-900/20">
        <CardHeader>
          <CardTitle className="text-base">Account details</CardTitle>
          <CardDescription>Update your display name and profile picture.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileDetailsForm initialName={profile?.full_name ?? ""} initialAvatarUrl={avatarUrl ?? ""} />
        </CardContent>
      </Card>

      {/* Family */}
      <Card className="border-amber-100 dark:border-amber-900/20">
        <CardHeader>
          <CardTitle className="text-base">My Family</CardTitle>
          <CardDescription>Manage your family space and members.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild className="w-full justify-between">
            <a href="/dashboard/profile/family">
              <div className="flex items-center gap-2">
                <Users className="size-4" />
                Family Management
              </div>
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
