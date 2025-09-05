"use client";
import { useState } from "react";
import CountryPicker from "../components/CountryPicker";
import ChartCard from "../components/ChartCard";
import RagPanel from "../components/RagPanel";
export default function Page() {
  const [country, setCountry] = useState("Bangladesh");
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="card p-5 flex items-center justify-between">
          <div><h1 className="text-3xl font-bold">Economic and Demographic Trend with RAG</h1><p className="opacity-80">Inflation • Currency • GDP • Youth outflow (proxy) — with forecasts & Retrieval-Augmented Generation (RAG)</p></div>
          <div className="btn">Open APIs • No Keys</div>
        </div>
      </header>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <CountryPicker value={country} onChange={setCountry} />
          <div className="card p-4">
            <h3 className="font-semibold mb-2">Legend</h3>
            <ul className="text-sm opacity-90 list-disc list-inside space-y-1">
              <li><span className="font-medium">Solid lines</span>: actual values</li>
              <li><span className="font-medium">Dashed lines</span>: 8-year forecasts</li>
              <li>Right axis: Currency & Youth proxy</li>
            </ul>
          </div>
          <RagPanel country={country} />
        </div>
        <div className="md:col-span-2"><ChartCard country={country} /></div>
      </div>
      <footer className="mt-10 text-center text-xs opacity-70">World Bank • Frankfurter • Wikipedia</footer>
    </main>
  );
}
