"use client";
import { useState } from "react";
import Icon from "./Icon";
import { t, type Locale } from "@/lib/i18n";
export default function ShareButton({
  title,
  locale,
}: {
  title: string;
  locale: Locale;
}) {
  const [copied, setCopied] = useState(false);
  const d = t(locale);
  return (
    <>
      <button
        className="button secondary"
        onClick={async () => {
          try {
            if (navigator.share)
              await navigator.share({ title, url: location.href });
            else {
              await navigator.clipboard.writeText(location.href);
              setCopied(true);
            }
          } catch {
            /* User may cancel native sharing. */
          }
        }}
      >
        <Icon name="share" />
        {copied ? d.copied : d.share}
      </button>
      <span className="sr-only" role="status">
        {copied ? d.copied : ""}
      </span>
    </>
  );
}
