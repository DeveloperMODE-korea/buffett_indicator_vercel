import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'AAPL';

    const opt = await yahooFinance.options(symbol as any, {}, {});
    // 가장 가까운 만기만 간단 요약
    const first =
      Array.isArray(opt?.options) && opt.options.length ? opt.options[0] : null;

    return NextResponse.json(
      {
        success: true,
        data: {
          symbol,
          expirationDates: opt?.expirationDates || [],
          nearest: first
            ? {
                expirationDate: first.expirationDate,
                calls: (first.calls || []).slice(0, 10),
                puts: (first.puts || []).slice(0, 10),
              }
            : null,
        },
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900',
        },
      }
    );
  } catch (error) {
    console.error('[Options API] 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '옵션 데이터를 가져오는 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
