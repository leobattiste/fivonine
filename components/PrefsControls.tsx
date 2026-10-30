"use client";
import L from "@/components/L";
import { usePrefs } from "@/components/Prefs";

function Row({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] items-center gap-3">
      <span className="text-sm text-dim">{label}</span>
      <div role="group" className="grid grid-cols-2 gap-1 rounded-full border border-rule p-1">{children}</div>
    </div>
  );
}
function Opt({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={on}
      className={`w-full rounded-full px-3 py-1.5 text-center text-sm font-medium ${on ? "bg-fg text-base" : "text-dim hover:text-fg"}`}>
      {children}
    </button>
  );
}

/** Appearance and language, as two switches with equal-width buttons. */
export default function PrefsControls() {
  const { theme, lang, setTheme, setLang } = usePrefs();
  return (
    <div className="space-y-3">
      <Row label={<L en="Appearance" fr="Apparence" />}>
        <Opt on={theme === "light"} onClick={() => setTheme("light")}><L en="Light" fr="Clair" /></Opt>
        <Opt on={theme === "dark"} onClick={() => setTheme("dark")}><L en="Dark" fr="Sombre" /></Opt>
      </Row>
      <Row label={<L en="Language" fr="Langue" />}>
        <Opt on={lang === "en"} onClick={() => setLang("en")}>English</Opt>
        <Opt on={lang === "fr"} onClick={() => setLang("fr")}>Français</Opt>
      </Row>
    </div>
  );
}
