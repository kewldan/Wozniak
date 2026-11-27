"use client";

import { Clock3, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { formatUtcClock } from "@/lib/format-monitoring";
import { systemThemeQuery, themeStorageKey } from "@/lib/theme";

export function UtcClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      setTime(formatUtcClock(new Date()));
      timer = setTimeout(tick, 60_000 - (Date.now() % 60_000));
    }

    tick();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      title="Текущее время в UTC"
      className="inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium whitespace-nowrap tabular-nums sm:gap-2"
    >
      <Clock3 aria-hidden="true" className="text-muted-foreground size-4" />
      <time dateTime={time || undefined}>{time || "--:--"} UTC</time>
    </div>
  );
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const systemTheme = window.matchMedia(systemThemeQuery);
    setDark(root.classList.contains("dark"));

    function syncSystemTheme(event: MediaQueryListEvent) {
      if (!root.dataset.themePreference) {
        root.classList.toggle("dark", event.matches);
        setDark(event.matches);
      }
    }

    systemTheme.addEventListener("change", syncSystemTheme);
    return () => systemTheme.removeEventListener("change", syncSystemTheme);
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    const nextDark = !root.classList.contains("dark");
    const nextTheme = nextDark ? "dark" : "light";

    root.classList.toggle("dark", nextDark);
    root.dataset.themePreference = nextTheme;
    setDark(nextDark);
    try {
      localStorage.setItem(themeStorageKey, nextTheme);
    } catch {
      // The current page can still switch themes when storage is unavailable.
    }
  }

  return (
    <button
      type="button"
      aria-label="Тёмная тема"
      aria-pressed={dark}
      title={dark ? "Включить светлую тему" : "Включить тёмную тему"}
      className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-ring inline-grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg border focus-visible:outline-2 focus-visible:outline-offset-2"
      onClick={toggleTheme}
    >
      <Moon aria-hidden="true" className="size-4 dark:hidden" />
      <Sun aria-hidden="true" className="hidden size-4 dark:block" />
    </button>
  );
}
