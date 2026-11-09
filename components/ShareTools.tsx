"use client";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { platform } from "@/lib/platform-content";
import Icon from "./Icon";
export default function ShareTools({
  title,
  locale,
  path,
}: {
  title: string;
  locale: Locale;
  path?: string;
}) {
  const p = platform[locale];
  const [message, setMessage] = useState("");
  const url = () => new URL(path ?? location.pathname, location.origin).href;
  const share = (service: "whatsapp" | "facebook") => {
    const target =
      service === "whatsapp"
        ? `https://wa.me/?text=${encodeURIComponent(title + " " + url())}`
        : `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url())}`;
    window.open(target, "_blank", "noopener,noreferrer");
  };
  return (
    <div className="share-tools">
      <div className="share-tool-buttons">
        <button
          type="button"
          className="button secondary"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url());
              setMessage(p.copied);
            } catch {
              setMessage(p.copyFailed);
            }
          }}
        >
          <Icon name="external" />
          {p.link}
        </button>
        <button
          type="button"
          className="button secondary"
          onClick={() => share("whatsapp")}
        >
          {p.whatsapp}
          <Icon name="external" />
        </button>
        <button
          type="button"
          className="button secondary"
          onClick={() => share("facebook")}
        >
          {p.facebook}
          <Icon name="external" />
        </button>
      </div>
      <p className="hint" role="status">
        {message}
      </p>
    </div>
  );
}
