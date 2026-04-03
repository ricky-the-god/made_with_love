"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type FontKey, fontOptions } from "@/lib/fonts/registry";
import { APP_LANGUAGE_OPTIONS, type AppLanguage, applyAppLanguagePreference } from "@/lib/i18n/app-language";
import { useAppCopy } from "@/lib/i18n/use-app-copy";
import {
  applyReducedMotionPreference,
  applyTextSizePreference,
  type TextSizePreference,
} from "@/lib/preferences/accessibility";
import {
  CONTENT_LAYOUT_OPTIONS,
  type ContentLayout,
  SIDEBAR_COLLAPSIBLE_OPTIONS,
  SIDEBAR_VARIANT_OPTIONS,
  type SidebarCollapsible,
  type SidebarVariant,
} from "@/lib/preferences/layout";
import {
  applyContentLayout,
  applyFont,
  applySidebarCollapsible,
  applySidebarVariant,
} from "@/lib/preferences/layout-utils";
import { persistPreference } from "@/lib/preferences/preferences-storage";
import { THEME_MODE_OPTIONS, THEME_PRESET_OPTIONS, type ThemeMode, type ThemePreset } from "@/lib/preferences/theme";
import { applyThemePreset } from "@/lib/preferences/theme-utils";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

export function AppearanceSettings() {
  const copy = useAppCopy();
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const resolvedThemeMode = usePreferencesStore((s) => s.resolvedThemeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);
  const themePreset = usePreferencesStore((s) => s.themePreset);
  const setThemePreset = usePreferencesStore((s) => s.setThemePreset);
  const reducedMotion = usePreferencesStore((s) => s.reducedMotion);
  const setReducedMotion = usePreferencesStore((s) => s.setReducedMotion);
  const textSize = usePreferencesStore((s) => s.textSize);
  const setTextSize = usePreferencesStore((s) => s.setTextSize);
  const appLanguage = usePreferencesStore((s) => s.appLanguage);
  const setAppLanguage = usePreferencesStore((s) => s.setAppLanguage);
  const font = usePreferencesStore((s) => s.font);
  const setFont = usePreferencesStore((s) => s.setFont);
  const contentLayout = usePreferencesStore((s) => s.contentLayout);
  const setContentLayout = usePreferencesStore((s) => s.setContentLayout);
  const variant = usePreferencesStore((s) => s.sidebarVariant);
  const setSidebarVariant = usePreferencesStore((s) => s.setSidebarVariant);
  const collapsible = usePreferencesStore((s) => s.sidebarCollapsible);
  const setSidebarCollapsible = usePreferencesStore((s) => s.setSidebarCollapsible);

  const onThemeModeChange = (mode: ThemeMode | "") => {
    if (!mode) return;
    setThemeMode(mode);
    persistPreference("theme_mode", mode);
  };

  const onThemePresetChange = (preset: ThemePreset) => {
    applyThemePreset(preset);
    setThemePreset(preset);
    persistPreference("theme_preset", preset);
  };

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

  const onAppLanguageChange = (value: AppLanguage | "") => {
    if (!value) return;
    applyAppLanguagePreference(value);
    setAppLanguage(value);
    persistPreference("app_language", value);
  };

  const onFontChange = (value: FontKey | "") => {
    if (!value) return;
    applyFont(value);
    setFont(value);
    persistPreference("font", value);
  };

  const onContentLayoutChange = (layout: ContentLayout | "") => {
    if (!layout) return;
    applyContentLayout(layout);
    setContentLayout(layout);
    persistPreference("content_layout", layout);
  };

  const onSidebarVariantChange = (value: SidebarVariant | "") => {
    if (!value) return;
    setSidebarVariant(value);
    applySidebarVariant(value);
    persistPreference("sidebar_variant", value);
  };

  const onSidebarCollapsibleChange = (value: SidebarCollapsible | "") => {
    if (!value) return;
    setSidebarCollapsible(value);
    applySidebarCollapsible(value);
    persistPreference("sidebar_collapsible", value);
  };

  return (
    <div className="space-y-6">
      {/* Theme */}
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="font-medium text-sm">{copy.themeModeLabel}</Label>
          <p className="text-muted-foreground text-xs">{copy.themeModeDescription}</p>
        </div>
        <ToggleGroup type="single" value={themeMode} onValueChange={onThemeModeChange} className="w-full **:flex-1">
          {THEME_MODE_OPTIONS.map((opt) => (
            <ToggleGroupItem key={opt.value} value={opt.value} className="text-sm">
              {opt.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Preset */}
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="font-medium text-sm">{copy.colorPresetLabel}</Label>
          <p className="text-muted-foreground text-xs">{copy.colorPresetDescription}</p>
        </div>
        <Select value={themePreset} onValueChange={onThemePresetChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select preset" />
          </SelectTrigger>
          <SelectContent>
            {THEME_PRESET_OPTIONS.map((preset) => (
              <SelectItem key={preset.value} value={preset.value}>
                <span
                  className="size-3 rounded-full"
                  style={{
                    backgroundColor:
                      (resolvedThemeMode ?? "light") === "dark" ? preset.primary.dark : preset.primary.light,
                  }}
                />
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="font-medium text-sm">{copy.appLanguageLabel}</Label>
          <p className="text-muted-foreground text-xs">{copy.appLanguageDescription}</p>
        </div>
        <Select value={appLanguage} onValueChange={onAppLanguageChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={copy.appLanguageLabel} />
          </SelectTrigger>
          <SelectContent>
            {APP_LANGUAGE_OPTIONS.map((language) => (
              <SelectItem key={language.value} value={language.value}>
                {language.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
          <ToggleGroupItem value="normal" className="text-sm">
            {copy.textSizeNormal}
          </ToggleGroupItem>
          <ToggleGroupItem value="large" className="text-sm">
            {copy.textSizeLarge}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Font */}
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="font-medium text-sm">{copy.fontLabel}</Label>
          <p className="text-muted-foreground text-xs">{copy.fontDescription}</p>
        </div>
        <Select value={font} onValueChange={onFontChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((f) => (
              <SelectItem key={f.key} value={f.key}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Layout */}
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="font-medium text-sm">{copy.contentLayoutLabel}</Label>
          <p className="text-muted-foreground text-xs">{copy.contentLayoutDescription}</p>
        </div>
        <ToggleGroup
          type="single"
          value={contentLayout}
          onValueChange={onContentLayoutChange}
          className="w-full **:flex-1"
        >
          {CONTENT_LAYOUT_OPTIONS.map((opt) => (
            <ToggleGroupItem key={opt.value} value={opt.value} className="text-sm">
              {opt.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Sidebar variant */}
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="font-medium text-sm">{copy.sidebarStyleLabel}</Label>
          <p className="text-muted-foreground text-xs">{copy.sidebarStyleDescription}</p>
        </div>
        <ToggleGroup type="single" value={variant} onValueChange={onSidebarVariantChange} className="w-full **:flex-1">
          {SIDEBAR_VARIANT_OPTIONS.map((opt) => (
            <ToggleGroupItem key={opt.value} value={opt.value} className="text-sm">
              {opt.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Sidebar collapse */}
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="font-medium text-sm">{copy.sidebarCollapseLabel}</Label>
          <p className="text-muted-foreground text-xs">{copy.sidebarCollapseDescription}</p>
        </div>
        <ToggleGroup
          type="single"
          value={collapsible}
          onValueChange={onSidebarCollapsibleChange}
          className="w-full **:flex-1"
        >
          {SIDEBAR_COLLAPSIBLE_OPTIONS.map((opt) => (
            <ToggleGroupItem key={opt.value} value={opt.value} className="text-sm">
              {opt.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
}
