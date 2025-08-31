import { NextRequest, NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const indices = searchParams.get('indices')?.split(',') || [
      '^GSPC',  // S&P 500
      '^DJI',   // Dow Jones
      '^IXIC',  // NASDAQ
      '^RUT',   // Russell 2000
      '^VIX',   // VIX
      '^TNX',   // 10년 국채 수익률
      'DX-Y.NYB', // 달러 지수
      'GC=F',   // 금
      'CL=F',   // 원유
      'BTC-USD' // 비트코인
    ]

    console.log(`[Market Indices API] 요청된 지수: ${indices.join(', ')}`)

    const indicesData = await Promise.all(
      indices.map(async (index) => {
        try {
          const quote = await yahooFinance.quote.bind(yahooFinance)(index)
          
          const indexInfo = {
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
            lastUpdated: quote.regularMarketTime && typeof quote.regularMarketTime === 'number' ? new Date(quote.regularMarketTime * 1000).toISOString() : new Date().toISOString(),
          }

          return {
            success: true,
            data: indexInfo
          }
        } catch (error) {
          console.error(`[Market Indices API] ${index} 데이터 오류:`, error)
          return {
            success: false,
            symbol: index,
            error: error instanceof Error ? error.message : '알 수 없는 오류'
          }
        }
      })
    )

    const successfulData = indicesData.filter(item => item.success)
    const failedData = indicesData.filter(item => !item.success)

    console.log(`[Market Indices API] 성공: ${successfulData.length}개, 실패: ${failedData.length}개`)

    return NextResponse.json({
      success: true,
      data: successfulData.map(item => item.data),
      failed: failedData,
      timestamp: new Date().toISOString(),
      totalRequested: indices.length,
      totalSuccessful: successfulData.length
    })

  } catch (error) {
    console.error('[Market Indices API] 전체 오류:', error)
    return NextResponse.json(
      { 
        success: false,
        error: '시장 지수 데이터를 가져오는 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
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
