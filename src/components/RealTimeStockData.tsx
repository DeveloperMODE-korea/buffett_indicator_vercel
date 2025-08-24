'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

interface MarketIndex {
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
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
  exchange: string
  currency: string
  marketState: string
  lastUpdated: string
}

export default function RealTimeStockData() {
  const [stockData, setStockData] = useState<StockData[]>([])
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchStockData = async () => {
    try {
      setError(null)
      
      // 주식 데이터 가져오기
      const stockResponse = await fetch('/api/stock-data?symbols=AAPL,GOOGL,MSFT,TSLA,NVDA,AMZN,META,BRK-B,JPM,V')
      const stockResult = await stockResponse.json()
      
      if (stockResult.success) {
        setStockData(stockResult.data)
      } else {
        console.error('주식 데이터 오류:', stockResult.error)
      }

      // 시장 지수 데이터 가져오기
      const indicesResponse = await fetch('/api/market-indices')
      const indicesResult = await indicesResponse.json()
      
      if (indicesResult.success) {
        setMarketIndices(indicesResult.data)
      } else {
        console.error('시장 지수 데이터 오류:', indicesResult.error)
      }

      setLastUpdate(new Date())
    } catch (err) {
      console.error('데이터 가져오기 오류:', err)
      setError('데이터를 가져오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStockData()
    
    // 30초마다 데이터 업데이트
    const interval = setInterval(fetchStockData, 30000)
    
    return () => clearInterval(interval)
  }, [])

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">실시간 데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400">
        <p>{error}</p>
        <button 
          onClick={fetchStockData}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 시장 지수 */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          📊 주요 시장 지수
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketIndices.map((index) => (
            <Card key={index.symbol} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
                  {index.name}
                </CardTitle>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {index.symbol} • {index.exchange}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(index.price, index.currency)}
                    </span>
                    <span className={`text-sm font-medium ${getChangeColor(index.change)}`}>
                      {getChangeIcon(index.change)} {formatNumber(index.change, 2)} ({formatNumber(index.changePercent, 2)}%)
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <div className="flex justify-between">
                      <span>고가:</span>
                      <span>{formatCurrency(index.high, index.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>저가:</span>
                      <span>{formatCurrency(index.low, index.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>거래량:</span>
                      <span>{formatVolume(index.volume)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 주식 데이터 */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          📈 주요 주식
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stockData.map((stock) => (
            <Card key={stock.symbol} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
                  {stock.name}
                </CardTitle>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stock.symbol} • {stock.exchange}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(stock.price, stock.currency)}
                    </span>
                    <span className={`text-sm font-medium ${getChangeColor(stock.change)}`}>
                      {getChangeIcon(stock.change)} {formatNumber(stock.change, 2)} ({formatNumber(stock.changePercent, 2)}%)
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <div className="flex justify-between">
                      <span>시가총액:</span>
                      <span>{formatVolume(stock.marketCap)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>P/E 비율:</span>
                      <span>{stock.peRatio ? formatNumber(stock.peRatio, 2) : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>배당 수익률:</span>
                      <span>{stock.dividendYield ? `${formatNumber(stock.dividendYield, 2)}%` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>거래량:</span>
                      <span>{formatVolume(stock.volume)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 마지막 업데이트 */}
      {lastUpdate && (
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          마지막 업데이트: {lastUpdate.toLocaleString('ko-KR')}
        </div>
      )}
    </div>
  )
}
