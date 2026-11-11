import Link from "next/link";
import { DataSaver } from "./Bits";
import { t, type Locale } from "@/lib/i18n";
export default function Footer({ locale, lite }: { locale: Locale; lite: boolean }) {
  const d = t(locale);
  const l = (href: string, label: string) => <li><Link href={`/${locale}${href}`}>{label}</Link></li>;
  return (
    <footer className="site-footer no-print">
      <div className="wrap footer-grid">
        <div>
          <p className="wordmark">fivonine</p>
          <p className="muted">{d.footer.tagline}</p>
          <DataSaver locale={locale} on={lite} />
        </div>
        <nav aria-label={d.footer.platform}>
          <h2>{d.footer.platform}</h2>
          <ul>{l("/donate", d.nav.donate)}{l("/create", d.nav.create)}{l("/how-it-works", d.nav.how)}{l("/about", d.nav.about)}{l("/transparency", d.footer.transparency)}</ul>
        </nav>
        <nav aria-label={d.footer.trust}>
          <h2>{d.footer.trust}</h2>
          <ul>{l("/safety", d.footer.safety)}{l("/guidelines", d.footer.guidelines)}{l("/terms", d.footer.terms)}{l("/privacy", d.footer.privacy)}</ul>
        </nav>
        <nav aria-label={d.footer.support}>
          <h2>{d.footer.support}</h2>
          <ul>{l("/help", d.footer.help)}{l("/contact", d.footer.contact)}{l("/report", d.footer.report)}</ul>
        </nav>
      </div>
      <div className="wrap footer-base">
        <p>{d.footer.disclaimer}</p>
        <p>© 2026 Fivonine</p>
      </div>
    </footer>
  );
}
