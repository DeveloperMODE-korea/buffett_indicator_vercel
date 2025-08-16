'use client'

import { useEffect, useRef, useState } from 'react'
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
  TooltipItem,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'
import { ChartDataPoint } from '@/types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
)

interface Props {
  loading: boolean
}

export default function BuffettChart({ loading }: Props) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [timeRange, setTimeRange] = useState<'1Y' | '5Y' | '10Y' | 'ALL'>('5Y')

  useEffect(() => {
    // 임시 mock 데이터 - 실제로는 API에서 가져올 예정
    const mockData: ChartDataPoint[] = []
    const startYear = timeRange === '1Y' ? 2023 : timeRange === '5Y' ? 2019 : timeRange === '10Y' ? 2014 : 2000
    const currentYear = 2024
    
    for (let year = startYear; year <= currentYear; year++) {
      for (let month = 0; month < 12; month++) {
        const date = new Date(year, month, 1)
        // 가상의 버핏 지수 데이터 (실제로는 API에서 계산됨)
        const baseValue = 100 + Math.sin((year - 2000) * 0.3) * 50 + Math.random() * 30
        mockData.push({
          x: date,
          y: Math.max(50, baseValue)
        })
      }
    }
    
    setChartData(mockData)
  }, [timeRange])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `버핏 지수 추이 (${timeRange})`,
        font: {
          size: 16,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: TooltipItem<'line'>) {
            return `버핏 지수: ${context.parsed.y.toFixed(1)}%`
          },
        },
      },
    },
    hover: {
      mode: 'nearest' as const,
      intersect: true,
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: timeRange === '1Y' ? 'month' : timeRange === '5Y' ? 'year' : 'year',
        },
        title: {
          display: true,
          text: '기간',
        },
      },
      y: {
        title: {
          display: true,
          text: '버핏 지수 (%)',
        },
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return value + '%'
          },
        },
      },
    },
    elements: {
      point: {
        radius: timeRange === '1Y' ? 3 : 1,
        hoverRadius: 5,
      },
    },
  }

  const data = {
    datasets: [
      {
        label: '버핏 지수',
        data: chartData,
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.1,
      },
      // 기준선들
      {
        label: '저평가 기준 (70%)',
        data: chartData.map(point => ({ x: point.x, y: 70 })),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 1,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
      },
      {
        label: '고평가 기준 (120%)',
        data: chartData.map(point => ({ x: point.x, y: 120 })),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 1,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
      },
    ],
  }

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">차트 데이터를 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div>
      {/* 시간 범위 선택 버튼 */}
      <div className="flex space-x-2 mb-4">
        {(['1Y', '5Y', '10Y', 'ALL'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              timeRange === range
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* 차트 */}
      <div className="h-96">
        <Line options={chartOptions} data={data} />
      </div>

      {/* 차트 설명 */}
      <div className="mt-4 text-sm text-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-green-500 mr-2"></div>
            <span>저평가 기준선 (70%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-red-500 mr-2"></div>
            <span>고평가 기준선 (120%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-blue-500 mr-2"></div>
            <span>현재 버핏 지수</span>
          </div>
        </div>
      </div>
    </div>
  )
}
