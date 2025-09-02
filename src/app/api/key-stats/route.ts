import { NextRequest, NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbols: string[] = searchParams.get('symbols')?.split(',') || ['AAPL']

    const results = await Promise.all(
      symbols.map(async (symbol: string) => {
        try {
          const res = await yahooFinance.quoteSummary(symbol, { modules: ['defaultKeyStatistics','financialData'] as any })
          return { success: true, symbol, data: res }
        } catch (error) {
          console.error(`[KeyStats API] ${symbol} 오류:`, error)
          return { success: false, symbol, error: error instanceof Error ? error.message : '알 수 없는 오류' }
        }
      })
    )

    const ok = results.filter((r) => r.success)
    const failed = results.filter((r) => !r.success)

    return NextResponse.json(
      {
        success: true,
        data: ok.map((r: any) => r.data),
        failed,
        totalRequested: symbols.length,
        totalSuccessful: ok.length,
        timestamp: new Date().toISOString(),
      },
      { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } }
    )
  } catch (error) {
    console.error('[KeyStats API] 전체 오류:', error)
    return NextResponse.json({ success: false, error: 'Key Stats 로드 중 오류' }, { status: 500 })
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } })
}
