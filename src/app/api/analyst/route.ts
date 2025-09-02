import { NextRequest, NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbols: string[] = searchParams.get('symbols')?.split(',') || ['AAPL']

    // recommendationTrend, financialData (targetMeanPrice 등)
    const results = await Promise.all(
      symbols.map(async (symbol: string) => {
        try {
          const [recommendationTrend, financialData] = await Promise.all([
            yahooFinance.quoteSummary(symbol, { modules: ['recommendationTrend'] as any }),
            yahooFinance.quoteSummary(symbol, { modules: ['financialData'] as any }),
          ])

          return {
            success: true,
            symbol,
            data: {
              recommendationTrend: (recommendationTrend as any)?.recommendationTrend,
              financialData: (financialData as any)?.financialData,
            },
          }
        } catch (error) {
          console.error(`[Analyst API] ${symbol} 오류:`, error)
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
    console.error('[Analyst API] 전체 오류:', error)
    return NextResponse.json(
      { success: false, error: '애널리스트 데이터를 가져오는 중 오류가 발생했습니다.' },
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
