"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const storageKey = "ndegwa-theme";

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));
  }, []);

  function toggleTheme() {
    const nextIsLight = !isLight;
    document.documentElement.classList.toggle("light", nextIsLight);
    document.documentElement.classList.toggle("dark", !nextIsLight);
    localStorage.setItem(storageKey, nextIsLight ? "light" : "dark");
    setIsLight(nextIsLight);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors"
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      title={`Switch to ${isLight ? "dark" : "light"} mode`}
    >
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
