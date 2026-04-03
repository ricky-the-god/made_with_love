"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type FontKey, fontOptions } from "@/lib/fonts/registry";
import { useAppCopy } from "@/lib/i18n/use-app-copy";
import {
  applyReducedMotionPreference,
  applyTextSizePreference,
  type TextSizePreference,
} from "@/lib/preferences/accessibility";
import { applyFont } from "@/lib/preferences/layout-utils";
import { persistPreference } from "@/lib/preferences/preferences-storage";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

export function AccessibilitySettings() {
  const copy = useAppCopy();
  const reducedMotion = usePreferencesStore((state) => state.reducedMotion);
  const setReducedMotion = usePreferencesStore((state) => state.setReducedMotion);
  const textSize = usePreferencesStore((state) => state.textSize);
  const setTextSize = usePreferencesStore((state) => state.setTextSize);
  const font = usePreferencesStore((state) => state.font);
  const setFont = usePreferencesStore((state) => state.setFont);

  const onReducedMotionChange = (checked: boolean) => {
    const nextValue = checked ? "reduce" : "no-preference";
    applyReducedMotionPreference(nextValue);
    setReducedMotion(nextValue);
    persistPreference("reduced_motion", nextValue);
  };

  const onTextSizeChange = (value: TextSizePreference | "") => {
    if (!value) return;
    applyTextSizePreference(value);
    setTextSize(value);
    persistPreference("text_size", value);
  };

  const onFontChange = (value: FontKey | "") => {
    if (!value) return;
    applyFont(value);
    setFont(value);
    persistPreference("font", value);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="font-medium text-sm">{copy.reducedMotionLabel}</Label>
          <p className="text-muted-foreground text-xs">{copy.reducedMotionDescription}</p>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3">
          <div className="space-y-0.5">
            <p className="font-medium text-sm">{copy.preferLessAnimationLabel}</p>
            <p className="text-muted-foreground text-xs">{copy.preferLessAnimationDescription}</p>
          </div>
          <Switch checked={reducedMotion === "reduce"} onCheckedChange={onReducedMotionChange} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="font-medium text-sm">{copy.textSizeLabel}</Label>
          <p className="text-muted-foreground text-xs">{copy.textSizeDescription}</p>
        </div>
        <ToggleGroup type="single" value={textSize} onValueChange={onTextSizeChange} className="w-full **:flex-1">
          <ToggleGroupItem value="12" className="text-sm">
            12 px
          </ToggleGroupItem>
          <ToggleGroupItem value="14" className="text-sm">
            14 px
          </ToggleGroupItem>
          <ToggleGroupItem value="16" className="text-sm">
            16 px
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="font-medium text-sm">{copy.fontLabel}</Label>
          <p className="text-muted-foreground text-xs">{copy.fontDescription}</p>
        </div>
        <Select value={font} onValueChange={onFontChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={copy.fontLabel} />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((option) => (
              <SelectItem key={option.key} value={option.key}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
