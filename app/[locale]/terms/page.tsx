import { ContentPage, contentMeta } from "@/components/Content";
export const generateMetadata = contentMeta("terms");
export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  return <ContentPage params={params} page="terms" />;
}
