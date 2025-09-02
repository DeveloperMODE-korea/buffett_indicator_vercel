import { NextRequest, NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbols: string[] = searchParams.get('symbols')?.split(',') || ['AAPL']

    // 참고: quoteSummary 내 secFilings 모듈은 가용성/스키마가 수시로 변함 → validateResult 비활성화
    const results = await Promise.all(
      symbols.map(async (symbol: string) => {
        try {
          const res = await yahooFinance.quoteSummary(
            symbol,
            { modules: ['secFilings'] as any, validateResult: false } as any
          )
          const data = (res as any)?.secFilings || null
          // 응답 형태 표준화: 없으면 빈 객체 반환
          return { success: true, symbol, data: data || { filings: [], filingsRecent: [] } }
        } catch (error) {
          console.error(`[SEC Filings API] ${symbol} 오류:`, error)
          // 하드 실패 대신 소프트 성공 + 이유 전달
          return {
            success: true,
            symbol,
            data: { filings: [], filingsRecent: [], reason: 'unavailable_or_schema_variation' },
          }
        }
      })
    )

    const ok = results.filter((r) => r.success)

    return NextResponse.json(
      {
        success: true,
        data: ok.map((r: any) => r.data),
        failed: [],
        totalRequested: symbols.length,
        totalSuccessful: ok.length,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
        },
      }
    )
  } catch (error) {
    console.error('[SEC Filings API] 전체 오류:', error)
    return NextResponse.json(
      { success: false, error: 'SEC/공시 데이터를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
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
  })
}
