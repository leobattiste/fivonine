import Link from "next/link";
import { DataSaver } from "./Bits";
import { Wordmark } from "./Brand";
import { t, type Locale } from "@/lib/i18n";
export default function Footer({ locale, lite }: { locale: Locale; lite: boolean }) {
  const d = t(locale), x = d.x;
  const l = (href: string, label: string) => <li><Link href={`/${locale}${href}`}>{label}</Link></li>;
  return (
    <footer className="site-footer no-print">
      <div className="wrap footer-grid">
        <div className="brand-col">
          <Link className="wordmark" href={`/${locale}`} aria-label="yon kout men"><Wordmark /></Link>
          <p className="muted measure">{x.brand.tagline}</p>
          <div><DataSaver locale={locale} on={lite} /></div>
        </div>
        <nav aria-label={d.footer.platform}>
          <h2>{d.footer.platform}</h2>
          <ul>{l("/explore", x.nav.explore)}{l("/create", x.nav.share)}{l("/how-it-works", x.nav.how)}{l("/about", x.nav.about)}{l("/transparency", d.footer.transparency)}</ul>
        </nav>
        <nav aria-label={d.footer.support}>
          <h2>{d.footer.support}</h2>
          <ul>{l("/help", d.footer.help)}{l("/resources", x.pages.resources.title)}{l("/safety", d.footer.safety)}{l("/contact", d.footer.contact)}{l("/report", d.footer.report)}</ul>
        </nav>
        <nav aria-label={d.footer.trust}>
          <h2>{d.footer.trust}</h2>
          <ul>{l("/guidelines", d.footer.guidelines)}{l("/terms", d.footer.terms)}{l("/privacy", d.footer.privacy)}</ul>
        </nav>
      </div>
      <div className="wrap footer-base">
        <p>{d.footer.disclaimer}</p>
        <p>© 2026 yon kout men</p>
      </div>
    </footer>
  );
}
