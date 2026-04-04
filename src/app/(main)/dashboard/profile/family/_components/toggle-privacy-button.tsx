"use client";

import { useTransition } from "react";

import { Globe, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { updateFamily } from "@/server/family-actions";

interface TogglePrivacyButtonProps {
  familyId: string;
  currentSetting: string;
}

export function TogglePrivacyButton({ familyId, currentSetting }: TogglePrivacyButtonProps) {
  const [isPending, startTransition] = useTransition();
  const isPublic = currentSetting === "public";

  function handleToggle() {
    startTransition(async () => {
      await updateFamily(familyId, { privacy_setting: isPublic ? "private" : "public" });
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={handleToggle}
      className="shrink-0 border-amber-200 text-amber-800 hover:bg-amber-50 dark:border-amber-800/40 dark:text-amber-300 dark:hover:bg-amber-950/30"
    >
      {isPublic ? (
        <>
          <Lock className="size-3.5" />
          {isPending ? "Saving..." : "Make Private"}
        </>
      ) : (
        <>
          <Globe className="size-3.5" />
          {isPending ? "Saving..." : "Make Public"}
        </>
      )}
    </Button>
  );
}
