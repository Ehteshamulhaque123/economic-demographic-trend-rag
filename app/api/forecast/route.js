import { NextResponse } from 'next/server';
import { holtLinear } from '../../../lib/forecast';

export async function POST(req) {
  try {
    const body = await req.json();
    const { h = 8, series = {} } = body;
    const forecasts = {};
    for (const [key, arr] of Object.entries(series)) {
      if (Array.isArray(arr) && arr.length > 0) {
        // Convert to {x, y} format if needed
        const formatted = arr.map((pt, i) => ({ x: i, y: pt.value ?? pt.y ?? pt }));
        forecasts[key] = holtLinear(formatted, h);
      } else {
        forecasts[key] = { forecast: [], lower: [], upper: [], sigma: 0 };
      }
    }
    return NextResponse.json({ forecasts });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
