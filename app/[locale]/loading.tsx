export default function Loading() {
  return (
    <div className="wrap page" style={{ gap: 20 }} aria-busy="true" aria-live="polite">
      <div className="sk sk-line" style={{ height: 36, width: "55%" }} />
      <div className="sk sk-line" style={{ width: "80%" }} />
      <div className="sk" style={{ height: 220, borderRadius: 16 }} />
      <div className="sk sk-line" style={{ width: "70%" }} />
      <div className="sk sk-line" style={{ width: "60%" }} />
    </div>
  );
}
