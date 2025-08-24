import { NextRequest, NextResponse } from 'next/server';

const FRED_API_KEY = process.env.FRED_API_KEY;
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const seriesId = searchParams.get('series_id');
  console.log(`[Proxy] Received request for series_id: ${seriesId}`);

  if (!seriesId) {
    return NextResponse.json({ error: 'series_id is required' }, { status: 400 });
  }

  if (!FRED_API_KEY) {
    console.error('[Proxy] FRED_API_KEY is not configured on the server.');
    return NextResponse.json({ error: 'FRED API Key is not configured' }, { status: 500 });
  }

  const fredSearchParams = new URLSearchParams(searchParams);
  fredSearchParams.set('api_key', FRED_API_KEY);
  fredSearchParams.set('file_type', 'json');

  const fredURL = `${FRED_BASE_URL}/series/observations?${fredSearchParams.toString()}`;
  console.log(`[Proxy] Fetching data from FRED URL: ${fredURL.replace(FRED_API_KEY, '[REDACTED]')}`);

  try {
    const response = await fetch(fredURL, {
      next: { revalidate: 3600 }, // 1 hour cache
    });

    console.log(`[Proxy] FRED API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Proxy] FRED API Error for ${seriesId}: ${response.status} ${response.statusText}`, errorText);
      return NextResponse.json(
        { error: `Failed to fetch data from FRED API: ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`[Proxy] Successfully fetched data for ${seriesId}.`);
    return NextResponse.json(data);

  } catch (error) {
    console.error(`[Proxy] Internal error for ${seriesId}:`, error);
    return NextResponse.json(
      { error: 'An internal error occurred in the proxy.' },
      { status: 500 }
    );
  }
}
