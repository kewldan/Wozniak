export const themeStorageKey = "wozniak-theme";
export const systemThemeQuery = "(prefers-color-scheme: dark)";

// Apply the saved or system theme before painting the page.
export const themeInitializationScript = `
  (() => {
    const root = document.documentElement;
    let theme;
    try {
      theme = localStorage.getItem(${JSON.stringify(themeStorageKey)});
    } catch {}
    if (theme === "light" || theme === "dark") {
      root.dataset.themePreference = theme;
    }
    const dark = theme === "dark" ||
      (theme !== "light" && matchMedia(${JSON.stringify(systemThemeQuery)}).matches);
    root.classList.toggle("dark", dark);
  })();
`;
