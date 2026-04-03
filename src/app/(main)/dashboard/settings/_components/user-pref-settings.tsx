"use client";

import { useTransition } from "react";

import { toast } from "sonner";

import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
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
        <p className="text-sm font-medium">{label}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={isPending} />
    </div>
  );
}

export function UserPrefSettings({ initialPrefs, section }: Props) {
  const [isPending, startTransition] = useTransition();

  const save = (patch: Partial<UserPreferences>) => {
    startTransition(async () => {
      const result = await saveUserPreferences(patch);
      if (result.error) {
        toast.error("Failed to save preference");
      }
    });
  };

  if (section === "privacy") {
    return (
      <div className="space-y-4">
        <PrefSwitch
          label="Make new recipes private by default"
          description="New recipes will only be visible to your family."
          checked={initialPrefs.pref_recipes_private_by_default}
          onChange={(v) => save({ pref_recipes_private_by_default: v })}
          isPending={isPending}
        />
        <Separator />
        <PrefSwitch
          label="Appear in cultural discovery"
          description="Allow your family's public recipes to appear in Discover."
          checked={initialPrefs.pref_show_in_discover}
          onChange={(v) => save({ pref_show_in_discover: v })}
          isPending={isPending}
        />
        <Separator />
        <PrefSwitch
          label="Show memorial profiles publicly"
          description="Allow others to view memorial family member profiles."
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
        label="Family invitation emails"
        description="Get notified when someone accepts your family invite."
        checked={initialPrefs.pref_notify_invitations}
        onChange={(v) => save({ pref_notify_invitations: v })}
        isPending={isPending}
      />
      <Separator />
      <PrefSwitch
        label="New recipe added by family"
        description="Notify me when a family member uploads a new recipe."
        checked={initialPrefs.pref_notify_new_recipe}
        onChange={(v) => save({ pref_notify_new_recipe: v })}
        isPending={isPending}
      />
      <Separator />
      <PrefSwitch
        label="Memory and story updates"
        description="Notify me when a memory is attached to a recipe I care about."
        checked={initialPrefs.pref_notify_new_memory}
        onChange={(v) => save({ pref_notify_new_memory: v })}
        isPending={isPending}
      />
    </div>
  );
}
