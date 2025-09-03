import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // ✅ symbols를 string[]로 명확화 (타입 추론 이슈 차단)
    const symbols: string[] = searchParams.get('symbols')?.split(',') || [
      'AAPL',
      'GOOGL',
      'MSFT',
      'TSLA',
      'NVDA',
    ];

    const includeHistory = searchParams.get('history') === 'true';
    const days = parseInt(searchParams.get('days') || '30', 10);

    console.log(`[Stock Data API] 요청된 심볼: ${symbols.join(', ')}`);

    const stockData = await Promise.all(
      symbols.map(async (symbol: string) => {
        try {
          // ✅ 최신 yahoo-finance2: default import 객체의 메서드 직접 호출
          const quote = await yahooFinance.quote(symbol);

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
              quote.regularMarketTime &&
              typeof quote.regularMarketTime === 'number'
                ? new Date(quote.regularMarketTime * 1000).toISOString()
                : new Date().toISOString(),
          };

          // ✅ 히스토리(일봉) 포함: 최신 버전은 chart() → { quotes, meta, events } 형태
          if (includeHistory) {
            try {
              const chartResult = await yahooFinance.chart(symbol, {
                period1: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
                period2: new Date(),
                interval: '1d',
              });

              // quotes: { date: Date, open, high, low, close, volume }[]
              const quotes = chartResult.quotes || [];

              // 일부 데이터에 null이 섞일 수 있어 안전 필터링
              const safe = quotes.filter(
                q =>
                  q?.date instanceof Date &&
                  typeof q.open === 'number' &&
                  typeof q.high === 'number' &&
                  typeof q.low === 'number' &&
                  typeof q.close === 'number' &&
                  typeof q.volume === 'number'
              );

              stockInfo.history = safe.map(q => ({
                date: q.date.toISOString().split('T')[0],
                open: q.open,
                high: q.high,
                low: q.low,
                close: q.close,
                volume: q.volume,
              }));
            } catch (historyError) {
              console.error(
                `[Stock Data API] ${symbol} 히스토리 데이터 오류:`,
                historyError
              );
              stockInfo.history = [];
            }
          }

          return { success: true, data: stockInfo };
        } catch (error) {
          console.error(`[Stock Data API] ${symbol} 데이터 오류:`, error);
          return {
            success: false,
            symbol,
            error: error instanceof Error ? error.message : '알 수 없는 오류',
          };
        }
      })
    );

    const successfulData = stockData.filter(x => x.success);
    const failedData = stockData.filter(x => !x.success);

    console.log(
      `[Stock Data API] 성공: ${successfulData.length}개, 실패: ${failedData.length}개`
    );

    return NextResponse.json({
      success: true,
      data: successfulData.map((x: any) => x.data),
      failed: failedData,
      timestamp: new Date().toISOString(),
      totalRequested: symbols.length,
      totalSuccessful: successfulData.length,
    });
  } catch (error) {
    console.error('[Stock Data API] 전체 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '주식 데이터를 가져오는 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류',
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
