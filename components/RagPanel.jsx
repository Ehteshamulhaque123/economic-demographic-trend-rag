"use client";
import { useEffect, useState } from "react";
export default function RagPanel({ country }) {
  const [q, setQ] = useState("Why did inflation change recently?");
  const [ans, setAns] = useState("");
  const [passages, setPassages] = useState([]);
  const [loading, setLoading] = useState(false);
  async function run() {
    setLoading(true);
    try {
      const res = await fetch(`/api/explain?country=${encodeURIComponent(country)}&q=${encodeURIComponent(q)}`);
      let j;
      if (res.headers.get('content-type')?.includes('application/json')) {
        j = await res.json();
      } else {
        throw new Error('Response is not JSON');
      }
      setAns(j.answer || "No answer."); setPassages(j.passages || []);
    } catch(e) { setAns("Failed to retrieve insights."); setPassages([]); }
    finally { setLoading(false); }
  }
  useEffect(()=>{ run(); }, [country]);
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2"><h3 className="font-semibold">Insights (RAG)</h3><div className="badge" /></div>
      <div className="flex gap-2">
        <input className="input flex-1" value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask about inflation, GDP, FX, youth migration..." />
        <button onClick={run} className="btn">Search</button>
      </div>
      <div className="mt-3 text-sm whitespace-pre-wrap">{loading ? "Searching..." : ans}</div>
      {passages?.length > 0 && (
        <div className="mt-3 space-y-2">
          {passages.map((p,i)=> (
            <div key={i} className="text-xs opacity-80 p-3 rounded-xl border border-border">
              <div className="mb-1">Source: {p.title} — {p.source}</div>
              {p.snippet}...
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
