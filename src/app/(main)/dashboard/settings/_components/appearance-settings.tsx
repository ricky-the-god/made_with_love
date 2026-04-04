"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { APP_LANGUAGE_OPTIONS, type AppLanguage, applyAppLanguagePreference } from "@/lib/i18n/app-language";
import { useAppCopy } from "@/lib/i18n/use-app-copy";
import {
  CONTENT_LAYOUT_OPTIONS,
  type ContentLayout,
  SIDEBAR_COLLAPSIBLE_OPTIONS,
  SIDEBAR_VARIANT_OPTIONS,
  type SidebarCollapsible,
  type SidebarVariant,
} from "@/lib/preferences/layout";
import { applyContentLayout, applySidebarCollapsible, applySidebarVariant } from "@/lib/preferences/layout-utils";
import { persistPreference } from "@/lib/preferences/preferences-storage";
import { THEME_MODE_OPTIONS, type ThemeMode } from "@/lib/preferences/theme";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

export function AppearanceSettings() {
  const copy = useAppCopy();
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);
  const appLanguage = usePreferencesStore((s) => s.appLanguage);
  const setAppLanguage = usePreferencesStore((s) => s.setAppLanguage);
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

  const onAppLanguageChange = (value: AppLanguage | "") => {
    if (!value) return;
    applyAppLanguagePreference(value);
    setAppLanguage(value);
    persistPreference("app_language", value);
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
