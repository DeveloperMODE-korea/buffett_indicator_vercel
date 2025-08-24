'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
)

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

interface StockChartProps {
  stockData: StockData | null
  loading?: boolean
}

export default function StockChart({ stockData, loading = false }: StockChartProps) {
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M' | '6M' | '1Y'>('1M')
  const [chartData, setChartData] = useState<any>(null)
  const [chartLoading, setChartLoading] = useState(false)
  const chartRef = useRef<ChartJS<'line'>>(null)

  const timeRangeOptions = [
    { value: '1D', label: '1일', days: 1 },
    { value: '1W', label: '1주', days: 7 },
    { value: '1M', label: '1개월', days: 30 },
    { value: '3M', label: '3개월', days: 90 },
    { value: '6M', label: '6개월', days: 180 },
    { value: '1Y', label: '1년', days: 365 }
  ]

  // 차트 데이터 가져오기
  const fetchChartData = useCallback(async (symbol: string, days: number) => {
    if (!symbol) return

    setChartLoading(true)
    try {
      const response = await fetch(`/api/stock-data?symbols=${symbol}&history=true&days=${days}`)
      const result = await response.json()

      if (result.success && result.data.length > 0) {
        const stock = result.data[0]
        if (stock.history && stock.history.length > 0) {
          processChartData(stock.history, stock.symbol, stock.name)
        }
      }
    } catch (error) {
      console.error('차트 데이터 가져오기 오류:', error)
    } finally {
      setChartLoading(false)
    }
  }, [])

  // 차트 데이터 처리
  const processChartData = (history: any[], symbol: string, name: string) => {
    const labels = history.map(item => new Date(item.date))
    const prices = history.map(item => item.close)
    const volumes = history.map(item => item.volume)

    // 가격 변화율 계산
    const priceChanges = prices.map((price, index) => {
      if (index === 0) return 0
      return ((price - prices[index - 1]) / prices[index - 1]) * 100
    })

    // 색상 결정 (전체 기간 기준)
    const firstPrice = prices[0]
    const lastPrice = prices[prices.length - 1]
    const isPositive = lastPrice >= firstPrice

    const data = {
      labels,
      datasets: [
        {
          label: '주가',
          data: prices,
          borderColor: isPositive ? '#10B981' : '#EF4444',
          backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: isPositive ? '#10B981' : '#EF4444',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2,
        }
      ]
    }

    setChartData(data)
  }

  // 시간 범위 변경 시 차트 데이터 새로 가져오기
  useEffect(() => {
    if (stockData?.symbol) {
      const selectedRange = timeRangeOptions.find(option => option.value === timeRange)
      if (selectedRange) {
        fetchChartData(stockData.symbol, selectedRange.days)
      }
    }
  }, [stockData?.symbol, timeRange, fetchChartData])

  // 초기 차트 데이터 설정
  useEffect(() => {
    if (stockData?.history && stockData.history.length > 0) {
      processChartData(stockData.history, stockData.symbol, stockData.name)
    }
  }, [stockData])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value)
  }

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`
    return value.toString()
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context: any) => {
            const date = new Date(context[0].label)
            return date.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })
          },
          label: (context: any) => {
            return `주가: ${formatCurrency(context.parsed.y)}`
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: (timeRange === '1D' ? 'hour' : 'day') as 'hour' | 'day',
          displayFormats: {
            hour: 'HH:mm',
            day: 'MM/dd',
            week: 'MM/dd',
            month: 'MM/dd'
          }
        },
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          }
        }
      },
      y: {
        position: 'right' as const,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          },
          callback: (value: any) => formatCurrency(value)
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 6,
        hoverBorderWidth: 2,
      }
    }
  }

  if (loading || chartLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">주가 차트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">차트를 불러오는 중...</p>
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
          <CardTitle className="text-lg">주가 차트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">📊</div>
              <p>주식을 선택하면 차트가 표시됩니다</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">{stockData.name} ({stockData.symbol})</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              현재가: {formatCurrency(stockData.price)} 
              <span className={`ml-2 ${stockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
              </span>
            </p>
          </div>
          <div className="flex space-x-1">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value as any)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeRange === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {chartData ? (
            <Line ref={chartRef} data={chartData} options={chartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              차트 데이터를 불러올 수 없습니다
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
