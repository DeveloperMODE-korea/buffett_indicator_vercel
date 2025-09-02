import { NextRequest, NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'

// 간단 메모리 캐시: CIK 매핑과 만료 시간
let cikMapCache: { map: Record<string, string>; expiresAt: number } | null = null

async function loadCikMap(): Promise<Record<string, string>> {
  const now = Date.now()
  if (cikMapCache && cikMapCache.expiresAt > now) return cikMapCache.map

  const url = 'https://www.sec.gov/files/company_tickers.json'
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'buffett-indicator-vercel (contact: dev@example.com)',
      'Accept': 'application/json',
    },
    cache: 'no-store',
  })
  if (!res.ok) {
    // 실패 시 빈 맵 반환 (폴백에서 처리)
    cikMapCache = { map: {}, expiresAt: now + 60_000 }
    return cikMapCache.map
  }
  const json = await res.json()
  // company_tickers.json 형식: {"0": {cik_str, ticker, title}, ...}
  const map: Record<string, string> = {}
  Object.values(json as any).forEach((row: any) => {
    if (row?.ticker && row?.cik_str) {
      map[String(row.ticker).toUpperCase()] = String(row.cik_str).padStart(10, '0')
    }
  })
  cikMapCache = { map, expiresAt: now + 24 * 60 * 60 * 1000 }
  return map
}

async function fetchSecSubmissionsByTicker(symbol: string) {
  const map = await loadCikMap()
  const cik = map[symbol.toUpperCase()]
  if (!cik) return null

  const url = `https://data.sec.gov/submissions/CIK${cik}.json`
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'buffett-indicator-vercel (contact: dev@example.com)',
      'Accept': 'application/json',
    },
    cache: 'no-store',
  })
  if (!res.ok) return null
  const data = await res.json()
  // filings.recent: columns arrays
  const recent = data?.filings?.recent
  if (!recent || !recent.form || !recent.filingDate) return []
  const len = Math.min(
    recent.form.length,
    recent.filingDate.length,
    recent.accessionNumber?.length || 0,
    recent.primaryDocument?.length || 0
  )
  const items = [] as any[]
  for (let i = 0; i < Math.min(len, 50); i++) {
    const form = recent.form[i]
    const filingDate = recent.filingDate[i]
    const accNoRaw = (recent.accessionNumber?.[i] || '').replace(/-/g, '')
    const primaryDoc = recent.primaryDocument?.[i]
    const edgarUrl = cik
      ? `https://www.sec.gov/Archives/edgar/data/${parseInt(cik, 10)}/${accNoRaw}/${primaryDoc}`
      : null
    items.push({ form, type: form, date: filingDate, edgarUrl })
  }
  return items
}

async function fetchSecAtomBySymbol(symbol: string) {
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
        // 1) SEC Submissions API (권장)
        try {
          const subs = await fetchSecSubmissionsByTicker(symbol)
          if (subs && subs.length) {
            return { success: true, symbol, data: { filings: subs, filingsRecent: [] } }
          }
        } catch (e) {
          // 무시하고 다음 폴백
        }

        // 2) Yahoo secFilings (validateResult false)
        try {
          const res = await yahooFinance.quoteSummary(
            symbol,
            { modules: ['secFilings'] as any, validateResult: false } as any
          )
          const yf = (res as any)?.secFilings || { filings: [], filingsRecent: [] }
          if ((yf.filings?.length || 0) + (yf.filingsRecent?.length || 0)) {
            return { success: true, symbol, data: yf }
          }
        } catch (e) {
          // 무시
        }

        // 3) SEC Atom RSS 폴백
        try {
          const atom = await fetchSecAtomBySymbol(symbol)
          if (atom.length) return { success: true, symbol, data: { filings: atom, filingsRecent: [] } }
        } catch (e) {
          // 무시
        }

        // 모두 실패: 소프트 성공 빈 데이터
        return {
          success: true,
          symbol,
          data: { filings: [], filingsRecent: [], reason: 'no_data_from_all_sources' },
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
