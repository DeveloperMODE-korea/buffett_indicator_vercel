import { NextRequest, NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // symbols 타입을 string[]으로 명확히 지정
    const symbols: string[] =
      searchParams.get('symbols')?.split(',') || ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA']

    const includeHistory = searchParams.get('history') === 'true'
    const days = parseInt(searchParams.get('days') || '30')

    console.log(`[Stock Data API] 요청된 심볼: ${symbols.join(', ')}`)

    // 실시간 주식 데이터 가져오기
    const stockData = await Promise.all(
      symbols.map(async (symbol: string) => {
        try {
          // ✅ 최신 버전에서 quote 사용
          const quote = await yahooFinance.quote(symbol)

          const stockInfo: any = {
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
            marketCap: quote.marketCap,
            peRatio: quote.trailingPE,
            dividendYield: quote.trailingAnnualDividendYield,
            fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
            fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
            averageVolume: quote.averageDailyVolume3Month,
            exchange: quote.fullExchangeName,
            currency: quote.currency,
            marketState: quote.marketState,
            lastUpdated:
              quote.regularMarketTime && typeof quote.regularMarketTime === 'number'
                ? new Date(quote.regularMarketTime * 1000).toISOString()
                : new Date().toISOString(),
          }

          // ✅ 히스토리 데이터 포함 여부
          if (includeHistory) {
            try {
              const chartResult = await yahooFinance.chart(symbol, {
                period1: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
                period2: new Date(),
                interval: '1d',
              })

              if (chartResult.chart.result && chartResult.chart.result.length > 0) {
                const result = chartResult.chart.result[0]
                const quoteData = result.indicators.quote[0]
                const timestamps = result.timestamp

                stockInfo.history = timestamps.map((ts, i) => ({
                  date: new Date(ts * 1000).toISOString().split('T')[0],
                  open: quoteData.open[i],
                  high: quoteData.high[i],
                  low: quoteData.low[i],
                  close: quoteData.close[i],
                  volume: quoteData.volume[i],
                }))
              } else {
                stockInfo.history = []
              }
            } catch (historyError) {
              console.error(`[Stock Data API] ${symbol} 히스토리 데이터 오류:`, historyError)
              stockInfo.history = []
            }
          }

          return { success: true, data: stockInfo }
        } catch (error) {
          console.error(`[Stock Data API] ${symbol} 데이터 오류:`, error)
          return {
            success: false,
            symbol,
            error: error instanceof Error ? error.message : '알 수 없는 오류',
          }
        }
      })
    )

    const successfulData = stockData.filter((item) => item.success)
    const failedData = stockData.filter((item) => !item.success)

    console.log(`[Stock Data API] 성공: ${successfulData.length}개, 실패: ${failedData.length}개`)

    return NextResponse.json({
      success: true,
      data: successfulData.map((item) => item.data),
      failed: failedData,
      timestamp: new Date().toISOString(),
      totalRequested: symbols.length,
      totalSuccessful: successfulData.length,
    })
  } catch (error) {
    console.error('[Stock Data API] 전체 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: '주식 데이터를 가져오는 중 오류가 발생했습니다.',
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
