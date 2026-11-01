import { redirect } from "next/navigation";

/** Former Explore search URLs continue to work, but search now has one dedicated page. */
export default async function ExploreRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const value = (key: string) => typeof params[key] === "string" ? params[key] as string : "";
  const query = value("q") || value("category") || value("period") || value("country");
  redirect("/search" + (query ? "?q=" + encodeURIComponent(query) : ""));
}
