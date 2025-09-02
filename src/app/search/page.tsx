'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TradingViewChart from '@/components/TradingViewChart'

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
  const [detailLoading, setDetailLoading] = useState(false)

  // 인기 검색어
  const popularSearches = [
    'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'AMZN', 'META', 'BRK-B', 'JPM', 'V',
    'SPY', 'QQQ', 'VTI', 'VOO', 'IWM', 'GLD', 'TLT', 'BTC-USD', 'ETH-USD'
  ]

  // 검색 실행
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/stock-search?query=${encodeURIComponent(query)}`)
      const result = await response.json()

      if (result.success) {
        setSearchResults(result.data)
      } else {
        setError(result.error || '검색 중 오류가 발생했습니다.')
        setSearchResults([])
      }
    } catch (err) {
      console.error('검색 오류:', err)
      setError('검색 중 오류가 발생했습니다.')
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  // 주식 데이터 가져오기
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

  // 선택 종목 상세 병렬 로드 (기존 + 뉴스/등급/공시)
  useEffect(() => {
    const loadDetails = async () => {
      if (!selectedStock?.symbol) return
      setDetailLoading(true)
      setEarningsData(null)
      setAnalystData(null)
      setOwnershipData(null)
      setSummaryData(null)
      setInsightsData(null)
      setRatingsData(null)
      setFilingsData(null)

      try {
        const symbol = selectedStock.symbol
        const [earningsRes, analystRes, ownershipRes, summaryRes, insightsRes, ratingsRes, filingsRes] = await Promise.all([
          fetch(`/api/earnings?symbols=${symbol}`),
          fetch(`/api/analyst?symbols=${symbol}`),
          fetch(`/api/ownership?symbols=${symbol}`),
          fetch(`/api/summary?symbols=${symbol}&modules=price,summaryDetail,financialData,assetProfile`),
          fetch(`/api/insights?symbols=${symbol}`),
          fetch(`/api/ratings?symbols=${symbol}`),
          fetch(`/api/sec-filings?symbols=${symbol}`),
        ])

        const [earningsJson, analystJson, ownershipJson, summaryJson, insightsJson, ratingsJson, filingsJson] = await Promise.all([
          earningsRes.json(),
          analystRes.json(),
          ownershipRes.json(),
          summaryRes.json(),
          insightsRes.json(),
          ratingsRes.json(),
          filingsRes.json(),
        ])

        if (earningsJson?.success && earningsJson.data?.length) setEarningsData(earningsJson.data[0])
        if (analystJson?.success && analystJson.data?.length) setAnalystData(analystJson.data[0])
        if (ownershipJson?.success && ownershipJson.data?.length) setOwnershipData(ownershipJson.data[0])
        if (summaryJson?.success && summaryJson.data?.length) setSummaryData(summaryJson.data[0])
        if (insightsJson?.success && insightsJson.data?.length) setInsightsData(insightsJson.data[0])
        if (ratingsJson?.success && ratingsJson.data?.length) setRatingsData(ratingsJson.data[0])
        if (filingsJson?.success && filingsJson.data?.length) setFilingsData(filingsJson.data[0])
      } catch (e) {
        console.error('상세 데이터 로드 오류:', e)
      } finally {
        setDetailLoading(false)
      }
    }

    loadDetails()
  }, [selectedStock?.symbol])

  // 검색어 변경 시 자동 검색
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery)
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

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
                     <div className="flex justify-between items-center">
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
                     {detailLoading && <p className="text-sm text-gray-500">불러오는 중...</p>}
                     {!detailLoading && earningsData && (
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
                     {detailLoading && <p className="text-sm text-gray-500">불러오는 중...</p>}
                     {!detailLoading && analystData && (
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
                     {detailLoading && <p className="text-sm text-gray-500">불러오는 중...</p>}
                     {!detailLoading && ownershipData && (
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
                     {detailLoading && <p className="text-sm text-gray-500">불러오는 중...</p>}
                     {!detailLoading && summaryData && (
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
                     {detailLoading && <p className="text-sm text-gray-500">불러오는 중...</p>}
                     {!detailLoading && insightsData && (
                       <ul className="list-disc list-inside text-sm space-y-1">
                         {(insightsData?.news ?? []).slice(0, 5).map((n: any, idx: number) => (
                           <li key={idx}>
                             <a className="text-blue-600 dark:text-blue-400 hover:underline" href={n.link} target="_blank" rel="noreferrer">
                               {n.title}
                             </a>
                           </li>
                         ))}
                         {(insightsData?.news ?? []).length === 0 && <li className="text-gray-500">뉴스 없음</li>}
                       </ul>
                     )}
                   </CardContent>
                 </Card>

                 <Card>
                   <CardHeader>
                     <CardTitle className="text-xl">등급 변경(업/다운)</CardTitle>
                   </CardHeader>
                   <CardContent>
                     {detailLoading && <p className="text-sm text-gray-500">불러오는 중...</p>}
                     {!detailLoading && ratingsData && (
                       <ul className="list-disc list-inside text-sm space-y-1">
                         {(ratingsData?.history ?? []).slice(0, 5).map((r: any, idx: number) => (
                           <li key={idx}>
                             {r.firm}: {r.fromGrade} → {r.toGrade} ({r.action})
                           </li>
                         ))}
                         {!(ratingsData?.history ?? []).length && <li className="text-gray-500">데이터 없음</li>}
                       </ul>
                     )}
                   </CardContent>
                 </Card>

                 <Card>
                   <CardHeader>
                     <CardTitle className="text-xl">SEC / 공시</CardTitle>
                   </CardHeader>
                   <CardContent>
                     {detailLoading && <p className="text-sm text-gray-500">불러오는 중...</p>}
                     {!detailLoading && filingsData && (
                       <ul className="list-disc list-inside text-sm space-y-1">
                         {(filingsData?.filings ?? filingsData?.filingsRecent ?? [])?.slice(0, 5).map((f: any, idx: number) => (
                           <li key={idx}>
                             {f?.type || f?.form} • {f?.date || f?.fillingDate}
                           </li>
                         ))}
                         {!((filingsData?.filings ?? filingsData?.filingsRecent ?? []).length) && <li className="text-gray-500">데이터 없음</li>}
                       </ul>
                     )}
                   </CardContent>
                 </Card>
               </div>
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
