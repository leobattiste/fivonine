"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
type TurnstileAPI = {
  render: (element: HTMLElement, options: Record<string, string>) => string;
  remove: (id: string) => void;
};
export default function Turnstile() {
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const element = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!ready || !key || !element.current) return;
    const api = (window as Window & { turnstile?: TurnstileAPI }).turnstile;
    if (!api) return;
    const id = api.render(element.current, {
      sitekey: key,
      appearance: "interaction-only",
      size: "flexible",
    });
    return () => api.remove(id);
  }, [ready, key]);
  if (!key) return null;
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />
      <div ref={element} />
    </>
  );
}
