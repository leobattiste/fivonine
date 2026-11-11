"use client";
import { coverPath } from "@/lib/cover";
import { getBrowserClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import Image from "next/image";
export default function Media({
  src,
  alt,
  category = "community",
  priority = false,
}: {
  src: string;
  alt: string;
  category?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  const [signed, setSigned] = useState<{ source: string; url: string } | null>(
    null,
  );
  const path = coverPath(src);
  useEffect(() => {
    if (!path) return;
    let active = true;
    const db = getBrowserClient();
    if (!db) return;
    void db.auth
      .getUser()
      .then(async ({ data: { user } }) => {
        if (!user) return;
        const result = await db.storage
          .from("covers")
          .createSignedUrl(path, 300);
        if (active && result.data?.signedUrl) {
          setSigned({ source: src, url: result.data.signedUrl });
          setFailed(null);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [path, src]);
  const display =
    signed?.source === src
      ? signed.url
      : path
        ? `/api/cover?path=${encodeURIComponent(path)}`
        : src;
  return (
    <div className={`campaign-cover cover-${category}`}>
      {src && failed !== src ? (
        src.startsWith("/photos/") ? (
          <Image
            src={display}
            alt={alt}
            fill
            sizes="(max-width: 520px) 100vw, (max-width: 799px) 50vw, 50vw"
            priority={priority}
            onError={() => setFailed(src)}
          />
        ) : (
          <img
            src={display}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            decoding="async"
            onError={() => setFailed(src)}
            ref={(e) => {
              if (e?.complete && !e.naturalWidth) setFailed(src);
            }}
          />
        )
      ) : (
        <div className="cover-fallback" role="img" aria-label={alt}>
          <Icon name="heart" />
          <span>Pote Kole.</span>
        </div>
      )}
    </div>
  );
}
