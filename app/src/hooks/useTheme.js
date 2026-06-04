import { useEffect, useState } from "react";

const STORAGE_KEY = "civiqa.theme";

export function getTheme() {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function setTheme(next) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", next);
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event("civiqa-theme-change"));
}

export function toggleTheme() {
  setTheme(getTheme() === "dark" ? "light" : "dark");
}

/* Reactive theme value: updates on toggle (event) and on any data-theme mutation. */
export function useTheme() {
  const [theme, setThemeState] = useState(getTheme);

  useEffect(() => {
    const sync = () => setThemeState(getTheme());
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    window.addEventListener("civiqa-theme-change", sync);
    return () => {
      observer.disconnect();
      window.removeEventListener("civiqa-theme-change", sync);
    };
  }, []);

  return theme;
}
