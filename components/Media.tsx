"use client";
import { useState } from "react";
import Icon from "./Icon";
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
      ) : (
        <div className="cover-fallback" role="img" aria-label={alt}>
          <Icon name="heart" />
          <span>fivonine.</span>
        </div>
      )}
    </div>
  );
}
