'use client'

import { useState, useEffect, useMemo } from 'react'
import useSWR from 'swr'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const TradingViewChart = dynamic(() => import('@/components/TradingViewChart'), {
  ssr: false,
  loading: () => (
    <div className="h-96 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">차트를 불러오는 중...</p>
      </div>
    </div>
  ),
})

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function downloadCsv(filename: string, rows: Array<string[]>) {
  const csv = rows.map((r) => r.map((c) => {
    const s = c == null ? '' : String(c)
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"'
    }
    return s
  }).join(',')).join('\n')
  const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  previousClose: number
  open: number
  high: number
  low: number
  volume: number
  marketCap: number
  peRatio: number
  dividendYield: number
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
  averageVolume: number
  exchange: string
  currency: string
  marketState: string
  lastUpdated: string
}

interface SearchResult {
  symbol: string
  name: string
  exchange: string
  type: string
  score: number
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 추가 섹션 상태
  const [earningsData, setEarningsData] = useState<any | null>(null)
  const [analystData, setAnalystData] = useState<any | null>(null)
  const [ownershipData, setOwnershipData] = useState<any | null>(null)
  const [summaryData, setSummaryData] = useState<any | null>(null)
  const [insightsData, setInsightsData] = useState<any | null>(null)
  const [ratingsData, setRatingsData] = useState<any | null>(null)
  const [filingsData, setFilingsData] = useState<any | null>(null)
  const [financialsData, setFinancialsData] = useState<any | null>(null)
  const [financialsPeriod, setFinancialsPeriod] = useState<'annual' | 'quarterly'>('annual')
  const [keyStatsData, setKeyStatsData] = useState<any | null>(null)
  const [optionsData, setOptionsData] = useState<any | null>(null)
  const [ftsData, setFtsData] = useState<any | null>(null)
  const [fundFactsData, setFundFactsData] = useState<any | null>(null)

