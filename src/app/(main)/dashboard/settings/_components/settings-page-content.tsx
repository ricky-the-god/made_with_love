"use client";

import { Bell, Eye, Lock, Paintbrush, Trash2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppCopy } from "@/lib/i18n/use-app-copy";
import type { UserPreferences } from "@/server/settings-actions";

import { AppearanceSettings } from "./appearance-settings";
import { DangerZoneSettings, SecuritySettings } from "./security-settings";
import { UserPrefSettings } from "./user-pref-settings";

export function SettingsPageContent({ prefs }: { prefs: UserPreferences }) {
  const copy = useAppCopy();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl">{copy.settingsPageTitle}</h1>
        <p className="mt-1 text-muted-foreground text-sm">{copy.settingsPageDescription}</p>
      </div>

      <Card className="border-amber-100 dark:border-amber-900/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Paintbrush className="size-4 text-amber-700" />
            <CardTitle className="text-base">{copy.appearanceTitle}</CardTitle>
          </div>
          <CardDescription>{copy.appearanceDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <AppearanceSettings />
        </CardContent>
      </Card>

      <Card className="border-amber-100 dark:border-amber-900/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Eye className="size-4 text-amber-700" />
            <CardTitle className="text-base">{copy.privacyTitle}</CardTitle>
          </div>
          <CardDescription>{copy.privacyDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <UserPrefSettings initialPrefs={prefs} section="privacy" />
        </CardContent>
      </Card>

      <Card className="border-amber-100 dark:border-amber-900/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-amber-700" />
            <CardTitle className="text-base">{copy.notificationsTitle}</CardTitle>
          </div>
          <CardDescription>{copy.notificationsDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <UserPrefSettings initialPrefs={prefs} section="notifications" />
        </CardContent>
      </Card>

      <Card className="border-amber-100 dark:border-amber-900/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="size-4 text-amber-700" />
            <CardTitle className="text-base">{copy.securityTitle}</CardTitle>
          </div>
          <CardDescription>{copy.securityDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <SecuritySettings />
        </CardContent>
      </Card>

      <Separator />

      <Card className="border-destructive/30 dark:border-destructive/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="size-4 text-destructive" />
            <CardTitle className="text-base text-destructive">{copy.dangerZoneTitle}</CardTitle>
          </div>
          <CardDescription>{copy.dangerZoneDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <DangerZoneSettings />
        </CardContent>
      </Card>
    </div>
  );
}
