'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import InputField from '@/components/ui/InputField';
import ResultCard from '@/components/ui/ResultCard';
import {
  calculateCompoundInterest,
  formatKoreanCurrency,
} from '@/lib/calculator-utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function CompoundCalculator() {
  const [inputs, setInputs] = useState({
    principal: 1000000, // 초기 투자금 (100만원)
    monthlyContribution: 500000, // 월 투자금 (50만원)
    annualRate: 7, // 연 수익률 (7%)
    years: 10, // 투자 기간 (10년)
  });

  const [result, setResult] = useState(calculateCompoundInterest(inputs));

  // 입력값이 변경될 때마다 계산 결과 업데이트
  useEffect(() => {
    setResult(calculateCompoundInterest(inputs));
  }, [inputs]);

  const handleInputChange = (field: keyof typeof inputs) => (value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // 차트 데이터 준비
  const chartData = {
    labels: result.yearlyData.map(data => `${data.year}년차`),
    datasets: [
      {
        label: '총 투자원금',
        data: result.yearlyData.map(data => data.totalInvestment),
        borderColor: 'rgb(107, 114, 128)',
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        fill: true,
        tension: 0.1,
      },
      {
        label: '자산 가치',
        data: result.yearlyData.map(data => data.balance),
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '자산 증가 시뮬레이션',
        font: {
          size: 16,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || '';
            const value = formatKoreanCurrency(context.parsed.y);
            return `${label}: ${value}`;
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
        display: true,
        title: {
          display: true,
          text: '투자 기간',
        },
      },
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 입력 섹션 */}
      <div className="space-y-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">
            📊 투자 조건 설정
          </h3>

          <div className="space-y-4">
            <InputField
              label="초기 투자금"
              value={inputs.principal}
              onChange={handleInputChange('principal')}
              type="currency"
              placeholder="1000000"
              description="처음에 투자할 금액을 입력하세요"
            />

            <InputField
              label="월 추가 투자금"
              value={inputs.monthlyContribution}
              onChange={handleInputChange('monthlyContribution')}
              type="currency"
              placeholder="500000"
              description="매월 추가로 투자할 금액"
            />

            <InputField
              label="연간 예상 수익률"
              value={inputs.annualRate}
              onChange={handleInputChange('annualRate')}
              type="percentage"
              min={-50}
              max={50}
              step={0.1}
              placeholder="7"
              description="연간 기대 수익률 (S&P 500 장기 평균: 7~10%)"
            />

            <InputField
              label="투자 기간"
              value={inputs.years}
              onChange={handleInputChange('years')}
              type="years"
              min={1}
              max={50}
              placeholder="10"
              description="투자를 지속할 기간"
            />
          </div>
        </div>

        {/* 시나리오 분석 */}
        <div className="card p-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
            🎯 시나리오 분석
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                보수적 (연 5%)
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatKoreanCurrency(
                  calculateCompoundInterest({ ...inputs, annualRate: 5 })
                    .finalAmount
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                현재 설정
              </span>
              <span className="font-medium text-primary-600 dark:text-primary-400">
                {formatKoreanCurrency(result.finalAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                공격적 (연 12%)
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatKoreanCurrency(
                  calculateCompoundInterest({ ...inputs, annualRate: 12 })
                    .finalAmount
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 결과 섹션 */}
      <div className="space-y-6">
        {/* 결과 카드들 */}
        <div className="grid grid-cols-2 gap-4">
          <ResultCard
            title="최종 자산"
            value={result.finalAmount}
            type="currency"
            highlight={true}
            icon="💰"
          />
          <ResultCard
            title="총 수익금"
            value={result.totalReturn}
            type="currency"
            icon="📈"
          />
          <ResultCard
            title="총 투자원금"
            value={result.totalInvestment}
            type="currency"
            icon="💳"
          />
          <ResultCard
            title="총 수익률"
            value={result.returnRate}
            type="percentage"
            icon="🎯"
          />
        </div>

        {/* 차트 */}
        <div className="card p-6">
          <div className="h-80">
            <Line options={chartOptions} data={chartData} />
          </div>
        </div>

        {/* 상세 분석 */}
        <div className="card p-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
            📋 투자 요약
          </h4>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 transition-colors">
            <p>
              • <strong>{inputs.years}년 동안</strong> 총{' '}
              <strong>{formatKoreanCurrency(result.totalInvestment)}</strong>을
              투자
            </p>
            <p>
              • 연평균 <strong>{inputs.annualRate}%</strong> 수익률로{' '}
              <strong>{formatKoreanCurrency(result.totalReturn)}</strong> 수익
              예상
            </p>
            <p>
              • 복리 효과로 원금 대비{' '}
              <strong>{result.returnRate.toFixed(1)}%</strong> 성장
            </p>
            <p>
              • 매월{' '}
              <strong>
                {formatKoreanCurrency(inputs.monthlyContribution)}
              </strong>{' '}
              적립 시 목표 달성
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
