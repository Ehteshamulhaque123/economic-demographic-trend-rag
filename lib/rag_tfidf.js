const STOP = new Set("a an and are as at be but by for if in into is it no not of on or s such t that the their then there these they this to was were will with".split(" "));
function tokenize(t) { return t.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(x=>x && !STOP.has(x) && x.length>1); }
export function chunkParagraphs(text, title) {
  const chunks = []; const paras = text.split(/\n\s*\n/).map(p=>p.trim()).filter(Boolean);
  for (const p of paras) { if (p.length < 60) continue;
    let buffer = ""; for (const sent of p.split(/(?<=[.!?])\s+/)) {
      if ((buffer + " " + sent).length > 500) { chunks.push(buffer.trim()); buffer = sent; } else buffer = buffer ? buffer + " " + sent : sent;
    } if (buffer.trim().length) chunks.push(buffer.trim());
  }
  return chunks.map((c, i)=> ({ id: `${title}:${i}`, title, text: c }));
}
export function buildTfIdf(docs) {
  const N = docs.length; const df = new Map();
  const tfs = docs.map(d => { const tokens = tokenize(d.text); const tf = new Map();
    for (const tok of tokens) tf.set(tok, (tf.get(tok)||0)+1);
    for (const tok of new Set(tokens)) df.set(tok, (df.get(tok)||0)+1);
    const len = Math.sqrt(Array.from(tf.values()).reduce((a,b)=>a+b*b,0)) || 1;
    return { id: d.id, title: d.title, text: d.text, tf, len };
  });
  const idf = new Map(); df.forEach((c,tok)=> idf.set(tok, Math.log((N+1)/(c+0.5))+1));
  return { tfs, idf };
}
export function rank(query, index, k=8) {
  const qTokens = tokenize(query); const qtf = new Map(); for (const t of qTokens) qtf.set(t, (qtf.get(t)||0)+1);
  const qlen = Math.sqrt(Array.from(qtf.values()).reduce((a,b)=>a+b*b,0)) || 1;
  function score(doc){ let dot=0; for (const [tok, qv] of qtf){ const idf=index.idf.get(tok)||0; const dv=doc.tf.get(tok)||0; dot += (qv*idf)*(dv*idf); }
    const dlen = doc.len || 1; return (qlen*dlen) ? dot/(qlen*dlen) : 0; }
  const scored = index.tfs.map(d => ({ ...d, score: score(d) })); scored.sort((a,b)=>b.score-a.score); return scored.slice(0,k);
}
