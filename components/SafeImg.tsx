"use client";
import { useEffect, useRef, useState } from "react";
import Icon, { type IconName } from "./Icon";

/** An image that turns into a neutral placeholder when the file is missing or fails to load. */
export default function SafeImg({ icon = "image", className, ...img }: React.ImgHTMLAttributes<HTMLImageElement> & { icon?: IconName }) {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(!img.src);
  // An image can fail before React hydrates, so onError never fires: check once on mount.
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);
  if (failed) return <span className={`img-fallback ${className ?? ""}`} aria-hidden="true"><Icon name={icon} size={28} /></span>;
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img ref={ref} className={className} {...img} onError={() => setFailed(true)} />;
}
