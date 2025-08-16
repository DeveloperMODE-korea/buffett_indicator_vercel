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
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-48 mx-auto mb-4"></div>
          <div className="h-16 bg-gray-300 dark:bg-gray-600 rounded w-32 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-64 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-8 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 transition-colors">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-xl font-semibold mb-2 transition-colors">
            오류가 발생했습니다
          </div>
          <div className="text-red-500 dark:text-red-300 transition-colors">{error}</div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const getStatusInfo = (value: number, status: string) => {
    // Python 버전과 동일한 세밀한 해석 기준 적용 (다크모드 지원)
    if (value < 75) {
      return {
        text: '현저한 저평가',
        color: 'text-green-700 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-300 dark:border-green-700',
        emoji: '🟢'
      }
    } else if (value < 90) {
      return {
        text: '적정가치',
        color: 'text-blue-700 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-300 dark:border-blue-700',
        emoji: '🔵'
      }
    } else if (value < 115) {
      return {
        text: '다소 고평가',
        color: 'text-yellow-700 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-300 dark:border-yellow-700',
        emoji: '🟡'
      }
    } else if (value < 140) {
      return {
        text: '현저한 고평가',
        color: 'text-orange-700 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        borderColor: 'border-orange-300 dark:border-orange-700',
        emoji: '🟠'
      }
    } else {
      return {
        text: '극도 고평가',
        color: 'text-red-700 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-300 dark:border-red-700',
        emoji: '🔴'
      }
    }
  }

  const statusInfo = getStatusInfo(data.currentValue, data.status)

  return (
    <div className={`card p-8 ${statusInfo.bgColor} ${statusInfo.borderColor} border-2 transition-colors`}>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
          현재 버핏 지수
        </h3>
        
        <div className="text-center mb-4">
          <div className="text-6xl font-bold text-gray-900 dark:text-white transition-colors">
            {data.currentValue.toFixed(1)}%
          </div>
        </div>

        <div className={`inline-flex items-center px-4 py-2 rounded-full ${statusInfo.bgColor} ${statusInfo.borderColor} border transition-colors`}>
          <span className={`text-lg font-semibold ${statusInfo.color} transition-colors`}>
            {statusInfo.emoji} 시장 상태: {statusInfo.text}
          </span>
        </div>

        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 transition-colors">
          마지막 업데이트: {new Date(data.lastUpdated).toLocaleString('ko-KR')}
        </div>

        {/* 해석 가이드 (Python 버전 기준) */}
        <div className="mt-6 text-left max-w-3xl mx-auto">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 transition-colors">📝 해석 가이드 (워렌 버핏 기준)</h4>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2 transition-colors">
            <div className="flex items-center">
              <span className="mr-2">🟢</span>
              <strong className="text-gray-900 dark:text-gray-100 transition-colors">75% 미만</strong>: 현저한 저평가 상태 (매수 기회)
            </div>
            <div className="flex items-center">
              <span className="mr-2">🔵</span>
              <strong className="text-gray-900 dark:text-gray-100 transition-colors">75% - 90%</strong>: 적정가치 범위
            </div>
            <div className="flex items-center">
              <span className="mr-2">🟡</span>
              <strong className="text-gray-900 dark:text-gray-100 transition-colors">90% - 115%</strong>: 다소 고평가 상태
            </div>
            <div className="flex items-center">
              <span className="mr-2">🟠</span>
              <strong className="text-gray-900 dark:text-gray-100 transition-colors">115% - 140%</strong>: 현저한 고평가 상태 (주의 필요)
            </div>
            <div className="flex items-center">
              <span className="mr-2">🔴</span>
              <strong className="text-gray-900 dark:text-gray-100 transition-colors">140% 초과</strong>: 극도 고평가 상태 (매우 주의)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
