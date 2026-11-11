import { ContentPage, contentMeta } from "@/components/Content";
export const generateMetadata = contentMeta("privacy");
export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  return <ContentPage params={params} page="privacy" />;
}
