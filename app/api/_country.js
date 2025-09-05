export async function getCountryInfo(q) {
  const tries = [
    `https://restcountries.com/v3.1/alpha/${encodeURIComponent(q)}?fields=name,cca3,currencies`,
    `https://restcountries.com/v3.1/name/${encodeURIComponent(q)}?fullText=true&fields=name,cca3,currencies`,
    `https://restcountries.com/v3.1/name/${encodeURIComponent(q)}?fields=name,cca3,currencies`
  ];
  for (const u of tries) {
    try {
      const r = await fetch(u, { cache: 'no-store' });
      if (!r.ok) continue;
      let j;
      if (r.headers.get('content-type')?.includes('application/json')) {
        j = await r.json();
      } else {
        continue;
      }
      const it = Array.isArray(j) ? j[0] : j;
      if (it?.cca3) {
        const currency = it?.currencies ? Object.keys(it.currencies)[0] : 'USD';
        return { iso3: it.cca3, currency, name: it?.name?.common || q };
      }
    } catch {}
  }
  return { iso3: q.slice(0,3).toUpperCase(), currency: 'USD', name: q };
}
