"use client";

import { useTransition } from "react";

import { toast } from "sonner";

import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAppCopy } from "@/lib/i18n/use-app-copy";
import type { UserPreferences } from "@/server/settings-actions";
import { saveUserPreferences } from "@/server/settings-actions";

interface Props {
  initialPrefs: UserPreferences;
  section: "privacy" | "notifications";
}

interface PrefSwitchProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  isPending: boolean;
}

function PrefSwitch({ label, description, checked, onChange, isPending }: PrefSwitchProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <p className="font-medium text-sm">{label}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={isPending} />
    </div>
  );
}

export function UserPrefSettings({ initialPrefs, section }: Props) {
  const [isPending, startTransition] = useTransition();
  const copy = useAppCopy();

  const save = (patch: Partial<UserPreferences>) => {
    startTransition(async () => {
      const result = await saveUserPreferences(patch);
      if (result.error) {
        toast.error(copy.preferenceSaveFailed);
      }
    });
  };

  if (section === "privacy") {
    return (
      <div className="space-y-4">
        <PrefSwitch
          label={copy.privacyNewRecipesLabel}
          description={copy.privacyNewRecipesDescription}
          checked={initialPrefs.pref_recipes_private_by_default}
          onChange={(v) => save({ pref_recipes_private_by_default: v })}
          isPending={isPending}
        />
        <Separator />
        <PrefSwitch
          label={copy.privacyDiscoverLabel}
          description={copy.privacyDiscoverDescription}
          checked={initialPrefs.pref_show_in_discover}
          onChange={(v) => save({ pref_show_in_discover: v })}
          isPending={isPending}
        />
        <Separator />
        <PrefSwitch
          label={copy.privacyMemorialLabel}
          description={copy.privacyMemorialDescription}
          checked={initialPrefs.pref_show_memorial_public}
          onChange={(v) => save({ pref_show_memorial_public: v })}
          isPending={isPending}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PrefSwitch
        label={copy.notificationsInvitesLabel}
        description={copy.notificationsInvitesDescription}
        checked={initialPrefs.pref_notify_invitations}
        onChange={(v) => save({ pref_notify_invitations: v })}
        isPending={isPending}
      />
      <Separator />
      <PrefSwitch
        label={copy.notificationsRecipeLabel}
        description={copy.notificationsRecipeDescription}
        checked={initialPrefs.pref_notify_new_recipe}
        onChange={(v) => save({ pref_notify_new_recipe: v })}
        isPending={isPending}
      />
      <Separator />
      <PrefSwitch
        label={copy.notificationsMemoryLabel}
        description={copy.notificationsMemoryDescription}
        checked={initialPrefs.pref_notify_new_memory}
        onChange={(v) => save({ pref_notify_new_memory: v })}
        isPending={isPending}
      />
    </div>
  );
}
