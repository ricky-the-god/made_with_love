"use client";

import Link from "next/link";

import { Accessibility, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppCopy } from "@/lib/i18n/use-app-copy";

import { AccessibilitySettings } from "../_components/accessibility-settings";

export default function AccessibilitySettingsPage() {
  const copy = useAppCopy();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-semibold text-2xl">{copy.accessibilityTitle}</h1>
          <p className="mt-1 text-muted-foreground text-sm">{copy.accessibilityDescription}</p>
        </div>
        <Button asChild variant="outline" className="shrink-0">
          <Link href="/dashboard/settings">
            <ArrowLeft className="size-4" />
            {copy.backToSettings}
          </Link>
        </Button>
      </div>

      <Card className="border-amber-100 dark:border-amber-900/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Accessibility className="size-4 text-amber-700" />
            <CardTitle className="text-base">{copy.accessibilityTitle}</CardTitle>
          </div>
          <CardDescription>{copy.accessibilityDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <AccessibilitySettings />
        </CardContent>
      </Card>
    </div>
  );
}
