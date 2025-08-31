'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ReferenceLine,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  history?: Array<{
    date: string
    open: number
    high: number
    low: number
    close: number
    volume: number
  }>
}

interface TradingViewChartProps {
  stockData: StockData | null
  loading?: boolean
}

const timeRangeOptions = [
  { value: '1D', label: '1일', days: 1 },
  { value: '1W', label: '1주', days: 7 },
  { value: '1M', label: '1개월', days: 30 },
  { value: '3M', label: '3개월', days: 90 },
  { value: '6M', label: '6개월', days: 180 },
  { value: '1Y', label: '1년', days: 365 },
] as const

type TimeRangeValue = typeof timeRangeOptions[number]['value']

export default function TradingViewChart({ stockData, loading = false }: TradingViewChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRangeValue>('1M')
  const [chartLoading, setChartLoading] = useState(false)
  const [chartError, setChartError] = useState<string | null>(null)
  const [chartData, setChartData] = useState<any[]>([])

  // 차트 데이터 처리
  const processChartData = useCallback((history: StockData['history']) => {
    if (!history || history.length === 0) {
      setChartData([])
      return
    }

    try {
      // 데이터 정렬 및 변환
      const sortedData = [...history]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(item => ({
          date: new Date(item.date).toLocaleDateString('ko-KR', { 
            month: 'short', 
            day: 'numeric' 
          }),
          fullDate: item.date,
          open: Number(item.open),
          high: Number(item.high),
          low: Number(item.low),
          close: Number(item.close),
          volume: Number(item.volume),
          // 캔들 색상 결정
          fill: item.close >= item.open ? '#26a69a' : '#ef5350',
          // 가격 범위 (캔들스틱 시뮬레이션용)
          priceRange: [Number(item.low), Number(item.high)],
        }))

      setChartData(sortedData)
      setChartError(null)
    } catch (error) {
      console.error('Chart data processing error:', error)
      setChartError('차트 데이터 처리 중 오류가 발생했습니다.')
      setChartData([])
    }
  }, [])

  // 차트 데이터 가져오기
  const fetchChartData = useCallback(
    async (symbol: string, days: number) => {
      if (!symbol) return

      setChartLoading(true)
      setChartError(null)
      
      try {
        const response = await fetch(`/api/stock-data?symbols=${symbol}&history=true&days=${days}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()

        if (result.success && result.data?.length > 0) {
          const stock = result.data[0]
          if (stock.history && stock.history.length > 0) {
            processChartData(stock.history)
          } else {
            setChartError('히스토리 데이터가 없습니다.')
            setChartData([])
          }
        } else {
          setChartError('데이터를 가져올 수 없습니다.')
          setChartData([])
        }
      } catch (error) {
        console.error('차트 데이터 가져오기 오류:', error)
        setChartError('데이터를 가져오는 중 오류가 발생했습니다.')
        setChartData([])
      } finally {
        setChartLoading(false)
      }
    },
    [processChartData]
  )

  // 시간 범위 변경 시 차트 데이터 새로 가져오기
  useEffect(() => {
    if (stockData?.symbol) {
      const selectedRange = timeRangeOptions.find((option) => option.value === timeRange)
      if (selectedRange) {
        fetchChartData(stockData.symbol, selectedRange.days)
      }
    }
  }, [stockData?.symbol, timeRange, fetchChartData])

  // 초기 차트 데이터 설정
  useEffect(() => {
    if (stockData?.history && stockData.history.length > 0) {
      processChartData(stockData.history)
    }
  }, [stockData, processChartData])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatVolume = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return value.toString()
  }

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold mb-2">{label}</p>
          <div className="space-y-1 text-xs">
            <p>시가: <span className="font-mono">{formatCurrency(data.open)}</span></p>
            <p>고가: <span className="font-mono">{formatCurrency(data.high)}</span></p>
            <p>저가: <span className="font-mono">{formatCurrency(data.low)}</span></p>
            <p>종가: <span className={`font-mono ${data.fill === '#26a69a' ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(data.close)}
            </span></p>
            <p>거래량: <span className="font-mono">{formatVolume(data.volume)}</span></p>
          </div>
        </div>
      )
    }
    return null
  }

  if (loading || chartLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">TradingView 차트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">차트를 불러오는 중...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (chartError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">TradingView 차트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="text-center text-red-500">
              <div className="text-4xl mb-2">⚠️</div>
              <p>{chartError}</p>
              <button
                onClick={() => {
                  setChartError(null)
                  if (stockData?.symbol) {
                    const selectedRange = timeRangeOptions.find((option) => option.value === timeRange)
                    if (selectedRange) {
                      fetchChartData(stockData.symbol, selectedRange.days)
                    }
                  }
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                다시 시도
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stockData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">TradingView 차트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">📊</div>
              <p>주식을 선택하면 차트가 표시됩니다</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 평균 가격 계산 (참조선용)
  const avgPrice = chartData.length > 0 
    ? chartData.reduce((sum, item) => sum + item.close, 0) / chartData.length 
    : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle className="text-lg">
              {stockData.name} ({stockData.symbol})
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              현재가: {formatCurrency(stockData.price)}
              <span className={`ml-2 ${stockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stockData.change >= 0 ? '+' : ''}
                {stockData.change.toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-1">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeRange === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                disabled={chartLoading}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="space-y-4">
            {/* 가격 차트 */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">가격</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                    domain={['dataMin - 5', 'dataMax + 5']}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {/* 평균선 */}
                  <ReferenceLine 
                    y={avgPrice} 
                    stroke="#fbbf24" 
                    strokeDasharray="5 5" 
                    label={{ value: "평균", position: "right", fill: "#fbbf24", fontSize: 12 }}
                  />
                  
                  {/* 가격 영역 차트 */}
                  <Area
                    type="monotone"
                    dataKey="close"
                    fill="#3b82f6"
                    fillOpacity={0.1}
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                  
                  {/* 고가/저가 범위 */}
                  {chartData.map((entry, index) => (
                    <ReferenceLine
                      key={`range-${index}`}
                      segment={[
                        { x: entry.date, y: entry.low },
                        { x: entry.date, y: entry.high }
                      ]}
                      stroke={entry.fill}
                      strokeWidth={1}
                      opacity={0.5}
                    />
                  ))}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* 거래량 차트 */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">거래량</h3>
              <ResponsiveContainer width="100%" height={100}>
                <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }}
                    stroke="#9ca3af"
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    stroke="#9ca3af"
                    tickFormatter={formatVolume}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-xs">거래량: {formatVolume(payload[0].value as number)}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar 
                    dataKey="volume" 
                    fill="#26a69a"
                    opacity={0.8}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>차트 데이터가 없습니다</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}