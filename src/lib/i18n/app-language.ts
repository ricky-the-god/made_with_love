export const APP_LANGUAGE_VALUES = ["en", "es", "fr", "zh-CN", "hi"] as const;

export type AppLanguage = (typeof APP_LANGUAGE_VALUES)[number];

export const APP_LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "zh-CN", label: "Chinese (Simplified)" },
  { value: "hi", label: "Hindi" },
] as const satisfies ReadonlyArray<{ value: AppLanguage; label: string }>;

export function applyAppLanguagePreference(value: AppLanguage) {
  document.documentElement.setAttribute("data-app-language", value);
  document.documentElement.lang = value;
}