  // 섹션별 로딩/에러
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})
  const [errorMap, setErrorMap] = useState<Record<string, string | null>>({})

  // 더보기 컨트롤(기본 10개)
  const [newsLimit, setNewsLimit] = useState(10)
  const [ratingsLimit, setRatingsLimit] = useState(10)
  const [filingsLimit, setFilingsLimit] = useState(10)

  // 정렬/필터 컨트롤
  const [newsSort, setNewsSort] = useState<'latest' | 'title'>('latest')
  const [ratingsFilter, setRatingsFilter] = useState<'all' | 'upgrade' | 'downgrade'>('all')
  const [filingsFilter, setFilingsFilter] = useState<'all' | '10-K' | '10-Q' | '8-K'>('all')

  // 인기 검색어
  const popularSearches = [
    'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'AMZN', 'META', 'BRK-B', 'JPM', 'V',
    'SPY', 'QQQ', 'VTI', 'VOO', 'IWM', 'GLD', 'TLT', 'BTC-USD', 'ETH-USD'
  ]

  // 검색어 디바운스 + SWR로 캐싱/중복 제거
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  const { data: swrSearchData, isLoading: swrSearchLoading, error: swrSearchError } = useSWR(
    debouncedQuery ? `/api/stock-search?query=${encodeURIComponent(debouncedQuery)}` : null,
    fetcher,
    { dedupingInterval: 30000 }
  )

  useEffect(() => {
    if (swrSearchLoading) setSearchLoading(true)
    else setSearchLoading(false)
    if (swrSearchError) setError('검색 중 오류가 발생했습니다.')
    if (swrSearchData?.success) setSearchResults(swrSearchData.data || [])
    if (debouncedQuery === '' && searchQuery === '') setSearchResults([])
  }, [swrSearchLoading, swrSearchError, swrSearchData, debouncedQuery, searchQuery])

  // 주식 데이터 가져오기(선택시)
  const fetchStockData = async (symbol: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/stock-data?symbols=${symbol}&history=true&days=30`)
      const result = await response.json()

      if (result.success && result.data.length > 0) {
        setSelectedStock(result.data[0])
      } else {
        setError('주식 데이터를 가져올 수 없습니다.')
      }
    } catch (err) {
      console.error('주식 데이터 오류:', err)
      setError('주식 데이터를 가져오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 공통 로더 헬퍼
  const withSectionLoader = async (key: string, fn: () => Promise<void>) => {
    setLoadingMap((m) => ({ ...m, [key]: true }))
    setErrorMap((m) => ({ ...m, [key]: null }))
    try {
      await fn()
    } catch (e: any) {
      setErrorMap((m) => ({ ...m, [key]: e?.message || '로딩 실패' }))
    } finally {
      setLoadingMap((m) => ({ ...m, [key]: false }))
    }
  }

  // 섹션별 로더
  const loadEarnings = async (symbol: string) =>
    withSectionLoader('earnings', async () => {
      const r = await fetch(`/api/earnings?symbols=${symbol}`)
      const j = await r.json()
      if (!j?.success) throw new Error('실적 데이터 오류')
      setEarningsData(j.data?.[0] || null)
    })

  const loadAnalyst = async (symbol: string) =>
    withSectionLoader('analyst', async () => {
      const r = await fetch(`/api/analyst?symbols=${symbol}`)
      const j = await r.json()
      if (!j?.success) throw new Error('애널리스트 데이터 오류')
      setAnalystData(j.data?.[0] || null)
    })

  const loadOwnership = async (symbol: string) =>
    withSectionLoader('ownership', async () => {
      const r = await fetch(`/api/ownership?symbols=${symbol}`)
      const j = await r.json()
      if (!j?.success) throw new Error('보유 데이터 오류')
      setOwnershipData(j.data?.[0] || null)
    })

  const loadSummary = async (symbol: string) =>
    withSectionLoader('summary', async () => {
      const r = await fetch(`/api/summary?symbols=${symbol}&modules=price,summaryDetail,financialData,assetProfile`)
      const j = await r.json()
      if (!j?.success) throw new Error('프로필 데이터 오류')
      setSummaryData(j.data?.[0] || null)
    })

  const loadInsights = async (symbol: string) =>
    withSectionLoader('insights', async () => {
      const r = await fetch(`/api/insights?symbols=${symbol}`)
      const j = await r.json()
      if (!j?.success) throw new Error('인사이트 데이터 오류')
      setInsightsData(j.data?.[0] || null)
    })

  const loadRatings = async (symbol: string) =>
    withSectionLoader('ratings', async () => {
      const r = await fetch(`/api/ratings?symbols=${symbol}`)
      const j = await r.json()
      if (!j?.success) throw new Error('등급 변경 데이터 오류')
      setRatingsData(j.data?.[0] || null)
    })

  const loadFilings = async (symbol: string) =>
    withSectionLoader('filings', async () => {
      const r = await fetch(`/api/sec-filings?symbols=${symbol}`)
      const j = await r.json()
      if (!j?.success) throw new Error('공시 데이터 오류')
      setFilingsData(j.data?.[0] || null)
    })

  const loadFinancials = async (symbol: string, period: 'annual' | 'quarterly') =>
    withSectionLoader('financials', async () => {
      const r = await fetch(`/api/financials?symbols=${symbol}&period=${period}`)
      const j = await r.json()
      if (!j?.success) throw new Error('재무제표 데이터 오류')
      setFinancialsData(j.data?.[0] || null)
    })

  const loadKeyStats = async (symbol: string) =>
    withSectionLoader('keyStats', async () => {
      const r = await fetch(`/api/key-stats?symbols=${symbol}`)
      const j = await r.json()
      if (!j?.success) throw new Error('Key Stats 데이터 오류')
      setKeyStatsData(j.data?.[0] || null)
    })

  const loadOptions = async (symbol: string) =>
    withSectionLoader('options', async () => {
      const r = await fetch(`/api/options?symbol=${symbol}`)
      const j = await r.json()
      if (!j?.success) throw new Error('옵션 데이터 오류')
      setOptionsData(j.data || null)
    })

  const loadFts = async (symbol: string) =>
    withSectionLoader('fts', async () => {
      const r = await fetch(`/api/fundamentals-ts?symbol=${symbol}`)
      const j = await r.json()
      if (!j?.success) throw new Error('Fundamentals TS 데이터 오류')
      setFtsData(j.data || null)
    })

  const loadFundFacts = async (symbol: string) =>
    withSectionLoader('fundFacts', async () => {
      const r = await fetch(`/api/fund-facts?symbols=${symbol}`)
      const j = await r.json()
      if (!j?.success) throw new Error('Fund Facts 데이터 오류')
      setFundFactsData(j.data?.[0] || null)
    })

  // 선택 종목 변경 시 병렬 로드
  useEffect(() => {
    const run = async () => {
      if (!selectedStock?.symbol) return
      setNewsLimit(10); setRatingsLimit(10); setFilingsLimit(10)
      await Promise.all([
        loadEarnings(selectedStock.symbol),
        loadAnalyst(selectedStock.symbol),
        loadOwnership(selectedStock.symbol),
        loadSummary(selectedStock.symbol),
        loadInsights(selectedStock.symbol),
        loadRatings(selectedStock.symbol),
        loadFilings(selectedStock.symbol),
        loadFinancials(selectedStock.symbol, financialsPeriod),
        loadKeyStats(selectedStock.symbol),
        loadOptions(selectedStock.symbol),
        loadFts(selectedStock.symbol),
        loadFundFacts(selectedStock.symbol),
      ])
    }
    run()
  }, [selectedStock?.symbol])

  useEffect(() => {
    if (selectedStock?.symbol) {
      loadFinancials(selectedStock.symbol, financialsPeriod)
    }
  }, [financialsPeriod])

  const formatNumber = (num: number, decimals: number = 2) => {
    if (num === null || num === undefined) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num)
  }

  const formatCurrency = (num: number, currency: string = 'USD') => {
    if (num === null || num === undefined) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(num)
  }

  const formatVolume = (num: number) => {
    if (num === null || num === undefined) return 'N/A'
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
    return num.toString()
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 dark:text-green-400'
    if (change < 0) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return '↗️'
    if (change < 0) return '↘️'
    return '→'
  }

  // 메모이즈: 정렬/필터 적용 리스트
  const sortedNews = useMemo(() => {
    const items = [...(insightsData?.news ?? [])]
    if (newsSort === 'latest') {
      items.sort((a: any, b: any) => (new Date(b.providerPublishTime || b.publishedAt || 0).getTime()) - (new Date(a.providerPublishTime || a.publishedAt || 0).getTime()))
    } else {
      items.sort((a: any, b: any) => String(a.title || '').localeCompare(String(b.title || '')))
    }
    return items
  }, [insightsData?.news, newsSort])

  const filteredRatings = useMemo(() => {
    const items = [...(ratingsData?.history ?? [])]
    if (ratingsFilter === 'upgrade') return items.filter((r: any) => String(r.action || '').toLowerCase().includes('up'))
    if (ratingsFilter === 'downgrade') return items.filter((r: any) => String(r.action || '').toLowerCase().includes('down'))
    return items
  }, [ratingsData?.history, ratingsFilter])

  const filteredFilings = useMemo(() => {
    const items: any[] = (filingsData?.filings ?? filingsData?.filingsRecent ?? []) || []
    if (filingsFilter === 'all') return items
    return items.filter((f: any) => (f?.type || f?.form || '').toUpperCase().includes(filingsFilter))
  }, [filingsData, filingsFilter])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          🔍 실시간 주식 검색
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          심볼, 회사명으로 실시간 주식 정보를 검색하세요
        </p>
      </div>

      {/* 검색 입력 */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="주식 심볼 또는 회사명을 입력하세요 (예: AAPL, Apple)"
            className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
          {searchLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* 인기 검색어 */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">인기 검색어:</p>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((symbol) => (
              <button
                key={symbol}
                onClick={() => setSearchQuery(symbol)}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 검색 결과 */}
      {searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            검색 결과 ({searchResults.length}개)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((result) => (
              <Card 
                key={result.symbol} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => fetchStockData(result.symbol)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    {result.symbol}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {result.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {result.exchange} • {result.type}
                  </p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

             {/* 선택된 주식 상세 정보 */}
       {selectedStock && (
         <div className="mb-8">
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
             📊 {selectedStock.name} ({selectedStock.symbol})
           </h2>
           
           {loading ? (
             <div className="text-center py-8">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
               <p className="mt-2 text-gray-600 dark:text-gray-400">데이터를 불러오는 중...</p>
             </div>
           ) : (
             <div className="space-y-6">
                               {/* TradingView 차트 */}
                <TradingViewChart stockData={selectedStock} />
               
               {/* 기본 정보 */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                   <CardHeader>
                     <CardTitle className="text-xl">기본 정보</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <div className="flex justify_between items-center">
                       <span className="text-2xl font-bold text-gray-900 dark:text-white">
                         {formatCurrency(selectedStock.price, selectedStock.currency)}
                       </span>
                       <span className={`text-lg font-medium ${getChangeColor(selectedStock.change)}`}>
                         {getChangeIcon(selectedStock.change)} {formatNumber(selectedStock.change, 2)} ({formatNumber(selectedStock.changePercent, 2)}%)
                       </span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4 text-sm">
                       <div>
                         <span className="text-gray-600 dark:text-gray-400">이전 종가:</span>
                         <span className="ml-2 font-medium">{formatCurrency(selectedStock.previousClose, selectedStock.currency)}</span>
                       </div>
                       <div>
                         <span className="text-gray-600 dark:text-gray-400">시가:</span>
                         <span className="ml-2 font-medium">{formatCurrency(selectedStock.open, selectedStock.currency)}</span>
                       </div>
                       <div>
                         <span className="text-gray-600 dark:text-gray-400">고가:</span>
                         <span className="ml-2 font-medium">{formatCurrency(selectedStock.high, selectedStock.currency)}</span>
                       </div>
                       <div>
                         <span className="text-gray-600 dark:text-gray-400">저가:</span>
                         <span className="ml-2 font-medium">{formatCurrency(selectedStock.low, selectedStock.currency)}</span>
                       </div>
                     </div>
                   </CardContent>
                 </Card>

                 {/* 거래 정보 */}
                 <Card>
                   <CardHeader>
                     <CardTitle className="text-xl">거래 정보</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <div className="grid grid-cols-2 gap-4 text-sm">
                       <div>
                         <span className="text-gray-600 dark:text-gray-400">거래량:</span>
                         <span className="ml-2 font-medium">{formatVolume(selectedStock.volume)}</span>
                       </div>
                       <div>
                         <span className="text-gray-600 dark:text-gray-400">시가총액:</span>
                         <span className="ml-2 font-medium">{formatVolume(selectedStock.marketCap)}</span>
                       </div>
                       <div>
                         <span className="text-gray-600 dark:text-gray-400">P/E 비율:</span>
                         <span className="ml-2 font-medium">{selectedStock.peRatio ? formatNumber(selectedStock.peRatio, 2) : 'N/A'}</span>
                       </div>
                       <div>
                         <span className="text-gray-600 dark:text-gray-400">배당 수익률:</span>
                         <span className="ml-2 font-medium">{selectedStock.dividendYield ? `${formatNumber(selectedStock.dividendYield, 2)}%` : 'N/A'}</span>
                       </div>
                       <div>
                         <span className="text-gray-600 dark:text-gray-400">52주 고가:</span>
                         <span className="ml-2 font-medium">{formatCurrency(selectedStock.fiftyTwoWeekHigh, selectedStock.currency)}</span>
                       </div>
                       <div>
                         <span className="text-gray-600 dark:text-gray-400">52주 저가:</span>
                         <span className="ml-2 font-medium">{formatCurrency(selectedStock.fiftyTwoWeekLow, selectedStock.currency)}</span>
                       </div>
                     </div>
                     
                     <div className="text-xs text-gray-500 dark:text-gray-400">
                       마지막 업데이트: {new Date(selectedStock.lastUpdated).toLocaleString('ko-KR')}
                     </div>
                   </CardContent>
                 </Card>
               </div>

               {/* 상세 섹션: 실적 / 애널리스트 / 보유 / 프로필 요약 */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                   <CardHeader>
                     <CardTitle className="text-xl">실적 / 캘린더</CardTitle>
                   </CardHeader>
                   <CardContent>
                     {loadingMap.earnings && <p className="text-sm text-gray-500">불러오는 중...</p>}
                     {errorMap.earnings && (
                       <div className="text-sm text-red-500 flex items-center gap-2">
                         <span>{errorMap.earnings}</span>
                         <button className="px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded" onClick={() => selectedStock && loadEarnings(selectedStock.symbol)}>재시도</button>
                       </div>
                     )}
                     {!loadingMap.earnings && !errorMap.earnings && earningsData && (
                       <div className="space-y-2 text-sm">
                         <div>
                           <span className="text-gray-600 dark:text-gray-400">최근 EPS(History):</span>
                           <span className="ml-2 font-medium">{earningsData?.earningsHistory?.history?.[0]?.epsActual ?? 'N/A'}</span>
                         </div>
                         <div>
                           <span className="text-gray-600 dark:text-gray-400">예상 EPS(Trend):</span>
                           <span className="ml-2 font-medium">{earningsData?.earningsTrend?.trend?.[0]?.epsTrend?.current ?? 'N/A'}</span>
                         </div>
                         <div>
                           <span className="text-gray-600 dark:text-gray-400">다음 실적 발표:</span>
                           <span className="ml-2 font-medium">{earningsData?.calendarEvents?.earnings?.earningsDate?.[0] ? new Date(earningsData.calendarEvents.earnings.earningsDate[0]).toLocaleString('ko-KR') : 'N/A'}</span>
                         </div>
                       </div>
                     )}
                   </CardContent>
                 </Card>

                 <Card>
                   <CardHeader>
                     <CardTitle className="text-xl">애널리스트 / 목표가</CardTitle>
                   </CardHeader>
                   <CardContent>
                     {loadingMap.analyst && <p className="text-sm text-gray-500">불러오는 중...</p>}
                     {errorMap.analyst && (
                       <div className="text-sm text-red-500 flex items_center gap-2">
                         <span>{errorMap.analyst}</span>
                         <button className="px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded" onClick={() => selectedStock && loadAnalyst(selectedStock.symbol)}>재시도</button>
                       </div>
                     )}
                     {!loadingMap.analyst && !errorMap.analyst && analystData && (
                       <div className="space-y-2 text-sm">
                         <div>
                           <span className="text-gray-600 dark:text-gray-400">추천 트렌드(최근):</span>
                           <span className="ml-2 font-medium">{analystData?.recommendationTrend?.trend?.[0]?.strongBuy ?? 0} Strong Buy</span>
                         </div>
                         <div>
                           <span className="text-gray-600 dark:text-gray-400">목표가(평균):</span>
                           <span className="ml-2 font-medium">{analystData?.financialData?.targetMeanPrice ? formatCurrency(analystData.financialData.targetMeanPrice, selectedStock.currency) : 'N/A'}</span>
                         </div>
                       </div>
                     )}
                   </CardContent>
                 </Card>

                 <Card>
                   <CardHeader>
                     <CardTitle className="text-xl">보유자 / 내부자</CardTitle>
                   </CardHeader>
                   <CardContent>
                     {loadingMap.ownership && <p className="text_sm text-gray-500">불러오는 중...</p>}
                     {errorMap.ownership && (
                       <div className="text-sm text-red-500 flex items-center gap-2">
                         <span>{errorMap.ownership}</span>
                         <button className="px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded" onClick={() => selectedStock && loadOwnership(selectedStock.symbol)}>재시도</button>
                       </div>
                     )}
                     {!loadingMap.ownership && !errorMap.ownership && ownershipData && (
                       <div className="space-y-2 text-sm">
                         <div>
                           <span className="text-gray-600 dark:text-gray-400">기관 보유 비중:</span>
                           <span className="ml-2 font-medium">{ownershipData?.majorHoldersBreakdown?.institutionsPercentHeld ? `${formatNumber(ownershipData.majorHoldersBreakdown.institutionsPercentHeld * 100, 2)}%` : 'N/A'}</span>
                         </div>
                         <div>
                           <span className="text-gray-600 dark:text-gray-400">내부자 보유 비중:</span>
                           <span className="ml-2 font-medium">{ownershipData?.majorHoldersBreakdown?.insidersPercentHeld ? `${formatNumber(ownershipData.majorHoldersBreakdown.insidersPercentHeld * 100, 2)}%` : 'N/A'}</span>
                         </div>
                       </div>
                     )}
                   </CardContent>
                 </Card>

                 <Card>
                   <CardHeader>
                     <CardTitle className="text-xl">기업 프로필</CardTitle>
                   </CardHeader>
                   <CardContent>
                     {loadingMap.summary && <p className="text-sm text-gray-500">불러오는 중...</p>}
                     {errorMap.summary && (
                       <div className="text-sm text-red-500 flex items-center gap-2">
                         <span>{errorMap.summary}</span>
                         <button className="px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded" onClick={() => selectedStock && loadSummary(selectedStock.symbol)}>재시도</button>
                       </div>
                     )}
                     {!loadingMap.summary && !errorMap.summary && summaryData && (
                       <div className="space-y-2 text-sm">
                         <div>
                           <span className="text-gray-600 dark:text-gray-400">섹터:</span>
                           <span className="ml-2 font-medium">{summaryData?.assetProfile?.sector ?? 'N/A'}</span>
                         </div>
                         <div>
                           <span className="text-gray-600 dark:text-gray-400">산업:</span>
                           <span className="ml-2 font-medium">{summaryData?.assetProfile?.industry ?? 'N/A'}</span>
                         </div>
                         <div>
                           <span className="text-gray-600 dark:text-gray-400">직원 수:</span>
                           <span className="ml-2 font-medium">{summaryData?.assetProfile?.fullTimeEmployees ?? 'N/A'}</span>
                         </div>
                       </div>
                     )}
                   </CardContent>
                 </Card>
               </div>

               {/* 추가 섹션: 인사이트/뉴스, 등급 변경, SEC 공시 */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <Card>
                   <CardHeader>
                     <CardTitle className="text-xl">인사이트 / 뉴스</CardTitle>
                   </CardHeader>
                   <CardContent>
                     {/* 컨트롤 */}
                     <div className="mb-3 flex items-center gap-2 text-sm">
                       <span className="text-gray-600 dark:text-gray-400">정렬:</span>
                       <select className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1" value={newsSort} onChange={(e) => setNewsSort(e.target.value as any)}>
                         <option value="latest">최신순</option>
                         <option value="title">제목순</option>
                       </select>
                     </div>

                     {loadingMap.insights && <p className="text-sm text-gray-500">불러오는 중...</p>}
                     {errorMap.insights && (
                       <div className="text-sm text-red-500 flex items-center gap-2">
                         <span>{errorMap.insights}</span>
                         <button className="px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded" onClick={() => selectedStock && loadInsights(selectedStock.symbol)}>재시도</button>
                       </div>
                     )}
                     {!loadingMap.insights && !errorMap.insights && (
                       <>
                         <ul className="list-disc list-inside text-sm space-y-1">
                           {sortedNews.slice(0, newsLimit).map((n: any, idx: number) => (
                             <li key={idx}>
                               <a className="text-blue-600 dark:text-blue-400 hover:underline" href={n.link} target="_blank" rel="noreferrer">
                                 {n.title}
                               </a>
                             </li>
                           ))}
                           {sortedNews.length === 0 && <li className="text-gray-500">뉴스 없음</li>}
                         </ul>
                         {sortedNews.length > newsLimit && (
                           <button className="mt-3 text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded" onClick={() => setNewsLimit((v) => v + 5)}>더 보기</button>
                         )}
                       </>
                     )}
                   </CardContent>
                 </Card>

                 <Card>
                   <CardHeader>
                     <CardTitle className="text-xl">등급 변경(업/다운)</CardTitle>
                   </CardHeader>
                   <CardContent>
                     {/* 컨트롤 */}
                     <div className="mb-3 flex items-center gap-2 text-sm">
                       <span className="text-gray-600 dark:text-gray-400">필터:</span>
                       <select className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1" value={ratingsFilter} onChange={(e) => setRatingsFilter(e.target.value as any)}>
                         <option value="all">전체</option>
                         <option value="upgrade">업그레이드</option>
                         <option value="downgrade">다운그레이드</option>
                       </select>
                     </div>

                     {loadingMap.ratings && <p className="text-sm text-gray-500">불러오는 중...</p>}
                     {errorMap.ratings && (
                       <div className="text-sm text-red-500 flex items-center gap-2">
                         <span>{errorMap.ratings}</span>
                         <button className="px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded" onClick={() => selectedStock && loadRatings(selectedStock.symbol)}>재시도</button>
                       </div>
                     )}
                     {!loadingMap.ratings && !errorMap.ratings && (
                       <>
                         <ul className="list-disc list-inside text-sm space-y-1">
                           {filteredRatings.slice(0, ratingsLimit).map((r: any, idx: number) => (
                             <li key={idx}>
                               {r.firm}: {r.fromGrade} → {r.toGrade} ({r.action})
                             </li>
                           ))}
                           {filteredRatings.length === 0 && <li className="text-gray-500">데이터 없음</li>}
                         </ul>
                         {filteredRatings.length > ratingsLimit && (
                           <button className="mt-3 text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded" onClick={() => setRatingsLimit((v) => v + 5)}>더 보기</button>
                         )}
                       </>
                     )}
                   </CardContent>
                 </Card>

                 <Card>
                   <CardHeader>
                     <CardTitle className="text-xl">SEC / 공시</CardTitle>
                   </CardHeader>
                   <CardContent>
                     {/* 컨트롤 */}
                     <div className="mb-3 flex items-center gap-2 text-sm">
                       <span className="text-gray-600 dark:text-gray-400">필터:</span>
                       <select className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1" value={filingsFilter} onChange={(e) => setFilingsFilter(e.target.value as any)}>
                         <option value="all">전체</option>
                         <option value="10-K">10-K</option>
                         <option value="10-Q">10-Q</option>
                         <option value="8-K">8-K</option>
                       </select>
                     </div>

                     {loadingMap.filings && <p className="text-sm text-gray-500">불러오는 중...</p>}
                     {errorMap.filings && (
                       <div className="text-sm text-red-500 flex items-center gap-2">
                         <span>{errorMap.filings}</span>
                         <button className="px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded" onClick={() => selectedStock && loadFilings(selectedStock.symbol)}>재시도</button>
                       </div>
                     )}
                     {!loadingMap.filings && !errorMap.filings && (
                       <>
                         <ul className="list-disc list-inside text-sm space-y-1">
                           {filteredFilings.slice(0, filingsLimit).map((f: any, idx: number) => (
                             <li key={idx}>
                               {f?.type || f?.form} • {f?.date || f?.fillingDate}
                               {f?.edgarUrl && (
                                 <a className="ml-2 text-blue-600 dark:text-blue-400 hover:underline" href={f.edgarUrl} target="_blank" rel="noreferrer">다운로드</a>
                               )}
                             </li>
                           ))}
                           {filteredFilings.length === 0 && <li className="text-gray-500">데이터 없음</li>}
                         </ul>
                         {filteredFilings.length > filingsLimit && (
                           <button className="mt-3 text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded" onClick={() => setFilingsLimit((v) => v + 5)}>더 보기</button>
                         )}
                       </>
                     )}
                   </CardContent>
                 </Card>
               </div>

               {/* 재무제표 */}
               <Card>
                 <CardHeader>
                   <div className="flex items-center justify-between">
                     <CardTitle className="text-xl">재무제표</CardTitle>
                     <div className="flex items-center gap-2 text-sm">
                       <span className="text-gray-600 dark:text-gray-400">기간:</span>
                       <select
                         className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1"
                         value={financialsPeriod}
                         onChange={(e) => setFinancialsPeriod(e.target.value as 'annual' | 'quarterly')}
                       >
                         <option value="annual">연간</option>
                         <option value="quarterly">분기</option>
                       </select>
                       <button
                         className="ml-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded"
                         onClick={() => {
                           const isRows = (financialsPeriod === 'annual'
                             ? (financialsData?.incomeStatementHistory?.incomeStatementHistory || [])
                             : (financialsData?.incomeStatementHistoryQuarterly?.incomeStatementHistory || [])).slice(0, 12)
                           const rows: Array<string[]> = [[
                             'Period','Revenue','GrossProfit','OperatingIncome','EBIT','InterestExpense','NetIncome'
                           ]]
                           isRows.forEach((row: any) => rows.push([
                             row?.endDate ? new Date(row.endDate).toISOString().split('T')[0] : '',
                             String(row?.totalRevenue ?? ''),
                             String(row?.grossProfit ?? ''),
                             String(row?.operatingIncome ?? ''),
                             String(row?.ebit ?? ''),
                             String(row?.interestExpense ?? ''),
                             String(row?.netIncome ?? ''),
                           ]))
                           downloadCsv(`${selectedStock?.symbol || 'symbol'}_${financialsPeriod}_income.csv`, rows)
                         }}
                       >손익 CSV</button>
                       <button
                         className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded"
                         onClick={() => {
                           const bsRows = (financialsPeriod === 'annual'
                             ? (financialsData?.balanceSheetHistory?.balanceSheetStatements || [])
                             : (financialsData?.balanceSheetHistoryQuarterly?.balanceSheetStatements || [])).slice(0, 12)
                           const rows: Array<string[]> = [[
                             'Period','TotalAssets','TotalLiabilities','StockholderEquity'
                           ]]
                           bsRows.forEach((row: any) => rows.push([
                             row?.endDate ? new Date(row.endDate).toISOString().split('T')[0] : '',
                             String(row?.totalAssets ?? ''),
                             String(row?.totalLiab ?? ''),
                             String(row?.totalStockholderEquity ?? row?.stockholdersEquity ?? ''),
                           ]))
                           downloadCsv(`${selectedStock?.symbol || 'symbol'}_${financialsPeriod}_balance.csv`, rows)
                         }}
                       >대차 CSV</button>
                       <button
                         className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded"
                         onClick={() => {
                           const cfRows = (financialsPeriod === 'annual'
                             ? (financialsData?.cashflowStatementHistory?.cashflowStatements || [])
                             : (financialsData?.cashflowStatementHistoryQuarterly?.cashflowStatements || [])).slice(0, 12)
                           const rows: Array<string[]> = [[
                             'Period','CFO','Capex','FCF'
                           ]]
                           cfRows.forEach((row: any) => {
                             const cfo = row?.totalCashFromOperatingActivities ?? ''
                             const capex = row?.capitalExpenditures ?? ''
                             const fcf = (typeof cfo === 'number' && typeof capex === 'number') ? cfo + capex : ''
                             rows.push([
                               row?.endDate ? new Date(row.endDate).toISOString().split('T')[0] : '',
                               String(cfo), String(capex), String(fcf)
                             ])
                           })
                           downloadCsv(`${selectedStock?.symbol || 'symbol'}_${financialsPeriod}_cashflow.csv`, rows)
                         }}
                       >현금흐름 CSV</button>
                     </div>
                   </div>
                 </CardHeader>
                 <CardContent>
                   {loadingMap.financials && <p className="text-sm text-gray-500">불러오는 중...</p>}
                   {errorMap.financials && (
                     <div className="text-sm text-red-500 flex items-center gap-2">
                       <span>{errorMap.financials}</span>
                       <button className="px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded" onClick={() => selectedStock && loadFinancials(selectedStock.symbol, financialsPeriod)}>재시도</button>
                     </div>
                   )}
                   {!loadingMap.financials && !errorMap.financials && financialsData && (
                     <div className="overflow-x-auto space-y-6">
                       {/* 손익계산서 */}
                       <table className="min-w-full text-sm">
                         <thead>
                           <tr className="text-left text-gray-600 dark:text-gray-400">
                             <th className="py-2 pr-4">기간</th>
                             <th className="py-2 pr-4">매출(Revenue)</th>
                             <th className="py-2 pr-4">총이익(Gross)</th>
                             <th className="py-2 pr-4">영업이익(Operating)</th>
                             <th className="py-2 pr-4">EBIT</th>
                             <th className="py-2 pr-4">이자보상배율(ICR)</th>
                             <th className="py-2 pr-4">순이익(Net)</th>
                           </tr>
                         </thead>
                         <tbody>
                           {
                             (financialsPeriod === 'annual'
                               ? (financialsData?.incomeStatementHistory?.incomeStatementHistory || [])
                               : (financialsData?.incomeStatementHistoryQuarterly?.incomeStatementHistory || [])
                             ).slice(0, 6).map((row: any, idx: number) => {
                               const revenue = typeof row?.totalRevenue === 'number' ? row.totalRevenue : null
                               const gross = typeof row?.grossProfit === 'number' ? row.grossProfit : null
                               const op = typeof row?.operatingIncome === 'number' ? row.operatingIncome : null
                               const ebit = typeof row?.ebit === 'number' ? row.ebit : null
                               const interest = typeof row?.interestExpense === 'number' ? row.interestExpense : null
                               const icr = ebit != null && interest != null && interest !== 0 ? ebit / Math.abs(interest) : null
                               const net = typeof row?.netIncome === 'number' ? row.netIncome : null
                               return (
                                 <tr key={`is-${idx}`} className="border-t border-gray-200 dark:border-gray-700">
                                   <td className="py-2 pr-4">{row?.endDate ? new Date(row.endDate).toISOString().split('T')[0] : 'N/A'}</td>
                                   <td className="py-2 pr-4">{revenue != null ? formatVolume(revenue) : 'N/A'}</td>
                                   <td className="py-2 pr-4">{gross != null ? formatVolume(gross) : 'N/A'}</td>
                                   <td className="py-2 pr-4">{op != null ? formatVolume(op) : 'N/A'}</td>
                                   <td className="py-2 pr-4">{ebit != null ? formatVolume(ebit) : 'N/A'}</td>
                                   <td className="py-2 pr-4">{icr != null ? icr.toFixed(2) : 'N/A'}</td>
                                   <td className="py-2 pr-4">{net != null ? formatVolume(net) : 'N/A'}</td>
                                 </tr>
                               )
                             })
                           }
                         </tbody>
                       </table>

                       {/* 대차대조표 */}
                       <table className="min-w-full text-sm">
                         <thead>
                           <tr className="text-left text-gray-600 dark:text-gray-400">
                             <th className="py-2 pr-4">기간</th>
                             <th className="py-2 pr-4">총자산(Total Assets)</th>
                             <th className="py-2 pr-4">총부채(Total Liab)</th>
                             <th className="py-2 pr-4">자본(Equity)</th>
                             <th className="py-2 pr-4">부채비율(%)</th>
                           </tr>
                         </thead>
                         <tbody>
                           {
                             (financialsPeriod === 'annual'
                               ? (financialsData?.balanceSheetHistory?.balanceSheetStatements || [])
                               : (financialsData?.balanceSheetHistoryQuarterly?.balanceSheetStatements || [])
                             ).slice(0, 6).map((row: any, idx: number) => {
                               const assets = typeof row?.totalAssets === 'number' ? row.totalAssets : null
                               const liab = typeof row?.totalLiab === 'number' ? row.totalLiab : null
                               const equity = typeof row?.totalStockholderEquity === 'number'
                                 ? row.totalStockholderEquity
                                 : (typeof row?.stockholdersEquity === 'number' ? row.stockholdersEquity : null)
                               const debtRatio = assets != null && liab != null && assets !== 0 ? (liab / assets) * 100 : null
                               return (
                                 <tr key={`bs-${idx}`} className="border-t border-gray-200 dark:border-gray-700">
                                   <td className="py-2 pr-4">{row?.endDate ? new Date(row.endDate).toISOString().split('T')[0] : 'N/A'}</td>
                                   <td className="py-2 pr-4">{assets != null ? formatVolume(assets) : 'N/A'}</td>
                                   <td className="py-2 pr-4">{liab != null ? formatVolume(liab) : 'N/A'}</td>
                                   <td className="py-2 pr-4">{equity != null ? formatVolume(equity) : 'N/A'}</td>
                                   <td className="py-2 pr-4">{debtRatio != null ? debtRatio.toFixed(2) : 'N/A'}</td>
                                 </tr>
                               )
                             })
                           }
                         </tbody>
                       </table>

                       {/* 현금흐름표 */}
                       <table className="min-w-full text-sm">
                         <thead>
                           <tr className="text-left text-gray-600 dark:text-gray-400">
                             <th className="py-2 pr-4">기간</th>
                             <th className="py-2 pr-4">영업CF (CFO)</th>
                             <th className="py-2 pr-4">CAPEX</th>
                             <th className="py-2 pr-4">FCF (CFO-CAPEX)</th>
                           </tr>
                         </thead>
                         <tbody>
                           {
                             (financialsPeriod === 'annual'
                               ? (financialsData?.cashflowStatementHistory?.cashflowStatements || [])
                               : (financialsData?.cashflowStatementHistoryQuarterly?.cashflowStatements || [])
                             ).slice(0, 6).map((row: any, idx: number) => {
                               const cfo = typeof row?.totalCashFromOperatingActivities === 'number' ? row.totalCashFromOperatingActivities : null
                               const capex = typeof row?.capitalExpenditures === 'number' ? row.capitalExpenditures : null
                               const fcf = cfo != null && capex != null ? cfo + capex : null
                               return (
                                 <tr key={`cf-${idx}`} className="border-t border-gray-200 dark:border-gray-700">
                                   <td className="py-2 pr-4">{row?.endDate ? new Date(row.endDate).toISOString().split('T')[0] : 'N/A'}</td>
                                   <td className="py-2 pr-4">{cfo != null ? formatVolume(cfo) : 'N/A'}</td>
                                   <td className="py-2 pr-4">{capex != null ? formatVolume(capex) : 'N/A'}</td>
                                   <td className="py-2 pr-4">{fcf != null ? formatVolume(fcf) : 'N/A'}</td>
                                 </tr>
                               )
                             })
                           }
                         </tbody>
                       </table>
                     </div>
                   )}
                 </CardContent>
               </Card>

               {/* Key Stats */}
               <Card>
                 <CardHeader>
                   <CardTitle className="text-xl">핵심 지표(Key Stats)</CardTitle>
                 </CardHeader>
                 <CardContent>
                   {loadingMap.keyStats && <p className="text-sm text-gray-500">불러오는 중...</p>}
                   {errorMap.keyStats && (
                     <div className="text-sm text-red-500 flex items-center gap-2">
                       <span>{errorMap.keyStats}</span>
                       <button className="px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded" onClick={() => selectedStock && loadKeyStats(selectedStock.symbol)}>재시도</button>
                     </div>
                   )}
                   {!loadingMap.keyStats && !errorMap.keyStats && keyStatsData && (
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                       <div>시가총액: <span className="font-medium">{formatVolume(keyStatsData?.price?.marketCap || keyStatsData?.financialData?.marketCap)}</span></div>
                       <div>베타: <span className="font-medium">{keyStatsData?.defaultKeyStatistics?.beta ?? 'N/A'}</span></div>
                       <div>PSR(TTM): <span className="font-medium">{keyStatsData?.defaultKeyStatistics?.priceToSalesTrailing12Months ?? 'N/A'}</span></div>
                       <div>PER(TTM): <span className="font-medium">{keyStatsData?.defaultKeyStatistics?.trailingPE ?? keyStatsData?.financialData?.trailingPE ?? 'N/A'}</span></div>
                       <div>EV/EBITDA: <span className="font-medium">{keyStatsData?.defaultKeyStatistics?.enterpriseToEbitda ?? 'N/A'}</span></div>
                       <div>배당수익률: <span className="font-medium">{keyStatsData?.summaryDetail?.dividendYield ? `${(keyStatsData.summaryDetail.dividendYield * 100).toFixed(2)}%` : 'N/A'}</span></div>
                     </div>
                   )}
                 </CardContent>
               </Card>

               {/* 옵션 체인 (요약) */}
               <Card>
                 <CardHeader>
                   <CardTitle className="text-xl">옵션 체인(가까운 만기)</CardTitle>
                 </CardHeader>
                 <CardContent>
                   {loadingMap.options && <p className="text-sm text-gray-500">불러오는 중...</p>}
                   {errorMap.options && (
                     <div className="text-sm text-red-500 flex items-center gap-2">
                       <span>{errorMap.options}</span>
                       <button className="px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded" onClick={() => selectedStock && loadOptions(selectedStock.symbol)}>재시도</button>
                     </div>
                   )}
                   {!loadingMap.options && !errorMap.options && optionsData && optionsData.nearest && (
                     <div className="overflow-x-auto text-sm">
                       <div className="mb-2 text-gray-600 dark:text-gray-400">만기: {optionsData.nearest.expirationDate ? new Date(optionsData.nearest.expirationDate).toISOString().split('T')[0] : 'N/A'}</div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                           <div className="font-semibold mb-1">Calls</div>
                           <table className="min-w-full">
                             <thead>
                               <tr className="text-left"><th className="py-1 pr-3">행사가</th><th className="py-1 pr-3">가격</th><th className="py-1 pr-3">OI</th></tr>
                             </thead>
                             <tbody>
                               {(optionsData.nearest.calls || []).map((c: any, i: number) => (
                                 <tr key={`c-${i}`} className="border-t border-gray-200 dark:border-gray-700"><td className="py-1 pr-3">{c.strike}</td><td className="py-1 pr-3">{c.lastPrice ?? '-'}</td><td className="py-1 pr-3">{c.openInterest ?? '-'}</td></tr>
                               ))}
                             </tbody>
                           </table>
                         </div>
                         <div>
                           <div className="font-semibold mb-1">Puts</div>
                           <table className="min-w-full">
                             <thead>
                               <tr className="text-left"><th className="py-1 pr-3">행사가</th><th className="py-1 pr-3">가격</th><th className="py-1 pr-3">OI</th></tr>
                             </thead>
                             <tbody>
                               {(optionsData.nearest.puts || []).map((p: any, i: number) => (
                                 <tr key={`p-${i}`} className="border-t border-gray-200 dark:border-gray-700"><td className="py-1 pr-3">{p.strike}</td><td className="py-1 pr-3">{p.lastPrice ?? '-'}</td><td className="py-1 pr-3">{p.openInterest ?? '-'}</td></tr>
                               ))}
                             </tbody>
                           </table>
                         </div>
                       </div>
                     </div>
                   )}
                 </CardContent>
               </Card>

               {/* Fundamentals TimeSeries (요약) */}
               <Card>
                 <CardHeader>
                   <CardTitle className="text-xl">재무 시계열(요약)</CardTitle>
                 </CardHeader>
                 <CardContent>
                   {loadingMap.fts && <p className="text-sm text-gray-500">불러오는 중...</p>}
                   {errorMap.fts && (
                     <div className="text-sm text-red-500 flex items-center gap-2">
                       <span>{errorMap.fts}</span>
                       <button className="px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded" onClick={() => selectedStock && loadFts(selectedStock.symbol)}>재시도</button>
                     </div>
                   )}
                   {!loadingMap.fts && !errorMap.fts && ftsData && (
                     <pre className="text-xs whitespace-pre-wrap bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto">{JSON.stringify(ftsData?.timeseries?.result?.[0]?.timeSeries ?? ftsData, null, 2)}</pre>
                   )}
                 </CardContent>
               </Card>

               {/* ETF/펀드 */}
               <Card>
                 <CardHeader>
                   <CardTitle className="text-xl">ETF/펀드 정보</CardTitle>
                 </CardHeader>
                 <CardContent>
                   {loadingMap.fundFacts && <p className="text-sm text-gray-500">불러오는 중...</p>}
                   {errorMap.fundFacts && (
                     <div className="text-sm text-red-500 flex items-center gap-2">
                       <span>{errorMap.fundFacts}</span>
                       <button className="px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded" onClick={() => selectedStock && loadFundFacts(selectedStock.symbol)}>재시도</button>
                     </div>
                   )}
                   {!loadingMap.fundFacts && !errorMap.fundFacts && fundFactsData && (
                     <div className="text-sm space-y-4">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                         <div>펀드 패밀리: <span className="font-medium">{fundFactsData?.fundProfile?.family ?? 'N/A'}</span></div>
                         <div>총보수(Expense Ratio): <span className="font-medium">{fundFactsData?.fundProfile?.feesExpensesInvestment?.annualReportExpenseRatio ?? 'N/A'}</span></div>
                         <div>운용온기: <span className="font-medium">{fundFactsData?.fundProfile?.feesExpensesInvestment?.annualHoldingsTurnover ?? 'N/A'}</span></div>
                       </div>
                       <div>
                         <div className="font-semibold mb-1">상위 보유 종목</div>
                         <div className="mb-2">
                           <button
                             className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm"
                             onClick={() => {
                               const rows: Array<string[]> = [['Name','Symbol','Percent']]
                               (fundFactsData?.topHoldings?.holdings || []).slice(0, 50).forEach((h: any) => rows.push([
                                 String(h.holdingName ?? ''), String(h.symbol ?? ''),
                                 h.holdingPercent != null ? String(h.holdingPercent) : ''
                               ]))
                               downloadCsv(`${selectedStock?.symbol || 'fund'}_holdings.csv`, rows)
                             }}
                           >CSV 내보내기</button>
                         </div>
                         <ul className="list-disc list-inside space-y-1">
                           {(fundFactsData?.topHoldings?.holdings || []).slice(0, 10).map((h: any, i: number) => (
                             <li key={i}>{h.holdingName} — {h.symbol} ({h.holdingPercent ? (h.holdingPercent * 100).toFixed(2) + '%' : 'N/A'})</li>
                           ))}
                           {((fundFactsData?.topHoldings?.holdings || []).length === 0) && <li className="text-gray-500">데이터 없음</li>}
                         </ul>
                       </div>
                       <div>
                         <div className="font-semibold mb-1">성과(요약)</div>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                           <div>YTD: <span className="font-medium">{fundFactsData?.fundPerformance?.trailingReturns?.returns?.ytd ?? 'N/A'}</span></div>
                           <div>1Y: <span className="font-medium">{fundFactsData?.fundPerformance?.trailingReturns?.returns?.oneYear ?? 'N/A'}</span></div>
                           <div>3Y: <span className="font-medium">{fundFactsData?.fundPerformance?.trailingReturns?.returns?.threeYear ?? 'N/A'}</span></div>
                           <div>5Y: <span className="font-medium">{fundFactsData?.fundPerformance?.trailingReturns?.returns?.fiveYear ?? 'N/A'}</span></div>
                         </div>
                       </div>
                     </div>
                   )}
                 </CardContent>
               </Card>
             </div>
           )}
         </div>
       )}

      {/* 에러 메시지 */}
      {error && (
        <div className="text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {/* 검색 안내 */}
      {!searchQuery && searchResults.length === 0 && !selectedStock && (
        <div className="text-center text-gray-600 dark:text-gray-400">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-lg mb-2">주식 심볼이나 회사명을 검색해보세요</p>
          <p className="text-sm">예: AAPL, Apple, TSLA, Tesla</p>
        </div>
      )}
    </div>
  )
}
