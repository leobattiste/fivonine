import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-20 sm:px-8">
      <p className="wdth-tight text-d-1 font-extrabold text-rule">404</p>
      <h1 className="mt-6 text-d-3 font-semibold">This page isn't in the record.</h1>
      <p className="read mt-4">The link may be old, or the entry may have moved. Search for it or pick a decade.</p>
      <div className="mt-8 flex gap-2">
        <Link href="/explore" className="btn btn-solid">Search the record</Link>
        <Link href="/decades" className="btn btn-ghost">Browse decades</Link>
      </div>
    </div>
  );
}
