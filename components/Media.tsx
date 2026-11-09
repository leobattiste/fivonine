"use client";
import { useState } from "react";
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
  return (
    <div className={`campaign-cover cover-${category}`}>
      {src && failed !== src ? (
        src.startsWith("/photos/") ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 520px) 100vw, (max-width: 799px) 50vw, 50vw"
            priority={priority}
            onError={() => setFailed(src)}
          />
        ) : (
          <img
            src={src}
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
          <span>fivonine.</span>
        </div>
      )}
    </div>
  );
}
