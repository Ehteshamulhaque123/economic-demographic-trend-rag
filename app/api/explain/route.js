import { NextResponse } from 'next/server';
import { getCountryInfo } from '../_country';
import { load as loadCheerio } from 'cheerio';
import { chunkParagraphs, buildTfIdf, rank } from '../../../lib/rag_tfidf';

async function fetchTextFromWikipedia(title) {
  const headers = { 'User-Agent': 'economic-and-demographic-trend-with-rag/1.2 (https://example.com)' };
  try { const u=`https://en.wikipedia.org/api/rest_v1/page/plain/${encodeURIComponent(title)}`; const r=await fetch(u,{cache:'no-store',headers}); if(r.ok && r.headers.get('content-type')?.includes('text/plain')) return await r.text(); } catch {}
  try { const u=`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`; const r=await fetch(u,{cache:'no-store',headers}); if(r.ok && r.headers.get('content-type')?.includes('application/json')){ const j=await r.json(); return [j.extract||"", j.description||""].join("\n\n"); } } catch {}
  try { const u=`https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&prop=text&format=json&origin=*`; const r=await fetch(u,{cache:'no-store',headers}); if(r.ok && r.headers.get('content-type')?.includes('application/json')){ const j=await r.json(); const html=j?.parse?.text?.['*']||""; const $=loadCheerio(html); return $('p').map((_,el)=>$(el).text()).get().join("\n\n"); } } catch {}
  return "";
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country') || 'Bangladesh';
    const q = searchParams.get('q') || 'Why did inflation change recently?';
    const { name } = await getCountryInfo(country);
    const titles = [`Economy of ${name}`, `Inflation in ${name}`, `Demographics of ${name}`, `Migration in ${name}`, `Emigration from ${name}`, `Youth in ${name}`];
    const docs = [];
    for (const t of titles) {
      const text = await fetchTextFromWikipedia(t);
      if (text && text.length > 100) chunkParagraphs(text, t).forEach(c => docs.push(c));
    }
    if (!docs.length) return NextResponse.json({ answer: "No documents found.", passages: [], used: [] });
    const index = buildTfIdf(docs);
    const hits = rank(q, index, 8);
    const bullets = hits.map(h => `• ${h.text}`);
    const answer = bullets.join("\n\n");
    const passages = hits.map(h => ({ title: h.title, source: "Wikipedia", snippet: h.text.slice(0, 400) }));
    const used = Array.from(new Set(hits.map(h => h.title)));
    return NextResponse.json({ answer, passages, used });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
