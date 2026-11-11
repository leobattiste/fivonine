import { ContentPage, contentMeta } from "@/components/Content";
export const generateMetadata = contentMeta("safety");
export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  return <ContentPage params={params} page="safety" />;
}
