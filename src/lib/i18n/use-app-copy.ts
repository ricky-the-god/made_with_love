"use client";

import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { getAppCopy } from "./copy";

export function useAppCopy() {
  const appLanguage = usePreferencesStore((state) => state.appLanguage);
  return getAppCopy(appLanguage);
}
