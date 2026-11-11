"use client";
import { useEffect, useRef, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import { coverReference } from "@/lib/cover";
import { editorial } from "@/lib/editorial";
import type { Locale } from "@/lib/i18n";
import Media from "./Media";
import Icon from "./Icon";
export default function PhotoUpload({
  locale,
  initial = "",
  enabled,
}: {
  locale: Locale;
  initial?: string;
  enabled: boolean;
}) {
  const e = editorial[locale],
    hidden = useRef<HTMLInputElement>(null),
    canvas = useRef<HTMLCanvasElement>(null),
    image = useRef<HTMLImageElement | null>(null);
  const [url, setUrl] = useState(initial),
    [source, setSource] = useState(""),
    [zoom, setZoom] = useState(1),
    [position, setPosition] = useState(50),
    [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    const field = hidden.current;
    if (!field) return;
    const restore = () => setUrl(field.value);
    field.addEventListener("input", restore);
    return () => field.removeEventListener("input", restore);
  }, []);
  useEffect(() => {
    if (!source) return;
    const photo = new Image();
    let active = true;
    photo.onload = () => {
      if (active) {
        image.current = photo;
        setReady(true);
      }
    };
    photo.onerror = () => {
      if (active) setError(e.uploadError);
    };
    photo.src = source;
    return () => {
      active = false;
      URL.revokeObjectURL(source);
    };
  }, [source, e.uploadError]);
  useEffect(() => {
    const c = canvas.current,
      p = image.current;
    if (!c || !p || !ready) return;
    const scale = Math.max(c.width / p.width, c.height / p.height) * zoom,
      sw = c.width / scale,
      sh = c.height / scale;
    const ctx = c.getContext("2d");
    ctx?.clearRect(0, 0, c.width, c.height);
    ctx?.drawImage(
      p,
      (p.width - sw) / 2,
      ((p.height - sh) * position) / 100,
      sw,
      sh,
      0,
      0,
      c.width,
      c.height,
    );
  }, [ready, zoom, position, source]);
  async function upload() {
    if (!canvas.current || !ready) return;
    setBusy(true);
    setError("");
    try {
      const blob = await new Promise<Blob | null>((r) =>
        canvas.current!.toBlob(r, "image/webp", 0.86),
      );
      const db = getBrowserClient();
      if (!db || !blob) throw Error();
      const {
        data: { user },
      } = await db.auth.getUser();
      if (!user) throw Error();
      const path = `${user.id}/${crypto.randomUUID()}.webp`;
      const result = await db.storage.from("covers").upload(path, blob, {
        contentType: "image/webp",
        cacheControl: "31536000",
        upsert: false,
      });
      if (result.error) throw result.error;
      const photo = coverReference(path);
      setUrl(photo);
      setSource("");
      setReady(false);
      const field =
        document.querySelector<HTMLInputElement>('[name="photo_url"]');
      if (field) {
        field.value = photo;
        field.dispatchEvent(new Event("input", { bubbles: true }));
      }
    } catch {
      setError(e.uploadError);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="photo-upload">
      <input ref={hidden} type="hidden" name="photo_url" value={url} />
      {url && !source && <Media src={url} alt={e.upload} />}
      <label>
        <Icon name="content" />
        <span>{e.upload}</span>
        <small>{e.uploadHint}</small>
        <input
          className="photo-file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={!enabled || busy}
          onChange={(event) => {
            const f = event.target.files?.[0];
            if (!f) return;
            if (
              !["image/jpeg", "image/png", "image/webp"].includes(f.type) ||
              f.size > 8 * 1024 * 1024
            ) {
              setError(e.uploadError);
              return;
            }
            setReady(false);
            setError("");
            setZoom(1);
            setPosition(50);
            setSource(URL.createObjectURL(f));
          }}
        />
      </label>
      {source && (
        <div className="photo-crop-controls">
          <span>{e.crop}</span>
          <canvas
            ref={canvas}
            className="photo-crop-window"
            width={1080}
            height={810}
            aria-label={e.crop}
          />
          <label>
            {e.zoom}
            <input
              type="range"
              min="1"
              max="3"
              step=".05"
              value={zoom}
              onChange={(ev) => setZoom(Number(ev.target.value))}
            />
          </label>
          <label>
            {e.position}
            <input
              type="range"
              min="0"
              max="100"
              value={position}
              onChange={(ev) => setPosition(Number(ev.target.value))}
            />
          </label>
          <button
            type="button"
            className="button secondary"
            disabled={!ready || busy}
            onClick={upload}
          >
            {busy ? e.uploadBusy : e.uploadSave}
          </button>
        </div>
      )}
      <details>
        <summary>{e.photoLink}</summary>
        <label className="field">
          <span className="sr-only">{e.photoLink}</span>
          <input
            type="url"
            value={url}
            maxLength={1000}
            disabled={!enabled || busy}
            placeholder="https://"
            onChange={(ev) => {
              setUrl(ev.target.value);
              const field = ev.currentTarget
                .closest(".photo-upload")
                ?.querySelector<HTMLInputElement>('input[name="photo_url"]');
              if (field) field.value = ev.target.value;
            }}
          />
        </label>
      </details>
      <small>{e.photoPublic}</small>
      {error && (
        <p className="notice error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
