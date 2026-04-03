import { ArrowRight, LogOut, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getUser, signOut } from "@/server/auth-actions";

import { ThemeSwitcher } from "../_components/sidebar/theme-switcher";

export default async function ProfilePage() {
  const user = await getUser();

  const email = user?.email ?? null;
  const displayName = email ? email.split("@")[0] : "My Account";
  const initials = email ? email[0].toUpperCase() : "M";

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="font-semibold text-2xl">Profile</h1>

      {/* User info */}
      <Card className="border-amber-100 dark:border-amber-900/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16 rounded-xl">
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

      {/* Appearance */}
      <Card className="border-amber-100 dark:border-amber-900/20">
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
          <CardDescription>Toggle light, dark, or system theme.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm">Theme</span>
            <ThemeSwitcher />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Sign out */}
      <form action={signOut}>
        <Button variant="outline" type="submit" className="w-full gap-2 text-destructive hover:text-destructive">
          <LogOut className="size-4" />
          Sign out
        </Button>
      </form>
    </div>
  );
}
