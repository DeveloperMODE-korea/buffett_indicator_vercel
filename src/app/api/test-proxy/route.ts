import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const testUrl = `${baseUrl}/api/context7-proxy?series_id=GDP`;
  console.log(`[TestProxy] Fetching: ${testUrl}`);

  try {
    const response = await fetch(testUrl);
    const data = await response.json();
    console.log('[TestProxy] Response from proxy:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[TestProxy] Error fetching proxy:', error);
    const errorResponse = {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    }
    return NextResponse.json({ error: 'Error in test proxy', details: errorResponse }, { status: 500 });
  }
}
