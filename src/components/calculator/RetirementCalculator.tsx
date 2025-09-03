'use client';

import { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import InputField from '@/components/ui/InputField';
import ResultCard from '@/components/ui/ResultCard';
import {
  calculateRetirement,
  formatKoreanCurrency,
} from '@/lib/calculator-utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function RetirementCalculator() {
  const [inputs, setInputs] = useState({
    currentAge: 30, // 현재 나이
    retirementAge: 60, // 은퇴 희망 나이
    currentAsset: 50000000, // 현재 자산 (5천만원)
    monthlyExpense: 3000000, // 은퇴 후 월 생활비 (300만원)
    lifeExpectancy: 85, // 예상 수명
    inflationRate: 2.5, // 인플레이션율 (2.5%)
    expectedReturn: 6, // 예상 투자 수익률 (6%)
  });

  const [result, setResult] = useState(calculateRetirement(inputs));

  // 입력값이 변경될 때마다 계산 결과 업데이트
  useEffect(() => {
    setResult(calculateRetirement(inputs));
  }, [inputs]);

  const handleInputChange = (field: keyof typeof inputs) => (value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // 은퇴 자금 구성 차트 데이터
  const assetCompositionData = {
    labels: ['현재 자산 (성장)', '추가 적립 필요'],
    datasets: [
      {
        data: [
          inputs.currentAsset *
            Math.pow(1 + inputs.expectedReturn / 100, result.yearsToRetirement),
          result.currentShortfall,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)', // 초록색
          'rgba(239, 68, 68, 0.8)', // 빨간색
        ],
        borderColor: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)'],
        borderWidth: 2,
      },
    ],
  };

  // 연도별 필요 적립금 시뮬레이션
  const yearlyContributionData = {
    labels: Array.from(
      { length: Math.min(result.yearsToRetirement, 10) },
      (_, i) => `${i + 1}년차`
    ),
    datasets: [
      {
        label: '월 적립금',
        data: Array.from(
          { length: Math.min(result.yearsToRetirement, 10) },
          () => result.monthlyContributionNeeded
        ),
        backgroundColor: 'rgba(37, 99, 235, 0.8)',
        borderColor: 'rgb(37, 99, 235)',
        borderWidth: 1,
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

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '필요 월 적립금',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = formatKoreanCurrency(context.parsed.y);
            return `월 적립금: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        display: true,
        title: {
          display: true,
          text: '금액 (원)',
        },
        ticks: {
          callback: function (value: any) {
            return formatKoreanCurrency(value);
          },
        },
      },
    },
  };

  const getRetirementReadiness = () => {
    const readinessScore = Math.min(
      100,
      (1 - result.currentShortfall / result.requiredAmount) * 100
    );

    if (readinessScore >= 80) {
      return {
        level: '우수',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-700',
        emoji: '🟢',
        description: '은퇴 준비가 잘 되어 있습니다!',
      };
    } else if (readinessScore >= 50) {
      return {
        level: '보통',
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-700',
        emoji: '🟡',
        description: '추가 준비가 필요합니다.',
      };
    } else {
      return {
        level: '부족',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-700',
        emoji: '🔴',
        description: '적극적인 은퇴 준비가 필요합니다.',
      };
    }
  };

  const readiness = getRetirementReadiness();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 입력 섹션 */}
      <div className="space-y-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">
            🏖️ 은퇴 계획 설정
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="현재 나이"
                value={inputs.currentAge}
                onChange={handleInputChange('currentAge')}
                type="years"
                min={20}
                max={70}
                placeholder="30"
                description="현재 나이"
              />

              <InputField
                label="은퇴 희망 나이"
                value={inputs.retirementAge}
                onChange={handleInputChange('retirementAge')}
                type="years"
                min={inputs.currentAge + 1}
                max={85}
                placeholder="60"
                description="은퇴하고 싶은 나이"
              />
            </div>

            <InputField
              label="현재 보유 자산"
              value={inputs.currentAsset}
              onChange={handleInputChange('currentAsset')}
              type="currency"
              placeholder="50000000"
              description="현재 총 자산 (예금 + 투자 + 부동산 등)"
            />

            <InputField
              label="은퇴 후 월 생활비"
              value={inputs.monthlyExpense}
              onChange={handleInputChange('monthlyExpense')}
              type="currency"
              placeholder="3000000"
              description="은퇴 후 필요한 월 생활비 (현재 기준)"
            />

            <InputField
              label="예상 수명"
              value={inputs.lifeExpectancy}
              onChange={handleInputChange('lifeExpectancy')}
              type="years"
              min={inputs.retirementAge + 1}
              max={100}
              placeholder="85"
              description="예상 수명 (한국 평균: 83세)"
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="인플레이션율"
                value={inputs.inflationRate}
                onChange={handleInputChange('inflationRate')}
                type="percentage"
                min={0}
                max={10}
                step={0.1}
                placeholder="2.5"
                description="연간 인플레이션율"
              />

              <InputField
                label="예상 투자 수익률"
                value={inputs.expectedReturn}
                onChange={handleInputChange('expectedReturn')}
                type="percentage"
                min={0}
                max={15}
                step={0.1}
                placeholder="6"
                description="장기 투자 수익률"
              />
            </div>
          </div>
        </div>

        {/* 은퇴 준비 상태 */}
        <div
          className={`card p-6 ${readiness.bgColor} ${readiness.borderColor} border-2 transition-colors`}
        >
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
            {readiness.emoji} 은퇴 준비 상태: {readiness.level}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
            {readiness.description}
          </p>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 transition-colors">
            은퇴까지 <strong>{result.yearsToRetirement}년</strong> 남았습니다.
          </div>
        </div>
      </div>

      {/* 결과 섹션 */}
      <div className="space-y-6">
        {/* 주요 결과 카드들 */}
        <div className="grid grid-cols-2 gap-4">
          <ResultCard
            title="필요한 은퇴 자금"
            value={result.requiredAmount}
            type="currency"
            highlight={true}
            icon="🏦"
          />
          <ResultCard
            title="현재 부족분"
            value={result.currentShortfall}
            type="currency"
            icon="📉"
          />
          <ResultCard
            title="필요 월 적립금"
            value={result.monthlyContributionNeeded}
            type="currency"
            icon="💰"
          />
          <ResultCard
            title="은퇴 후 월 소득"
            value={result.monthlyIncomeAtRetirement}
            type="currency"
            icon="💳"
          />
        </div>

        {/* 은퇴 자금 구성 차트 */}
        <div className="card p-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 transition-colors">
            💰 은퇴 자금 구성
          </h4>
          <div className="h-64">
            <Doughnut options={chartOptions} data={assetCompositionData} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
              현재 자산이 은퇴 시점까지 성장한 금액을 포함한 구성
            </p>
          </div>
        </div>

        {/* 월 적립금 차트 */}
        <div className="card p-6">
          <div className="h-64">
            <Bar options={barChartOptions} data={yearlyContributionData} />
          </div>
        </div>

        {/* 은퇴 계획 요약 */}
        <div className="card p-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
            📋 은퇴 계획 요약
          </h4>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 transition-colors">
            <p>
              • <strong>{result.yearsToRetirement}년 후</strong> 은퇴하여{' '}
              <strong>
                {inputs.lifeExpectancy - inputs.retirementAge}년간
              </strong>{' '}
              생활
            </p>
            <p>
              • 인플레이션 <strong>{inputs.inflationRate}%</strong>를 고려한
              실질 구매력 유지
            </p>
            <p>
              • 현재 자산{' '}
              <strong>{formatKoreanCurrency(inputs.currentAsset)}</strong>이
              은퇴 시점에 약{' '}
              <strong>
                {formatKoreanCurrency(
                  inputs.currentAsset *
                    Math.pow(
                      1 + inputs.expectedReturn / 100,
                      result.yearsToRetirement
                    )
                )}
              </strong>
              로 성장 예상
            </p>
            <p>
              • 매월{' '}
              <strong>
                {formatKoreanCurrency(result.monthlyContributionNeeded)}
              </strong>{' '}
              적립으로 목표 달성
            </p>
          </div>
        </div>

        {/* 은퇴 준비 팁 */}
        <div className="card p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 transition-colors">
          <h4 className="text-md font-semibold text-blue-900 dark:text-blue-300 mb-3 transition-colors">
            💡 은퇴 준비 팁
          </h4>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200 transition-colors">
            <p>
              • <strong>일찍 시작</strong>: 복리의 힘을 최대한 활용
            </p>
            <p>
              • <strong>다양한 투자</strong>: 주식, 채권, 부동산 등 분산 투자
            </p>
            <p>
              • <strong>세금 혜택</strong>: 연금저축, IRP 등 활용
            </p>
            <p>
              • <strong>정기 점검</strong>: 매년 은퇴 계획 재검토
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
