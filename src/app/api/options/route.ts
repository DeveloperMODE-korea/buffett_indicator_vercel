import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'AAPL';

    // Yahoo Finance 2 options API - 기본 옵션으로 호출
    const opt = await yahooFinance.options(symbol, {
      // 추가 설정이 필요하면 여기에 추가
    });
    
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
  } catch (error: any) {
    console.error('[Options API] 오류:', error);
    
    // 더 자세한 오류 정보 로깅
    if (error instanceof Error) {
      console.error('[Options API] 오류 메시지:', error.message);
      console.error('[Options API] 스택 트레이스:', error.stack);
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: '옵션 데이터 로드 중 오류',
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
