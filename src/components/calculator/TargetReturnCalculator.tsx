'use client';

import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import InputField from '@/components/ui/InputField';
import ResultCard from '@/components/ui/ResultCard';
import {
  calculateTargetReturn,
  formatKoreanCurrency,
} from '@/lib/calculator-utils';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TargetReturnCalculator() {
  const [inputs, setInputs] = useState({
    currentAsset: 5000000, // 현재 자산 (500만원)
    targetAsset: 100000000, // 목표 자산 (1억원)
    years: 10, // 투자 기간 (10년)
    monthlyContribution: 1000000, // 월 추가 투자금 (100만원)
  });

  const [result, setResult] = useState(calculateTargetReturn(inputs));

  // 입력값이 변경될 때마다 계산 결과 업데이트
  useEffect(() => {
    setResult(calculateTargetReturn(inputs));
  }, [inputs]);

  const handleInputChange = (field: keyof typeof inputs) => (value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // 리스크 레벨에 따른 정보
  const getRiskInfo = (level: string) => {
    switch (level) {
      case 'low':
        return {
          text: '낮은 리스크',
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-700',
          description: '안전한 투자로 달성 가능 (채권, 예금 등)',
          emoji: '🟢',
        };
      case 'medium':
        return {
          text: '중간 리스크',
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-700',
          description: '주식 투자 필요 (인덱스 펀드, ETF 등)',
          emoji: '🟡',
        };
      case 'high':
        return {
          text: '높은 리스크',
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-700',
          description: '고위험 투자 필요 (성장주, 스타트업 등)',
          emoji: '🔴',
        };
      default:
        return {
          text: '계산 중',
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-700',
          description: '',
          emoji: '⚪',
        };
    }
  };

  const riskInfo = getRiskInfo(result.riskLevel);

  // 도넛 차트 데이터 (현재 vs 목표)
  const chartData = {
    labels: ['현재 자산', '목표까지 필요 금액'],
    datasets: [
      {
        data: [inputs.currentAsset, inputs.targetAsset - inputs.currentAsset],
        backgroundColor: ['rgba(37, 99, 235, 0.8)', 'rgba(107, 114, 128, 0.3)'],
        borderColor: ['rgb(37, 99, 235)', 'rgb(107, 114, 128)'],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = formatKoreanCurrency(context.parsed);
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 입력 섹션 */}
      <div className="space-y-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">
            🎯 목표 설정
          </h3>

          <div className="space-y-4">
            <InputField
              label="현재 자산"
              value={inputs.currentAsset}
              onChange={handleInputChange('currentAsset')}
              type="currency"
              placeholder="5000000"
              description="현재 보유하고 있는 총 자산"
            />

            <InputField
              label="목표 자산"
              value={inputs.targetAsset}
              onChange={handleInputChange('targetAsset')}
              type="currency"
              placeholder="100000000"
              description="달성하고 싶은 목표 금액"
            />

            <InputField
              label="투자 기간"
              value={inputs.years}
              onChange={handleInputChange('years')}
              type="years"
              min={1}
              max={50}
              placeholder="10"
              description="목표 달성까지의 기간"
            />

            <InputField
              label="월 추가 투자금 (선택)"
              value={inputs.monthlyContribution}
              onChange={handleInputChange('monthlyContribution')}
              type="currency"
              placeholder="1000000"
              description="매월 추가로 투자할 수 있는 금액"
            />
          </div>
        </div>

        {/* 달성 가능성 분석 */}
        <div className="card p-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
            📊 달성 가능성 분석
          </h4>
          <div className="space-y-3">
            <div
              className={`p-3 rounded-lg ${riskInfo.bgColor} ${riskInfo.borderColor} border transition-colors`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">달성 가능성</span>
                <span className={`text-2xl ${result.achievable ? '✅' : '❌'}`}>
                  {result.achievable ? '가능' : '어려움'}
                </span>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 transition-colors">
              <p>
                • <strong>연 15% 이상</strong>의 수익률은 매우 도전적입니다
              </p>
              <p>
                • <strong>S&P 500 장기 평균</strong>: 연 7~10%
              </p>
              <p>
                • <strong>안전한 투자</strong>: 연 3~5% (채권, 예금)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 결과 섹션 */}
      <div className="space-y-6">
        {/* 주요 결과 카드들 */}
        <div className="grid grid-cols-2 gap-4">
          <ResultCard
            title="필요 연간 수익률"
            value={result.requiredAnnualReturn}
            type="percentage"
            highlight={true}
            icon="📈"
          />
          <ResultCard
            title="필요 월간 수익률"
            value={result.requiredMonthlyReturn}
            type="percentage"
            icon="📅"
          />
        </div>

        {/* 리스크 레벨 카드 */}
        <div
          className={`card p-6 ${riskInfo.bgColor} ${riskInfo.borderColor} border-2 transition-colors`}
        >
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
            {riskInfo.emoji} 리스크 레벨: {riskInfo.text}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
            {riskInfo.description}
          </p>
        </div>

        {/* 현재 vs 목표 차트 */}
        <div className="card p-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 transition-colors">
            💰 자산 현황
          </h4>
          <div className="h-64">
            <Doughnut options={chartOptions} data={chartData} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
              목표까지{' '}
              <strong>
                {formatKoreanCurrency(inputs.targetAsset - inputs.currentAsset)}
              </strong>{' '}
              더 필요
            </p>
          </div>
        </div>

        {/* 투자 전략 제안 */}
        <div className="card p-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
            💡 추천 투자 전략
          </h4>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 transition-colors">
            {result.requiredAnnualReturn <= 5 && (
              <p>
                • <strong>안전 투자</strong>: 국채, 회사채, 예금
              </p>
            )}
            {result.requiredAnnualReturn > 5 &&
              result.requiredAnnualReturn <= 10 && (
                <>
                  <p>
                    • <strong>균형 투자</strong>: 인덱스 펀드 (60%) + 채권 (40%)
                  </p>
                  <p>
                    • <strong>추천 ETF</strong>: S&P 500, 전세계 주식
                  </p>
                </>
              )}
            {result.requiredAnnualReturn > 10 &&
              result.requiredAnnualReturn <= 15 && (
                <>
                  <p>
                    • <strong>성장 투자</strong>: 성장주, 신흥시장
                  </p>
                  <p>
                    • <strong>주의사항</strong>: 높은 변동성 감수 필요
                  </p>
                </>
              )}
            {result.requiredAnnualReturn > 15 && (
              <>
                <p>
                  • <strong>고위험 투자</strong>: 개별주, 스타트업 투자
                </p>
                <p>
                  • <strong>대안</strong>: 투자기간 연장 또는 목표액 조정 고려
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
