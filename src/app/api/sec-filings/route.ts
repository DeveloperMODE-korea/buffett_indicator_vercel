import { NextRequest, NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbols: string[] = searchParams.get('symbols')?.split(',') || ['AAPL']

    // 참고: quoteSummary 내 secFilings 모듈은 가용성에 변동이 있을 수 있음
    const results = await Promise.all(
      symbols.map(async (symbol: string) => {
        try {
          const res = await yahooFinance.quoteSummary(symbol, { modules: ['secFilings'] as any })
          return { success: true, symbol, data: (res as any)?.secFilings }
        } catch (error) {
          console.error(`[SEC Filings API] ${symbol} 오류:`, error)
          return {
            success: false,
            symbol,
            error: error instanceof Error ? error.message : '알 수 없는 오류',
          }
        }
      })
    )

    const ok = results.filter((r) => r.success)
    const failed = results.filter((r) => !r.success)

    return NextResponse.json({
      success: true,
      data: ok.map((r: any) => r.data),
      failed,
      totalRequested: symbols.length,
      totalSuccessful: ok.length,
      timestamp: new Date().toISOString(),
    })
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
