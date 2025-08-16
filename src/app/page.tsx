'use client'

import { useState, useEffect } from 'react'
import BuffettIndicatorCard from '@/components/BuffettIndicatorCard'
import BuffettChart from '@/components/BuffettChart'
import InfoSection from '@/components/InfoSection'

export default function Home() {
  const [indicatorData, setIndicatorData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // API 데이터 로딩 로직은 나중에 구현
    const mockData = {
      currentValue: 185.2,
      changePercent: 2.3,
      lastUpdated: new Date().toISOString(),
      status: 'overvalued' as const
    }
    
    setTimeout(() => {
      setIndicatorData(mockData)
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          미국 버핏 지수 실시간 관측
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          총 시가총액 대비 GDP 비율로 계산되는 버핏 지수를 통해 미국 주식시장의 
          과대평가/과소평가 상태를 실시간으로 확인하세요.
        </p>
      </div>

      {/* Current Indicator */}
      <section id="indicator" className="mb-12">
        <BuffettIndicatorCard 
          data={indicatorData} 
          loading={loading} 
          error={error} 
        />
      </section>

      {/* Chart Section */}
      <section id="chart" className="mb-12">
        <div className="card p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            버핏 지수 추이 차트
          </h3>
          <BuffettChart loading={loading} />
        </div>
      </section>

      {/* Info Section */}
      <section id="info">
        <InfoSection />
      </section>
    </div>
  )
}
