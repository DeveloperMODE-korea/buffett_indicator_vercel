import { NextRequest, NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'

async function fetchSecAtomBySymbol(symbol: string) {
  // SEC CIK 조회는 별도 필요하지만 간단 폴백으로 심볼 기반 검색 RSS를 사용
  const url = `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&owner=exclude&count=40&output=atom&CIK=${encodeURIComponent(symbol)}`
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'buffett-indicator-vercel (contact: dev@example.com)',
      'Accept': 'application/atom+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    cache: 'no-store',
  })
  if (!res.ok) return []
  const text = await res.text()
  // 매우 단순한 파서: entry 항목만 추출
  const entries = [...text.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1])
  return entries.slice(0, 20).map((e) => {
    const type = (e.match(/<category[^>]*term=\"([^\"]+)\"/) || [])[1] || null
    const title = (e.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || null
    const date = (e.match(/<updated>([^<]+)<\/updated>/) || [])[1] || null
    const link = (e.match(/<link[^>]*href=\"([^\"]+)\"/) || [])[1] || null
    return { form: type, type, date: date || null, edgarUrl: link, title }
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbols: string[] = searchParams.get('symbols')?.split(',') || ['AAPL']

    const results = await Promise.all(
      symbols.map(async (symbol: string) => {
        try {
          const res = await yahooFinance.quoteSummary(
            symbol,
            { modules: ['secFilings'] as any, validateResult: false } as any
          )
          let data = (res as any)?.secFilings || { filings: [], filingsRecent: [] }

          const combined = {
            filings: Array.isArray(data?.filings) ? data.filings : [],
            filingsRecent: Array.isArray(data?.filingsRecent) ? data.filingsRecent : [],
          }

          if ((combined.filings.length + combined.filingsRecent.length) === 0) {
            try {
              const fallback = await fetchSecAtomBySymbol(symbol)
              return { success: true, symbol, data: { filings: fallback, filingsRecent: [] } }
            } catch (e) {
              // 폴백 실패 시도 무시, 빈 값 반환
              return { success: true, symbol, data: combined }
            }
          }

          return { success: true, symbol, data: combined }
        } catch (error) {
          console.error(`[SEC Filings API] ${symbol} 오류:`, error)
          // 소프트 성공
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
