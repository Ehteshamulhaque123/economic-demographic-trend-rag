export function holtLinear(series, h = 8, alpha = 0.4, beta = 0.2) {
  if (!series || series.length < 3) return { forecast: [], lower: [], upper: [], sigma: 0 };
  let l = series[0].y, b = series[1].y - series[0].y, fitted=[];
  for (let t=0;t<series.length;t++){ const y=series[t].y; const prevL=l; l = alpha*y + (1-alpha)*(l+b); b = beta*(l-prevL) + (1-beta)*b; fitted.push(l+b); }
  const resid = series.map((pt,i)=> pt.y - (i<fitted.length?fitted[i]:pt.y));
  const mean = resid.reduce((a,b)=>a+b,0)/resid.length;
  const variance = resid.reduce((a,b)=>a+(b-mean)**2,0)/Math.max(1,resid.length-1);
  const sigma = Math.sqrt(variance);
  const lastX = series[series.length-1].x;
  const out=[],low=[],up=[];
  for (let i=1;i<=h;i++){ const yhat=l+i*b; out.push({x:lastX+i,y:yhat}); low.push({x:lastX+i,y:yhat-1.96*sigma}); up.push({x:lastX+i,y:yhat+1.96*sigma}); }
  return { forecast: out, lower: low, upper: up, sigma };
}
