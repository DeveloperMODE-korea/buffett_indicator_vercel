'use client';

import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import InputField from '@/components/ui/InputField';
import ResultCard from '@/components/ui/ResultCard';
import { calculateDCA, formatKoreanCurrency } from '@/lib/calculator-utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DCACalculator() {
  const [inputs, setInputs] = useState({
    monthlyInvestment: 1000000, // 월 투자금 (100만원)
    years: 10, // 투자 기간 (10년)
    annualReturn: 8, // 예상 연간 수익률 (8%)
    volatility: 15, // 변동성 (15%)
  });

  const [result, setResult] = useState(calculateDCA(inputs));

  // 입력값이 변경될 때마다 계산 결과 업데이트
  useEffect(() => {
    setResult(calculateDCA(inputs));
  }, [inputs]);

  const handleInputChange = (field: keyof typeof inputs) => (value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // 월별 자산 증가 차트 데이터 (연도별로 표시)
  const yearlyChartData = {
    labels: Array.from({ length: inputs.years }, (_, i) => `${i + 1}년차`),
    datasets: [
      {
        label: '누적 투자원금',
        data: Array.from({ length: inputs.years }, (_, i) => {
          const monthIndex = (i + 1) * 12 - 1;
          return result.monthlyData[monthIndex]?.cumulativeInvestment || 0;
        }),
        borderColor: 'rgb(107, 114, 128)',
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        fill: true,
        tension: 0.1,
      },
      {
        label: '예상 자산가치',
        data: Array.from({ length: inputs.years }, (_, i) => {
          const monthIndex = (i + 1) * 12 - 1;
          return result.monthlyData[monthIndex]?.estimatedValue || 0;
        }),
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.1,
      },
    ],
  };

  // 시나리오 비교 차트 데이터
  const scenarioChartData = {
    labels: ['비관적', '현실적', '낙관적'],
    datasets: [
      {
        label: '예상 자산가치',
        data: [
          result.scenarios.pessimistic,
          result.scenarios.realistic,
          result.scenarios.optimistic,
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)', // 빨간색
          'rgba(37, 99, 235, 0.8)', // 파란색
          'rgba(34, 197, 94, 0.8)', // 초록색
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(37, 99, 235)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 2,
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
        text: '정기투자 자산 증가 시뮬레이션',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || '';
            const value = formatKoreanCurrency(context.parsed.y);
            return `${label}: ${value}`;
          },
        },
      },
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

  const scenarioChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '시나리오별 최종 자산',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = formatKoreanCurrency(context.parsed.y);
            return `예상 자산: ${value}`;
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 입력 섹션 */}
      <div className="space-y-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">
            ⏰ DCA 투자 설정
          </h3>

          <div className="space-y-4">
            <InputField
              label="월 투자금액"
              value={inputs.monthlyInvestment}
              onChange={handleInputChange('monthlyInvestment')}
              type="currency"
              placeholder="1000000"
              description="매월 정기적으로 투자할 금액"
            />

            <InputField
              label="투자 기간"
              value={inputs.years}
              onChange={handleInputChange('years')}
              type="years"
              min={1}
              max={30}
              placeholder="10"
              description="정기투자를 지속할 기간"
            />

            <InputField
              label="예상 연간 수익률"
              value={inputs.annualReturn}
              onChange={handleInputChange('annualReturn')}
              type="percentage"
              min={-30}
              max={30}
              step={0.1}
              placeholder="8"
              description="장기 평균 수익률 (S&P 500: 연 8~10%)"
            />

            <InputField
              label="변동성 (표준편차)"
              value={inputs.volatility}
              onChange={handleInputChange('volatility')}
              type="percentage"
              min={5}
              max={50}
              placeholder="15"
              description="투자 대상의 변동성 (주식: 15~20%)"
            />
          </div>
        </div>

        {/* DCA 장점 설명 */}
        <div className="card p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 transition-colors">
          <h4 className="text-md font-semibold text-blue-900 dark:text-blue-300 mb-3 transition-colors">
            💡 DCA(정기투자)의 장점
          </h4>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200 transition-colors">
            <p>
              • <strong>시점 분산 효과</strong>: 고점/저점 타이밍 위험 완화
            </p>
            <p>
              • <strong>평균 매수 단가 하락</strong>: 변동성 활용한 수익 증대
            </p>
            <p>
              • <strong>감정적 투자 방지</strong>: 규칙적이고 체계적인 투자
            </p>
            <p>
              • <strong>복리 효과 극대화</strong>: 시간과 함께 기하급수적 성장
            </p>
          </div>
        </div>
      </div>

      {/* 결과 섹션 */}
      <div className="space-y-6">
        {/* 주요 결과 카드들 */}
        <div className="grid grid-cols-2 gap-4">
          <ResultCard
            title="예상 최종 자산"
            value={result.estimatedValue}
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
            title="예상 수익률"
            value={result.returnRate}
            type="percentage"
            icon="🎯"
          />
        </div>

        {/* 시나리오 분석 */}
        <div className="card p-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 transition-colors">
            📊 시나리오별 결과
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg transition-colors">
              <span className="font-medium text-red-700 dark:text-red-400">
                🔴 비관적 ({inputs.annualReturn - inputs.volatility}%)
              </span>
              <span className="font-bold text-red-800 dark:text-red-300">
                {formatKoreanCurrency(result.scenarios.pessimistic)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors">
              <span className="font-medium text-blue-700 dark:text-blue-400">
                🔵 현실적 ({inputs.annualReturn}%)
              </span>
              <span className="font-bold text-blue-800 dark:text-blue-300">
                {formatKoreanCurrency(result.scenarios.realistic)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg transition-colors">
              <span className="font-medium text-green-700 dark:text-green-400">
                🟢 낙관적 ({inputs.annualReturn + inputs.volatility}%)
              </span>
              <span className="font-bold text-green-800 dark:text-green-300">
                {formatKoreanCurrency(result.scenarios.optimistic)}
              </span>
            </div>
          </div>
        </div>

        {/* 연도별 자산 증가 차트 */}
        <div className="card p-6">
          <div className="h-80">
            <Line options={chartOptions} data={yearlyChartData} />
          </div>
        </div>

        {/* 시나리오 비교 차트 */}
        <div className="card p-6">
          <div className="h-64">
            <Bar options={scenarioChartOptions} data={scenarioChartData} />
          </div>
        </div>

        {/* 투자 요약 */}
        <div className="card p-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
            📋 DCA 투자 요약
          </h4>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 transition-colors">
            <p>
              • <strong>{inputs.years}년 동안</strong> 매월{' '}
              <strong>{formatKoreanCurrency(inputs.monthlyInvestment)}</strong>
              씩 투자
            </p>
            <p>
              • 총{' '}
              <strong>{formatKoreanCurrency(result.totalInvestment)}</strong>{' '}
              투자로 <strong>{formatKoreanCurrency(result.totalReturn)}</strong>{' '}
              수익 예상
            </p>
            <p>
              • 시장 변동성 <strong>{inputs.volatility}%</strong>에도 안정적인
              장기 투자
            </p>
            <p>
              • DCA 전략으로 <strong>{result.returnRate.toFixed(1)}%</strong>{' '}
              수익률 기대
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
