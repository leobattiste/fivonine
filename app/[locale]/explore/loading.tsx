import { CardSkeleton } from "@/components/Campaign";
export default function Loading() {
  return (
    <div className="wrap page" style={{ gap: 20 }} aria-busy="true">
      <div className="explore-head"><div className="stack tight"><div className="sk sk-line" style={{ height: 36, width: "60%" }} /><div className="sk sk-line" style={{ width: "80%" }} /></div><div className="sk" style={{ height: 64, borderRadius: "22px 22px 22px 4px" }} /></div>
      <div className="row"><div className="sk" style={{ height: 42, width: 140, borderRadius: 999 }} /><div className="sk" style={{ height: 42, width: 140, borderRadius: 999 }} /></div>
      <div className="grid-cards">{Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}</div>
    </div>
  );
}
