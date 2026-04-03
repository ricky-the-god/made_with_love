import { Bell, Eye, Lock, Paintbrush, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getUserPreferences } from "@/server/settings-actions";

import { AppearanceSettings } from "./_components/appearance-settings";
import { UserPrefSettings } from "./_components/user-pref-settings";

// Default prefs used for unauthenticated / fallback render
const DEFAULT_PREFS = {
  pref_recipes_private_by_default: true,
  pref_show_in_discover: false,
  pref_show_memorial_public: false,
  pref_notify_invitations: true,
  pref_notify_new_recipe: true,
  pref_notify_new_memory: false,
};

export default async function SettingsPage() {
  const prefs = (await getUserPreferences()) ?? DEFAULT_PREFS;
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl">Settings</h1>
        <p className="mt-1 text-muted-foreground text-sm">Manage your preferences, privacy, and account.</p>
      </div>

      {/* Appearance */}
      <Card className="border-amber-100 dark:border-amber-900/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Paintbrush className="size-4 text-amber-700" />
            <CardTitle className="text-base">Appearance</CardTitle>
          </div>
          <CardDescription>Customize how the app looks and feels.</CardDescription>
        </CardHeader>
        <CardContent>
          <AppearanceSettings />
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card className="border-amber-100 dark:border-amber-900/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Eye className="size-4 text-amber-700" />
            <CardTitle className="text-base">Privacy</CardTitle>
          </div>
          <CardDescription>Control who can see your family&apos;s recipes and members.</CardDescription>
        </CardHeader>
        <CardContent>
          <UserPrefSettings initialPrefs={prefs} section="privacy" />
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-amber-100 dark:border-amber-900/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-amber-700" />
            <CardTitle className="text-base">Notifications</CardTitle>
          </div>
          <CardDescription>Choose which updates you want to hear about.</CardDescription>
        </CardHeader>
        <CardContent>
          <UserPrefSettings initialPrefs={prefs} section="notifications" />
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-amber-100 dark:border-amber-900/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="size-4 text-amber-700" />
            <CardTitle className="text-base">Security</CardTitle>
          </div>
          <CardDescription>Manage your password and active sessions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" disabled>
            Change password
            <span className="ml-auto text-muted-foreground text-xs">Coming soon</span>
          </Button>
          <Button variant="outline" className="w-full justify-start" disabled>
            Manage active sessions
            <span className="ml-auto text-muted-foreground text-xs">Coming soon</span>
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Danger zone */}
      <Card className="border-destructive/30 dark:border-destructive/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="size-4 text-destructive" />
            <CardTitle className="text-base text-destructive">Danger zone</CardTitle>
          </div>
          <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full text-destructive hover:text-destructive" disabled>
            Delete my account
            <span className="ml-auto text-muted-foreground text-xs">Coming soon</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
