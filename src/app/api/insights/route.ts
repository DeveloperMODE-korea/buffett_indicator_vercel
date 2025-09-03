import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

async function fetchYahooRss(symbol: string) {
  // Yahoo Finance RSS 폴백
  const url = `https://feeds.finance.yahoo.com/rss/2.0/headline?s=${encodeURIComponent(symbol)}&region=US&lang=en-US`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'buffett-indicator-vercel (contact: dev@example.com)',
      Accept: 'application/rss+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const text = await res.text();
  const items = [...text.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1]);
  return items.slice(0, 20).map(e => {
    const title = (e.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || null;
    const link = (e.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || null;
    const pubDate = (e.match(/<pubDate>([^<]+)<\/pubDate>/) || [])[1] || null;
    return {
      title,
      link,
      providerPublishTime: pubDate ? new Date(pubDate).toISOString() : null,
    };
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbols: string[] = searchParams.get('symbols')?.split(',') || [
      'AAPL',
    ];

    const results = await Promise.all(
      symbols.map(async (symbol: string) => {
        try {
          const base = await yahooFinance.insights(symbol as any);
          let news = (base as any)?.news || [];

          // 폴백 1: insights 뉴스가 비어있으면 별도 뉴스 엔드포인트 호출(any 캐스트)
          if (!news || news.length === 0) {
            try {
              const extra = await (yahooFinance as any).news(symbol);
              news = Array.isArray(extra) ? extra : [];
            } catch (e) {
              // 무시
            }
          }

          // 폴백 2: 여전히 비면 RSS 파싱
          if (!news || news.length === 0) {
            try {
              const rss = await fetchYahooRss(symbol);
              news = rss;
            } catch (e) {
              // 무시하고 빈 배열 유지
            }
          }

          return { success: true, symbol, data: { ...(base as any), news } };
        } catch (error) {
          console.error(`[Insights API] ${symbol} 오류:`, error);
          // 소프트 성공
          return {
            success: true,
            symbol,
            data: { news: [], reason: 'unavailable_or_schema_variation' },
          };
        }
      })
    );

    const ok = results.filter(r => r.success);

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
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=900',
        },
      }
    );
  } catch (error) {
    console.error('[Insights API] 전체 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '인사이트 데이터를 가져오는 중 오류가 발생했습니다.',
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
