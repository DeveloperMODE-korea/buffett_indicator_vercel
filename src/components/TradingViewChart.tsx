'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  HistogramData,
  // ✅ v5: 시리즈는 addSeries에 넘길 "정의"를 import해서 씁니다
  CandlestickSeries,
  HistogramSeries,
} from 'lightweight-charts'
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
]

export default function TradingViewChart({ stockData, loading = false }: TradingViewChartProps) {
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M' | '6M' | '1Y'>('1M')
  const [chartLoading, setChartLoading] = useState(false)
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null)

  // 차트 초기화
  const initializeChart = useCallback(() => {
    if (!chartContainerRef.current) return

    // 기존 차트 제거
    if (chartRef.current) {
      chartRef.current.remove()
    }

    // 새 차트 생성
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: 'rgba(197, 203, 206, 0.1)' },
        horzLines: { color: 'rgba(197, 203, 206, 0.1)' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#2962FF',
          width: 1,
          style: 3,
          labelBackgroundColor: '#2962FF',
        },
        horzLine: {
          color: '#2962FF',
          width: 1,
          style: 3,
          labelBackgroundColor: '#2962FF',
        },
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.3)',
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 12,
        barSpacing: 3,
        fixLeftEdge: true,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: true,
        borderVisible: false,
        visible: true,
        // v5의 Time 타입과 맞추려면 any 캐스팅을 쓰거나 타입 시그니처를 확장할 수 있습니다.
        tickMarkFormatter: (time: any) => {
          const t = typeof time === 'number' ? time : (time?.timestamp ?? time)
          const date = new Date((typeof t === 'number' ? t : 0) * 1000)
          return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
        },
      },
      // ✅ v5: priceScale → rightPriceScale
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.3)',
        scaleMargins: { top: 0.1, bottom: 0.2 },
        borderVisible: false,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    })

    // ✅ v5: addSeries(CandlestickSeries, options)
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderDownColor: '#ef5350',
      borderUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      wickUpColor: '#26a69a',
    })

    // ✅ v5: addSeries(HistogramSeries, options)
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#26a69a',
      priceFormat: { type: 'volume' },
      priceScaleId: '', // 별도 스케일(하단)
      scaleMargins: { top: 0.8, bottom: 0 },
    })

    chartRef.current = chart
    candlestickSeriesRef.current = candlestickSeries
    volumeSeriesRef.current = volumeSeries

    // 반응형 처리
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.resize(
          chartContainerRef.current.clientWidth,
          chartContainerRef.current.clientHeight
        )
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // 차트 데이터 가져오기
  const fetchChartData = useCallback(
    async (symbol: string, days: number) => {
      if (!symbol) return

      setChartLoading(true)
      try {
        const response = await fetch(`/api/stock-data?symbols=${symbol}&history=true&days=${days}`)
        const result = await response.json()

        if (result.success && result.data.length > 0) {
          const stock = result.data[0]
          if (stock.history && stock.history.length > 0) {
            processChartData(stock.history)
          }
        }
      } catch (error) {
        console.error('차트 데이터 가져오기 오류:', error)
      } finally {
        setChartLoading(false)
      }
    },
    [processChartData]
  )

  // 차트 데이터 처리
  const processChartData = useCallback((history: any[]) => {
    if (!candlestickSeriesRef.current || !volumeSeriesRef.current) return

    const candlestickData: CandlestickData[] = history.map((item) => ({
      time: Math.floor(new Date(item.date).getTime() / 1000),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }))

    const volumeData: HistogramData[] = history.map((item) => ({
      time: Math.floor(new Date(item.date).getTime() / 1000),
      value: item.volume,
      color: item.close >= item.open ? '#26a69a' : '#ef5350',
    }))

    candlestickSeriesRef.current.setData(candlestickData)
    volumeSeriesRef.current.setData(volumeData)

    if (chartRef.current) {
      chartRef.current.timeScale().fitContent()
    }
  }, [])

  // 차트 초기화
  useEffect(() => {
    const cleanup = initializeChart()
    return cleanup
  }, [initializeChart])

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
    }).format(value)
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
              <p>주식을 선택하면 TradingView 차트가 표시됩니다</p>
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
        <div
          ref={chartContainerRef}
          className="h-96 w-full"
          style={{ background: 'transparent', position: 'relative' }}
        />
      </CardContent>
    </Card>
  )
}
