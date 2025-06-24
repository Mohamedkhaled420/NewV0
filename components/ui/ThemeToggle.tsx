"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);

  return (
    <button
      aria-label="Toggle dark mode"
      className="fixed top-4 right-4 z-50 rounded-full p-2 bg-glass-bg-silver glass-blur-md glass-shadow glass-border glass-radius text-xl transition-colors duration-300"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      style={{ minWidth: 40 }}
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
