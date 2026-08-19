import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const lat = Number(req.nextUrl.searchParams.get('lat'));
  const lon = Number(req.nextUrl.searchParams.get('lon'));
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  }
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day,wind_speed_10m&timezone=auto`,
      { next: { revalidate: 1800 } },
    );
    if (!response.ok) return NextResponse.json({ error: 'Weather unavailable' }, { status: 502 });
    const data = await response.json();
    const current = data.current;
    return NextResponse.json({
      code: current.weather_code,
      is_day: current.is_day,
      temperature: current.temperature_2m,
      wind: current.wind_speed_10m,
    });
  } catch {
    return NextResponse.json({ error: 'Weather unavailable' }, { status: 502 });
  }
}
