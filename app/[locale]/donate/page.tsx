import { redirect } from "next/navigation";
export default async function Donate({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string>> }) {
  const { locale } = await params, sp = new URLSearchParams(await searchParams);
  redirect(`/${locale}/explore${sp.toString() ? `?${sp}` : ""}`);
}
