(() => {
  const PERSISTENCE = {
    theme_mode: "client-cookie",
    theme_preset: "client-cookie",
    reduced_motion: "client-cookie",
    text_size: "client-cookie",
    app_language: "client-cookie",
    font: "client-cookie",
    content_layout: "client-cookie",
    navbar_style: "client-cookie",
    sidebar_variant: "client-cookie",
    sidebar_collapsible: "client-cookie",
  };
  const DEFAULTS = {
    theme_mode: "light",
    theme_preset: "default",
    reduced_motion: "no-preference",
    text_size: "16",
    app_language: "en",
    font: "inter",
    content_layout: "centered",
    navbar_style: "sticky",
    sidebar_variant: "inset",
    sidebar_collapsible: "icon",
  };

  function readCookie(name) {
    const match = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split("=")[1]) : null;
  }

  function readLocal(name) {
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  }

  function readPreference(key, fallback) {
    const mode = PERSISTENCE[key];
    let value = null;
    if (mode === "localStorage") value = readLocal(key);
    if (!value && (mode === "client-cookie" || mode === "server-cookie")) value = readCookie(key);
    if (!value || typeof value !== "string") return fallback;
    return value;
  }

  try {
    const root = document.documentElement;

    const rawMode = readPreference("theme_mode", DEFAULTS.theme_mode);
    const rawPreset = readPreference("theme_preset", DEFAULTS.theme_preset);
    const rawReducedMotion = readPreference("reduced_motion", DEFAULTS.reduced_motion);
    const rawTextSize = readPreference("text_size", DEFAULTS.text_size);
    const rawAppLanguage = readPreference("app_language", DEFAULTS.app_language);
    const rawFont = readPreference("font", DEFAULTS.font);
    const rawContentLayout = readPreference("content_layout", DEFAULTS.content_layout);
    const rawNavbarStyle = readPreference("navbar_style", DEFAULTS.navbar_style);
    const rawSidebarVariant = readPreference("sidebar_variant", DEFAULTS.sidebar_variant);
    const rawSidebarCollapsible = readPreference("sidebar_collapsible", DEFAULTS.sidebar_collapsible);

    const isValidMode = rawMode === "dark" || rawMode === "light" || rawMode === "system";
    const mode = isValidMode ? rawMode : DEFAULTS.theme_mode;
    const resolvedMode =
      mode === "system" && window.matchMedia
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : mode;
    const preset = rawPreset || DEFAULTS.theme_preset;
    const reducedMotion = rawReducedMotion === "reduce" ? "reduce" : DEFAULTS.reduced_motion;
    const textSize =
      rawTextSize === "12" || rawTextSize === "14" || rawTextSize === "16" ? rawTextSize : DEFAULTS.text_size;
    const appLanguage =
      rawAppLanguage === "es" || rawAppLanguage === "fr" || rawAppLanguage === "zh-CN" || rawAppLanguage === "hi"
        ? rawAppLanguage
        : DEFAULTS.app_language;
    const font = rawFont || DEFAULTS.font;
    const contentLayout = rawContentLayout || DEFAULTS.content_layout;
    const navbarStyle = rawNavbarStyle || DEFAULTS.navbar_style;
    const sidebarVariant = rawSidebarVariant || DEFAULTS.sidebar_variant;
    const sidebarCollapsible = rawSidebarCollapsible || DEFAULTS.sidebar_collapsible;

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
