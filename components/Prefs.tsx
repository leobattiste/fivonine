"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export type Lang = "en" | "fr";

const Ctx = createContext<{ theme: Theme; lang: Lang; setTheme: (t: Theme) => void; setLang: (l: Lang) => void }>({
  theme: "light", lang: "en", setTheme: () => {}, setLang: () => {},
});

/** Holds the reader's theme and language. A script in the page head applies them before first paint. */
export default function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const root = document.documentElement;
    setThemeState(root.dataset.theme === "dark" ? "dark" : "light");
    setLangState(root.lang === "fr" ? "fr" : "en");
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem("fv-theme", t); } catch {}
  }, []);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    document.documentElement.lang = l;
    try { localStorage.setItem("fv-lang", l); } catch {}
  }, []);

  return <Ctx.Provider value={{ theme, lang, setTheme, setLang }}>{children}</Ctx.Provider>;
}

export const usePrefs = () => useContext(Ctx);

/** Picks the right string for attributes such as placeholders and aria-labels. */
export function useT() {
  const { lang } = usePrefs();
  return (en: string, fr?: string) => (lang === "fr" && fr ? fr : en);
}

/** Runs before first paint so the page never flashes the wrong theme or language. */
export const PREFS_SCRIPT = `try{var d=document.documentElement,t=localStorage.getItem('fv-theme'),l=localStorage.getItem('fv-lang');if(t==='dark')d.dataset.theme='dark';if(l==='fr')d.lang='fr';}catch(e){}`;
