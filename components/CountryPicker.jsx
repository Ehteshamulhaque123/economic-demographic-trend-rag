"use client";
import { useEffect, useState } from "react";
const fallback = ["Bangladesh","India","Pakistan","Nepal","Sri Lanka","United States","United Kingdom","Australia","Canada","Germany","Japan","Nigeria","Brazil","South Africa"];
export default function CountryPicker({ value, onChange }) {
  const [q, setQ] = useState(value || "Bangladesh");
  const [suggestions, setSuggestions] = useState(fallback);
  useEffect(() => { onChange && onChange(q); }, []);
  useEffect(() => {
    const id = setTimeout(async () => {
      if (!q || q.length < 2) { setSuggestions(fallback); return; }
      try {
        const r = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(q)}?fields=name,cca3`);
        let arr;
        if (r.headers.get('content-type')?.includes('application/json')) {
          arr = await r.json();
        } else {
          throw new Error('Response is not JSON');
        }
        if (Array.isArray(arr)) setSuggestions(arr.slice(0,10).map(c => c.name.common));
      } catch { setSuggestions(fallback); }
    }, 250);
    return () => clearTimeout(id);
  }, [q]);
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2"><label className="text-sm opacity-80">Country</label><div className="badge" /></div>
      <input className="input" value={q} onChange={e=>{ setQ(e.target.value); onChange && onChange(e.target.value); }} placeholder="Type a country name..." />
      <div className="mt-2 grid grid-cols-2 gap-2">
        {suggestions.map(s => (<button key={s} onClick={()=>{ setQ(s); onChange && onChange(s); }} className="text-left text-xs px-3 py-2 rounded-xl border border-border hover:bg-white/10">{s}</button>))}
      </div>
    </div>
  );
}
