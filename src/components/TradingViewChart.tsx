'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  HistogramData,
  CrosshairMode,
  LineStyle,
  type Time,
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
] as const

type TimeRangeValue = typeof timeRangeOptions[number]['value']

export default function TradingViewChart({ stockData, loading = false }: TradingViewChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRangeValue>('1M')
  const [chartLoading, setChartLoading] = useState(false)
  const [chartError, setChartError] = useState<string | null>(null)
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  // 차트 정리 함수
  const cleanupChart = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.remove()
      chartRef.current = null
    }
    candlestickSeriesRef.current = null
    volumeSeriesRef.current = null
  }, [])

  // 차트 초기화
  const initializeChart = useCallback(() => {
    if (!chartContainerRef.current) return

    // 기존 차트 제거
    cleanupChart()

    try {
      // 새 차트 생성
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#d1d5db',
        },
        grid: {
          vertLines: { color: 'rgba(197, 203, 206, 0.1)' },
          horzLines: { color: 'rgba(197, 203, 206, 0.1)' },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            color: '#2962FF',
            width: 1,
            style: LineStyle.Dashed,
            labelBackgroundColor: '#2962FF',
          },
          horzLine: {
            color: '#2962FF',
            width: 1,
            style: LineStyle.Dashed,
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
          tickMarkFormatter: (time: Time) => {
            try {
              if (typeof time === 'number') {
                const date = new Date(time * 1000)
                return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
              } else if (typeof time === 'object' && 'year' in time && 'month' in time && 'day' in time) {
                const date = new Date(Date.UTC(time.year, time.month - 1, time.day))
                return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
              }
              return ''
            } catch (error) {
              console.error('Date formatting error:', error)
              return ''
            }
          },
        },
        rightPriceScale: {
          borderColor: 'rgba(197, 203, 206, 0.3)',
          scaleMargins: { top: 0.1, bottom: 0.2 },
          borderVisible: false,
        },
        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
          horzTouchDrag: true,
          vertTouchDrag: false,
        },
        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true,
        },
      })

      // 캔들스틱 시리즈 추가
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderDownColor: '#ef5350',
        borderUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        wickUpColor: '#26a69a',
      })

      // 볼륨 시리즈 추가
      const volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: { type: 'volume' },
        priceScaleId: '',
      })

      // 하단 거래량 패널 여백
      volumeSeries.priceScale().applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
      })

      chartRef.current = chart
      candlestickSeriesRef.current = candlestickSeries
      volumeSeriesRef.current = volumeSeries

      // ResizeObserver로 반응형 처리
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }

      resizeObserverRef.current = new ResizeObserver((entries) => {
        if (entries.length > 0 && chartRef.current) {
          const { width, height } = entries[0].contentRect
          chartRef.current.resize(width, height)
        }
      })

      resizeObserverRef.current.observe(chartContainerRef.current)

    } catch (error) {
      console.error('Chart initialization error:', error)
      setChartError('차트 초기화 중 오류가 발생했습니다.')
    }
  }, [cleanupChart])

  // 차트 데이터 처리
  const processChartData = useCallback((history: StockData['history']) => {
    if (!candlestickSeriesRef.current || !volumeSeriesRef.current || !history) return

    try {
      // 데이터 정렬 (오래된 날짜부터)
      const sortedHistory = [...history].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )

      // 캔들스틱 데이터
      const candlestickData: CandlestickData<Time>[] = sortedHistory
        .filter(item => 
          item.open != null && 
          item.high != null && 
          item.low != null && 
          item.close != null
        )
        .map((item) => ({
          time: Math.floor(new Date(item.date).getTime() / 1000) as Time,
          open: Number(item.open),
          high: Number(item.high),
          low: Number(item.low),
          close: Number(item.close),
        }))

      // 볼륨 데이터
      const volumeData: HistogramData<Time>[] = sortedHistory
        .filter(item => item.volume != null)
        .map((item) => ({
          time: Math.floor(new Date(item.date).getTime() / 1000) as Time,
          value: Number(item.volume),
          color: item.close >= item.open ? '#26a69a' : '#ef5350',
        }))

      if (candlestickData.length > 0) {
        candlestickSeriesRef.current.setData(candlestickData)
      }
      
      if (volumeData.length > 0) {
        volumeSeriesRef.current.setData(volumeData)
      }

      if (chartRef.current && candlestickData.length > 0) {
        chartRef.current.timeScale().fitContent()
      }

      setChartError(null)
    } catch (error) {
      console.error('Chart data processing error:', error)
      setChartError('차트 데이터 처리 중 오류가 발생했습니다.')
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
          }
        } else {
          setChartError('데이터를 가져올 수 없습니다.')
        }
      } catch (error) {
        console.error('차트 데이터 가져오기 오류:', error)
        setChartError('데이터를 가져오는 중 오류가 발생했습니다.')
      } finally {
        setChartLoading(false)
      }
    },
    [processChartData]
  )

  // 차트 초기화
  useEffect(() => {
    initializeChart()
    
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
        resizeObserverRef.current = null
      }
      cleanupChart()
    }
  }, [initializeChart, cleanupChart])

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
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
        <div
          ref={chartContainerRef}
          className="h-96 w-full"
          style={{ background: 'transparent', position: 'relative' }}
        />
      </CardContent>
    </Card>
  )
}