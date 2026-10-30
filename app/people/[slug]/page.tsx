import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PersonDetail from "@/components/PersonDetail";
import { getContent } from "@/lib/data";

export const revalidate = 3600;

export async function generateStaticParams() {
  const c = await getContent();
  return c.people.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getContent()).people.find((x) => x.slug === slug);
  return p ? { title: p.name, description: p.bio } : {};
}

export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getContent();
  const p = c.people.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <article className="mx-auto max-w-[1240px] px-5 pt-8 sm:px-8">
      <PersonDetail p={p} c={c} />
    </article>
  );
}
