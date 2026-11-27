"use client";
import { useParams } from "next/navigation";
import Icon from "@/components/Icon";
import { isLocale, t } from "@/lib/i18n";
export default function ErrorPage({ retry }: { retry: () => void }) {
  const p = useParams<{ locale: string }>();
  const d = t(isLocale(p.locale) ? p.locale : "fr").common;
  return <div className="wrap page"><div className="empty" role="alert"><span className="icon-box"><Icon name="alert" size={24} /></span><h1>{d.errorTitle}</h1><p>{d.error}</p><button className="btn primary" onClick={retry}>{d.retry}</button></div></div>;
}
