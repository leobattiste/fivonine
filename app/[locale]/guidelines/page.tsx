import { ContentPage, contentMeta } from "@/components/Content";
export const generateMetadata = contentMeta("guidelines");
export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  return <ContentPage params={params} page="guidelines" />;
}
