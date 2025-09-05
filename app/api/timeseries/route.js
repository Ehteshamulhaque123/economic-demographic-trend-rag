import { NextResponse } from 'next/server';
import { getCountryInfo } from '../_country';
const WB = 'https://api.worldbank.org/v2';
async function wb(iso3, code) {
  const url = `${WB}/country/${iso3}/indicator/${code}?format=json&per_page=2000`;
  const r = await fetch(url, { cache: 'no-store' });
  let j;
  if (r.headers.get('content-type')?.includes('application/json')) {
    j = await r.json();
  } else {
    return [];
  }
  const arr = j?.[1] || [];
  return arr.filter(d => d.value != null).map(d => ({ date: d.date, value: d.value })).sort((a,b)=>a.date>b.date?1:-1);
}
async function fxAnnual(cur) {
  try {
    const start = '1999-01-01', end = new Date().toISOString().slice(0,10);
    const u = `https://api.frankfurter.app/${start}..${end}?from=${cur}&to=USD`;
    const r = await fetch(u, { cache: 'no-store' });
    if (!r.ok) throw new Error('fx fetch failed');
    const j = await r.json();
    const byYear = {};
    Object.entries(j.rates || {}).forEach(([d, o]) => {
      const y = d.slice(0,4), v = o['USD'];
      if (!byYear[y]) byYear[y] = { sum:0, n:0 };
      byYear[y].sum += v; byYear[y].n += 1;
    });
    return Object.entries(byYear).map(([y, {sum,n}]) => ({ date: y, value: sum/n })).sort((a,b)=>a.date>b.date?1:-1);
  } catch { return []; }
}
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country') || 'Bangladesh';
    const s = (searchParams.get('series') || 'inflation,currency,gdp,youth').split(',').map(x=>x.trim());
    const { iso3, currency, name } = await getCountryInfo(country);
    const tasks = {};
    if (s.includes('inflation')) tasks.inflation = wb(iso3, 'FP.CPI.TOTL.ZG');
    if (s.includes('gdp')) tasks.gdp = wb(iso3, 'NY.GDP.MKTP.KD.ZG');
    if (s.includes('youth')) { tasks.netmig = wb(iso3, 'SM.POP.NETM'); tasks.yshare = wb(iso3, 'SP.POP.1524.TO.ZS'); }
    if (s.includes('currency')) tasks.currency = fxAnnual(currency);
    const res = {}; for (const k of Object.keys(tasks)) res[k] = await tasks[k];
    if (res.netmig && res.yshare) {
      const ys = {}; res.yshare.forEach(r => ys[r.date] = r.value/100);
      const out = res.netmig.filter(r => ys[r.date]!=null).map(r => ({ date: r.date, value: Math.abs(r.value)*ys[r.date] }));
      res.youth = out.sort((a,b)=>a.date>b.date?1:-1); delete res.netmig; delete res.yshare;
    }
    return NextResponse.json({ country: name, iso3, currency, series: res });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
