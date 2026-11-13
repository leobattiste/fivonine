"use client";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import type { Crop } from "@/lib/upload";

/** Frame a photo at 4:3: drag to position, slider or arrow keys to adjust. Returns the crop as fractions of the source. */
export default function Cropper({ file, labels, onUse, onCancel, busy }: { file: File; labels: { title: string; hint: string; zoom: string; use: string; cancel: string; uploading: string }; onUse: (crop: Crop) => void; onCancel: () => void; busy: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState("");
  const [nat, setNat] = useState<[number, number] | null>(null);
  const [size, setSize] = useState<[number, number]>([0, 0]);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState<[number, number]>([0.5, 0.5]);
  const drag = useRef<{ x: number; y: number; p: [number, number] } | null>(null);

  useEffect(() => {
    const u = URL.createObjectURL(file);
    setSrc(u); setNat(null); setZoom(1); setPos([0.5, 0.5]);
    const img = new Image();
    img.onload = () => setNat([img.naturalWidth, img.naturalHeight]);
    img.src = u;
    return () => URL.revokeObjectURL(u);
  }, [file]);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize([el.clientWidth, el.clientHeight]));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [W, H] = size;
  const s = nat ? Math.max(W / nat[0], H / nat[1]) * zoom : 1;
  const iw = nat ? nat[0] * s : 0, ih = nat ? nat[1] * s : 0;
  const left = -(iw - W) * pos[0], top = -(ih - H) * pos[1];
  const move = (dx: number, dy: number, from: [number, number]) => {
    const cx = iw > W ? Math.min(1, Math.max(0, from[0] - dx / (iw - W))) : 0.5;
    const cy = ih > H ? Math.min(1, Math.max(0, from[1] - dy / (ih - H))) : 0.5;
    setPos([cx, cy]);
  };
  const use = () => {
    if (!nat) return;
    onUse({ x: -left / iw, y: -top / ih, w: W / iw, h: H / ih });
  };
  return (
    <div className="stack" role="group" aria-label={labels.title}>
      <div className="stack tight"><strong>{labels.title}</strong><p className="hint">{labels.hint}</p></div>
      <div
        ref={box} className="cropper" tabIndex={0} aria-label={labels.hint}
        onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture?.(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, p: pos }; }}
        onPointerMove={(e) => { if (drag.current) move(e.clientX - drag.current.x, e.clientY - drag.current.y, drag.current.p); }}
        onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}
        onKeyDown={(e) => {
          const step = 16, k: Record<string, [number, number]> = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
          if (k[e.key]) { e.preventDefault(); move(k[e.key][0], k[e.key][1], pos); }
          if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(3, z + 0.1));
          if (e.key === "-") setZoom((z) => Math.max(1, z - 0.1));
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {src && nat && <img src={src} alt="" style={{ width: iw, height: ih, left, top }} draggable={false} />}
        <span className="grid" aria-hidden="true" />
      </div>
      <label className="zoom"><Icon name="image" size={18} /><span className="sr">{labels.zoom}</span><input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} /><Icon name="image" size={24} /></label>
      <div className="row">
        <button type="button" className="btn primary" onClick={use} disabled={busy || !nat} aria-busy={busy}>{busy ? <><Icon name="spinner" size={18} />{labels.uploading}</> : <><Icon name="check" size={18} />{labels.use}</>}</button>
        <button type="button" className="btn quiet" onClick={onCancel} disabled={busy}>{labels.cancel}</button>
      </div>
    </div>
  );
}
