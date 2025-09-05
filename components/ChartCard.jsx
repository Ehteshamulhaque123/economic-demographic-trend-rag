"use client";
import { useEffect, useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
export default function ChartCard({ country }) {
  const [data, setData] = useState(null);
  const [fcst, setFcst] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  useEffect(() => {
    async function run() { setLoading(true); setErr(null);
      try {
        const r = await fetch(`/api/timeseries?country=${encodeURIComponent(country)}&series=inflation,currency,gdp,youth`, { cache: 'no-store' });
        let j;
        if (r.headers.get('content-type')?.includes('application/json')) {
          j = await r.json();
        } else {
          throw new Error('Response is not JSON');
        }
        if (j.error) throw new Error(j.error); setData(j);
        const resp = await fetch('/api/forecast', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ h: 8, series: j.series }) });
        let fj;
        if (resp.headers.get('content-type')?.includes('application/json')) {
          fj = await resp.json();
        } else {
          throw new Error('Forecast response is not JSON');
        }
        setFcst(fj.forecasts || {});
      } catch(e) { setErr(e.message); } finally { setLoading(false); } }
    run();
  }, [country]);
  const merged = useMemo(() => {
    if (!data) return [];
    const keys = ["inflation","currency","gdp","youth"]; const years = new Set();
    keys.forEach(s => (data.series[s]||[]).forEach(p => years.add(p.date)));
    keys.forEach(s => (fcst?.[s]?.forecast||[]).forEach(p => years.add(p.date)));
    const ys = Array.from(years).map(Number).sort((a,b)=>a-b).slice(-20).map(String);
    return ys.map(y => ({ date: y,
      "Inflation (actual)": data.series.inflation?.find(p => p.date === y)?.value ?? null,
      "Inflation (forecast)": fcst?.inflation?.forecast?.find(p => p.date === y)?.value ?? null,
      "Currency (actual)": data.series.currency?.find(p => p.date === y)?.value ?? null,
      "Currency (forecast)": fcst?.currency?.forecast?.find(p => p.date === y)?.value ?? null,
      "GDP growth (actual)": data.series.gdp?.find(p => p.date === y)?.value ?? null,
      "GDP growth (forecast)": fcst?.gdp?.forecast?.find(p => p.date === y)?.value ?? null,
      "Youth proxy (actual)": data.series.youth?.find(p => p.date === y)?.value ?? null,
      "Youth proxy (forecast)": fcst?.youth?.forecast?.find(p => p.date === y)?.value ?? null }));
  }, [data, fcst]);
  if (loading) return <div className="card p-6">Loading...</div>;
  if (err) return <div className="card p-6 text-red-400">Error: {err}</div>;
  if (!data) return null;
  const noData = Object.values(data.series || {}).every(arr => (arr||[]).length === 0);
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-2"><div><h2 className="text-xl font-semibold">{data.country}</h2><p className="text-xs opacity-70">ISO3: {data.iso3} • Currency: {data.currency}</p></div><div className="badge" /></div>
      {noData ? (<div className="text-sm opacity-80">No open data found for this country.</div>) : (
        <div className="h-[420px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={merged}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ec4899" opacity={0.5} />
              <XAxis dataKey="date" /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" />
              <Tooltip /><Legend />
              <Line type="monotone" dataKey="Inflation (actual)" yAxisId="left" dot={false} />
              <Line type="monotone" dataKey="Inflation (forecast)" yAxisId="left" dot={false} strokeDasharray="6 6" />
              <Line type="monotone" dataKey="GDP growth (actual)" yAxisId="left" dot={false} />
              <Line type="monotone" dataKey="GDP growth (forecast)" yAxisId="left" dot={false} strokeDasharray="6 6" />
              <Line type="monotone" dataKey="Currency (actual)" yAxisId="right" dot={false} />
              <Line type="monotone" dataKey="Currency (forecast)" yAxisId="right" dot={false} strokeDasharray="6 6" />
              <Line type="monotone" dataKey="Youth proxy (actual)" yAxisId="right" dot={false} />
              <Line type="monotone" dataKey="Youth proxy (forecast)" yAxisId="right" dot={false} strokeDasharray="6 6" />
            </LineChart>
          </ResponsiveContainer>
        </div>)}
      <p className="text-xs opacity-70 mt-3">Sources: World Bank; Frankfurter; Wikipedia. Youth outflow proxy = |net migration| × youth share 15–24.</p>
    </div>
  );
}
