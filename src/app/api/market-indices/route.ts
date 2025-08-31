import { NextRequest, NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // ✅ indices 타입 고정
    const indices: string[] =
      searchParams.get('indices')?.split(',') || [
        '^GSPC',     // S&P 500
        '^DJI',      // Dow Jones
        '^IXIC',     // NASDAQ
        '^RUT',      // Russell 2000
        '^VIX',      // VIX
        '^TNX',      // 10Y Treasury Yield
        'DX-Y.NYB',  // US Dollar Index
        'GC=F',      // Gold
        'CL=F',      // WTI Crude
        'BTC-USD',   // Bitcoin
      ]

    // ✅ stock-data와 동일한 옵션 지원
    const includeHistory = searchParams.get('history') === 'true'
    const days = parseInt(searchParams.get('days') || '30', 10)

    console.log(`[Market Indices API] 요청된 지수: ${indices.join(', ')}`)

    const indicesData = await Promise.all(
      indices.map(async (symbol: string) => {
        try {
          // ✅ 최신 yahoo-finance2 메서드 직접 호출
          const quote = await yahooFinance.quote(symbol)

          const indexInfo: any = {
            symbol: quote.symbol,
            name: quote.shortName || quote.longName,
            price: quote.regularMarketPrice,
            change: quote.regularMarketChange,
            changePercent: quote.regularMarketChangePercent,
            previousClose: quote.regularMarketPreviousClose,
            open: quote.regularMarketOpen,
            high: quote.regularMarketDayHigh,
            low: quote.regularMarketDayLow,
            volume: quote.regularMarketVolume,
            fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
            fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
            exchange: quote.fullExchangeName,
            currency: quote.currency,
            marketState: quote.marketState,
            lastUpdated:
              quote.regularMarketTime && typeof quote.regularMarketTime === 'number'
                ? new Date(quote.regularMarketTime * 1000).toISOString()
                : new Date().toISOString(),
          }

          if (includeHistory) {
            try {
              const chartResult = await yahooFinance.chart(symbol, {
                period1: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
                period2: new Date(),
                interval: '1d',
              })

              // ✅ 최신 반환 구조: quotes 배열
              const quotes = chartResult.quotes || []
              const safe = quotes.filter(
                (q) =>
                  q?.date instanceof Date &&
                  typeof q.open === 'number' &&
                  typeof q.high === 'number' &&
                  typeof q.low === 'number' &&
                  typeof q.close === 'number' &&
                  typeof q.volume === 'number'
              )

              indexInfo.history = safe.map((q) => ({
                date: q.date.toISOString().split('T')[0],
                open: q.open,
                high: q.high,
                low: q.low,
                close: q.close,
                volume: q.volume,
              }))
            } catch (historyError) {
              console.error(`[Market Indices API] ${symbol} 히스토리 데이터 오류:`, historyError)
              indexInfo.history = []
            }
          }

          return { success: true, data: indexInfo }
        } catch (error) {
          console.error(`[Market Indices API] ${symbol} 데이터 오류:`, error)
          return {
            success: false,
            symbol,
            error: error instanceof Error ? error.message : '알 수 없는 오류',
          }
        }
      })
    )

    const successfulData = indicesData.filter((item) => item.success)
    const failedData = indicesData.filter((item) => !item.success)

    console.log(`[Market Indices API] 성공: ${successfulData.length}개, 실패: ${failedData.length}개`)

    return NextResponse.json({
      success: true,
      data: successfulData.map((item: any) => item.data),
      failed: failedData,
      timestamp: new Date().toISOString(),
      totalRequested: indices.length,
      totalSuccessful: successfulData.length,
    })
  } catch (error) {
    console.error('[Market Indices API] 전체 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: '시장 지수 데이터를 가져오는 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류',
      },
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
