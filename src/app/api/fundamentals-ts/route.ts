import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'AAPL';
    const types = (
      searchParams.get('types') ||
      'quarterlyTotalAssets,quarterlyTotalLiabilitiesNetMinorityInterest,quarterlyTotalRevenue,quarterlyNetIncome'
    ).split(',');

    // 기간 설정: 최근 5년간의 데이터
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 5);

    const res = await (yahooFinance as any).fundamentalsTimeSeries(symbol, {
      type: types,
      period1: startDate,
      period2: endDate,
    });

    return NextResponse.json(
      { success: true, data: res, symbol, timestamp: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error) {
    console.error('[Fundamentals TS API] 오류:', error);
    
    // 더 자세한 오류 정보 로깅
    if (error instanceof Error) {
      console.error('[Fundamentals TS API] 오류 메시지:', error.message);
      console.error('[Fundamentals TS API] 스택 트레이스:', error.stack);
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Fundamentals TS 로드 중 오류',
        details: error instanceof Error ? error.message : 'Unknown error'
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
