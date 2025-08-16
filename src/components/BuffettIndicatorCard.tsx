'use client'

import { BuffettIndicatorData } from '@/types'

interface Props {
  data: BuffettIndicatorData | null
  loading: boolean
  error: string | null
}

export default function BuffettIndicatorCard({ data, loading, error }: Props) {
  if (loading) {
    return (
      <div className="card p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
          <div className="h-16 bg-gray-300 rounded w-32 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-300 rounded w-64 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-8 border-red-200 bg-red-50">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-2">
            오류가 발생했습니다
          </div>
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'undervalued':
        return {
          text: '저평가',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        }
      case 'fair':
        return {
          text: '적정가치',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        }
      case 'overvalued':
        return {
          text: '고평가',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        }
      default:
        return {
          text: '분석중',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        }
    }
  }

  const statusInfo = getStatusInfo(data.status)
  const changeColor = data.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
  const changeIcon = data.changePercent >= 0 ? '↗' : '↘'

  return (
    <div className={`card p-8 ${statusInfo.bgColor} ${statusInfo.borderColor} border-2`}>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          현재 버핏 지수
        </h3>
        
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="text-5xl font-bold text-gray-900">
            {data.currentValue.toFixed(1)}%
          </div>
          <div className={`text-2xl font-semibold ${changeColor}`}>
            {changeIcon} {Math.abs(data.changePercent).toFixed(1)}%
          </div>
        </div>

        <div className={`inline-flex items-center px-4 py-2 rounded-full ${statusInfo.bgColor} ${statusInfo.borderColor} border`}>
          <span className={`text-lg font-semibold ${statusInfo.color}`}>
            시장 상태: {statusInfo.text}
          </span>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          마지막 업데이트: {new Date(data.lastUpdated).toLocaleString('ko-KR')}
        </div>

        {/* 해석 가이드 */}
        <div className="mt-6 text-left max-w-2xl mx-auto">
          <h4 className="font-semibold text-gray-700 mb-2">📝 해석 가이드</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>• <strong>70% 미만</strong>: 저평가 상태 (매수 기회)</div>
            <div>• <strong>70% - 120%</strong>: 적정가치 범위</div>
            <div>• <strong>120% 초과</strong>: 고평가 상태 (주의 필요)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
