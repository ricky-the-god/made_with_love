/**
 * Boot script that reads user preference values (theme mode, theme preset,
 * content layout, navbar style) from cookies or localStorage based on the
 * configured persistence mode.
 *
 * Runs early in <head> to apply the correct data attributes before hydration,
 * preventing layout or theme flicker and keeping RootLayout fully static.
 */
import { PREFERENCE_DEFAULTS, PREFERENCE_PERSISTENCE } from "@/lib/preferences/preferences-config";

export function ThemeBootScript() {
  const persistence = JSON.stringify({
    theme_mode: PREFERENCE_PERSISTENCE.theme_mode,
    theme_preset: PREFERENCE_PERSISTENCE.theme_preset,
    reduced_motion: PREFERENCE_PERSISTENCE.reduced_motion,
    text_size: PREFERENCE_PERSISTENCE.text_size,
    app_language: PREFERENCE_PERSISTENCE.app_language,
    font: PREFERENCE_PERSISTENCE.font,
    content_layout: PREFERENCE_PERSISTENCE.content_layout,
    navbar_style: PREFERENCE_PERSISTENCE.navbar_style,
    sidebar_variant: PREFERENCE_PERSISTENCE.sidebar_variant,
    sidebar_collapsible: PREFERENCE_PERSISTENCE.sidebar_collapsible,
  });

  const defaults = JSON.stringify({
    theme_mode: PREFERENCE_DEFAULTS.theme_mode,
    theme_preset: PREFERENCE_DEFAULTS.theme_preset,
    reduced_motion: PREFERENCE_DEFAULTS.reduced_motion,
    text_size: PREFERENCE_DEFAULTS.text_size,
    app_language: PREFERENCE_DEFAULTS.app_language,
    font: PREFERENCE_DEFAULTS.font,
    content_layout: PREFERENCE_DEFAULTS.content_layout,
    navbar_style: PREFERENCE_DEFAULTS.navbar_style,
    sidebar_variant: PREFERENCE_DEFAULTS.sidebar_variant,
    sidebar_collapsible: PREFERENCE_DEFAULTS.sidebar_collapsible,
  });

  const code = `
    (function () {
      try {
        var root = document.documentElement;
        var PERSISTENCE = ${persistence};
        var DEFAULTS = ${defaults};

        function readCookie(name) {
          var match = document.cookie.split("; ").find(function(c) {
            return c.startsWith(name + "=");
          });
          return match ? decodeURIComponent(match.split("=")[1]) : null;
        }

        function readLocal(name) {
          try {
            return window.localStorage.getItem(name);
          } catch (e) {
            return null;
          }
        }

        function readPreference(key, fallback) {
          var mode = PERSISTENCE[key];
          var value = null;

          if (mode === "localStorage") {
            value = readLocal(key);
          }

          if (!value && (mode === "client-cookie" || mode === "server-cookie")) {
            value = readCookie(key);
          }

          if (!value || typeof value !== "string") {
            return fallback;
          }

          return value;
        }

        var rawMode = readPreference("theme_mode", DEFAULTS.theme_mode);
        var rawPreset = readPreference("theme_preset", DEFAULTS.theme_preset);
        var rawReducedMotion = readPreference("reduced_motion", DEFAULTS.reduced_motion);
        var rawTextSize = readPreference("text_size", DEFAULTS.text_size);
        var rawAppLanguage = readPreference("app_language", DEFAULTS.app_language);
        var rawFont = readPreference("font", DEFAULTS.font);
        var rawContentLayout = readPreference("content_layout", DEFAULTS.content_layout);
        var rawNavbarStyle = readPreference("navbar_style", DEFAULTS.navbar_style);
        var rawSidebarVariant = readPreference("sidebar_variant", DEFAULTS.sidebar_variant);
        var rawSidebarCollapsible = readPreference("sidebar_collapsible", DEFAULTS.sidebar_collapsible);

        var isValidMode = rawMode === "dark" || rawMode === "light" || rawMode === "system";
        var mode = isValidMode ? rawMode : DEFAULTS.theme_mode;
        var resolvedMode =
          mode === "system" && window.matchMedia
            ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
            : mode;
        var preset = rawPreset || DEFAULTS.theme_preset;
        var reducedMotion = rawReducedMotion === "reduce" ? "reduce" : DEFAULTS.reduced_motion;
        var textSize = rawTextSize === "12" || rawTextSize === "14" || rawTextSize === "16" ? rawTextSize : DEFAULTS.text_size;
        var appLanguage =
          rawAppLanguage === "es" || rawAppLanguage === "fr" || rawAppLanguage === "zh-CN" || rawAppLanguage === "hi"
            ? rawAppLanguage
            : DEFAULTS.app_language;
        var font = rawFont || DEFAULTS.font;
        var contentLayout = rawContentLayout || DEFAULTS.content_layout;
        var navbarStyle = rawNavbarStyle || DEFAULTS.navbar_style;
        var sidebarVariant = rawSidebarVariant || DEFAULTS.sidebar_variant;
        var sidebarCollapsible = rawSidebarCollapsible || DEFAULTS.sidebar_collapsible;

        root.classList.toggle("dark", resolvedMode === "dark");
        root.setAttribute("data-theme-mode", mode);
        root.setAttribute("data-theme-preset", preset);
        root.setAttribute("data-reduced-motion", reducedMotion);
        root.setAttribute("data-text-size", textSize);
        root.setAttribute("data-app-language", appLanguage);
        root.setAttribute("data-font", font);
        root.setAttribute("data-content-layout", contentLayout);
        root.setAttribute("data-navbar-style", navbarStyle);
        root.setAttribute("data-sidebar-variant", sidebarVariant);
        root.setAttribute("data-sidebar-collapsible", sidebarCollapsible);

        root.style.colorScheme = resolvedMode === "dark" ? "dark" : "light";
        root.lang = appLanguage;

      } catch (e) {
        console.warn("ThemeBootScript error:", e);
      }
    })();
  `;

  /* biome-ignore lint/security/noDangerouslySetInnerHtml: required for pre-hydration boot script */
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
