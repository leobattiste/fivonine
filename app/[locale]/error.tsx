"use client";
import Recovery from "@/components/Recovery";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <Recovery reset={reset} />;
}
