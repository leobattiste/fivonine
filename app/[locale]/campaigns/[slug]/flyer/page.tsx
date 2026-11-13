import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { SupportMethods } from "@/components/Support";
import { Wordmark } from "@/components/Brand";
import { PrintButton } from "@/components/Bits";
import { getCampaign } from "@/lib/data";
import { SITE_URL } from "@/lib/constants";
import { isLocale, t } from "@/lib/i18n";
export const metadata: Metadata = { robots: { index: false } };
export default async function Flyer({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getCampaign(slug);
  if (!data || data.campaign.status !== "live") notFound();
  const d = t(locale), url = `${SITE_URL}/${locale}/campaigns/${data.campaign.slug}`;
  const qr = await QRCode.toString(url, { type: "svg", margin: 0, color: { dark: "#1f503b", light: "#ffffff" } });
  return (
    <div className="wrap page flyer">
      <PrintButton label={d.support.print} />
      <div className="flyer-sheet">
        <p className="wordmark"><Wordmark /></p>
        <h1>{data.campaign.title}</h1>
        {data.campaign.beneficiary_name && <p className="lead">{d.campaign.for} {data.campaign.beneficiary_name}</p>}
        <div className="cols-2" style={{ alignItems: "start" }}>
          <div>
            <div className="qr" dangerouslySetInnerHTML={{ __html: qr }} />
            <p className="small">{d.flyer.scan}</p>
            <p className="small flyer-url">{url.replace(/^https?:\/\//, "")}</p>
          </div>
          <div>
            <h2>{d.support.title}</h2>
            <SupportMethods methods={data.methods} locale={locale} compact />
          </div>
        </div>
      </div>
    </div>
  );
}
