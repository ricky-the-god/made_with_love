"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type FontKey, fontOptions } from "@/lib/fonts/registry";
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
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const resolvedThemeMode = usePreferencesStore((s) => s.resolvedThemeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);
  const themePreset = usePreferencesStore((s) => s.themePreset);
  const setThemePreset = usePreferencesStore((s) => s.setThemePreset);
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
          <Label className="font-medium text-sm">Theme mode</Label>
          <p className="text-muted-foreground text-xs">Choose between light, dark, or your system default.</p>
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
          <Label className="font-medium text-sm">Color preset</Label>
          <p className="text-muted-foreground text-xs">Change the accent color used across the app.</p>
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

      {/* Font */}
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="font-medium text-sm">Font</Label>
          <p className="text-muted-foreground text-xs">Select the typeface used throughout the app.</p>
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
          <Label className="font-medium text-sm">Content layout</Label>
          <p className="text-muted-foreground text-xs">
            Centered keeps content readable; full width uses all available space.
          </p>
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
          <Label className="font-medium text-sm">Sidebar style</Label>
          <p className="text-muted-foreground text-xs">How the sidebar sits within the page.</p>
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
          <Label className="font-medium text-sm">Sidebar collapse mode</Label>
          <p className="text-muted-foreground text-xs">
            Icon mode keeps the sidebar visible as icons; offcanvas slides it off-screen.
          </p>
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
