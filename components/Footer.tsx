import Link from "next/link";
import { editorial } from "@/lib/editorial";
import { t, type Locale } from "@/lib/i18n";
import { platform } from "@/lib/platform-content";
import Icon from "./Icon";
export default function Footer({ locale }: { locale: Locale }) {
  const d = t(locale),
    e = editorial[locale],
    p = platform[locale];
  const groups = [
    {
      name: e.discover,
      links: [
        ["explore", d.explore],
        ["causes", p.causes],
        ["resources", p.resources],
        ["dashboard", d.manage],
      ],
    },
    {
      name: e.platform,
      links: [
        ["about", d.about],
        ["how-it-works", d.how],
        ["pricing", e.fees],
      ],
    },
    {
      name: e.support,
      links: [
        ["help", d.help],
        ["contact", d.contact],
        ["safety", p.safety],
      ],
    },
  ];
  return (
    <footer className="footer">
      <div className="page footer-top">
        <div className="footer-statement">
          <p>{e.footer}</p>
          <Link className="text-link" href={`/${locale}/submit`}>
            {d.create}
            <Icon name="arrowRight" />
          </Link>
        </div>
        <nav className="footer-groups" aria-label={d.help}>
          {groups.map((group) => (
            <div key={group.name}>
              <span className="eyebrow">{group.name}</span>
              {group.links.map(([href, label]) => (
                <Link href={`/${locale}/${href}`} key={href}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>
      <div className="page footer-brand" aria-hidden="true">
        pote kole.
      </div>
      <div className="page footer-bottom">
        <small>{d.rights}</small>
        <nav aria-label={d.terms}>
          {[
            ["privacy", d.privacy],
            ["terms", d.terms],
            ["guidelines", d.guidelines],
            ["review", d.verification],
            ["donations", d.disclosures],
          ].map(([id, label]) => (
            <Link href={`/${locale}/legal#${id}`} key={id}>
              {label}
            </Link>
          ))}
        </nav>
        <p>{d.disclosure}</p>
      </div>
    </footer>
  );
}
