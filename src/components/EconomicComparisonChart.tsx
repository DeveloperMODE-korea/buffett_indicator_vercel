'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface EconomicData {
  buffettIndicator: Array<{ date: string; value: number }>;
  unemploymentRate: Array<{ date: string; value: number }>;
  fedFundsRate: Array<{ date: string; value: number }>;
  inflationRate: Array<{ date: string; value: number }>;
  treasury10Year: Array<{ date: string; value: number }>;
}

interface ApiResponse {
  success: boolean;
  data: EconomicData;
  lastUpdated: string;
  dataPoints: Record<string, number>;
  error?: string;
  details?: string;
}

export default function EconomicComparisonChart() {
  const [data, setData] = useState<EconomicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [visibleSeries, setVisibleSeries] = useState({
    buffett: true,
    unemployment: true,
    fedFunds: true,
    inflation: true,
    treasury: true,
  });

  useEffect(() => {
    fetchEconomicData();
  }, []);

  const fetchEconomicData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching economic indicators...');

      const response = await fetch('/api/economic-indicators');
      const result: ApiResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data');
      }

      console.log('Economic data received:', result.dataPoints);
      setData(result.data);
      setLastUpdated(result.lastUpdated);
    } catch (err) {
      console.error('Error fetching economic data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // 차트 데이터 준비
  const chartData: ChartData<'line'> = {
    labels:
      data?.buffettIndicator.map(point => {
        const date = new Date(point.date);
        return date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'short',
        });
      }) || [],
    datasets: [
      // 시장/GDP 비율 (왼쪽 Y축)
      {
        label: '시장/GDP 비율',
        data: visibleSeries.buffett
          ? data?.buffettIndicator.map(point => point.value) || []
          : [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        yAxisID: 'y',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        hidden: !visibleSeries.buffett,
      },
      // 실업률 (오른쪽 Y축)
      {
        label: '실업률',
        data: visibleSeries.unemployment
          ? data?.unemploymentRate.map(point => point.value) || []
          : [],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        yAxisID: 'y1',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        hidden: !visibleSeries.unemployment,
      },
      // 연방기금금리 (오른쪽 Y축)
      {
        label: '연방기금금리',
        data: visibleSeries.fedFunds
          ? data?.fedFundsRate.map(point => point.value) || []
          : [],
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        yAxisID: 'y1',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        hidden: !visibleSeries.fedFunds,
      },
      // 인플레이션율 (오른쪽 Y축)
      {
        label: '인플레이션율',
        data: visibleSeries.inflation
          ? data?.inflationRate.map(point => point.value) || []
          : [],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        yAxisID: 'y1',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        hidden: !visibleSeries.inflation,
      },
      // 10년 국채금리 (오른쪽 Y축)
      {
        label: '10년 국채금리',
        data: visibleSeries.treasury
          ? data?.treasury10Year.map(point => point.value) || []
          : [],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        yAxisID: 'y1',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        hidden: !visibleSeries.treasury,
      },
    ].filter(dataset => dataset.data.length > 0),
  };

  // 차트 옵션
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: '경제 지표 비교 차트 (실제 데이터)',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#1F2937',
      },
      legend: {
        display: false, // 커스텀 범례 사용
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          title: function (context) {
            return context[0].label;
          },
          label: function (context) {
            const datasetLabel = context.dataset.label || '';
            const value = context.parsed.y;

            if (datasetLabel.includes('시장')) {
              return `${datasetLabel}: ${value.toFixed(4)}`;
            } else {
              return `${datasetLabel}: ${value.toFixed(2)}%`;
            }
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: '기간',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.3)',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: '시장/GDP 비율',
          font: {
            size: 12,
            weight: 'bold',
          },
          color: '#3B82F6',
        },
        grid: {
          color: 'rgba(59, 130, 246, 0.2)',
        },
        ticks: {
          color: '#3B82F6',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: '퍼센트 지표 (%)',
          font: {
            size: 12,
            weight: 'bold',
          },
          color: '#F59E0B',
        },
        grid: {
          drawOnChartArea: false,
          color: 'rgba(245, 158, 11, 0.2)',
        },
        ticks: {
          color: '#F59E0B',
          callback: function (value) {
            return `${value}%`;
          },
        },
      },
    },
  };

  // 지표 토글 함수
  const toggleSeries = (series: keyof typeof visibleSeries) => {
    setVisibleSeries(prev => ({
      ...prev,
      [series]: !prev[series],
    }));
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              실제 경제 데이터를 불러오는 중...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              FRED API로부터 최신 데이터 수집 중
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            데이터 로딩 실패
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={fetchEconomicData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* 헤더 */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          📊 경제 지표 비교 분석
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          실제 FRED API 데이터 • 마지막 업데이트:{' '}
          {lastUpdated ? new Date(lastUpdated).toLocaleString('ko-KR') : ''}
        </p>
      </div>

      {/* 커스텀 범례 */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          표시할 지표 선택:
        </h4>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => toggleSeries('buffett')}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              visibleSeries.buffett
                ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                : 'bg-gray-100 text-gray-500 border-2 border-gray-200 hover:bg-gray-200'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            시장/GDP 비율
          </button>
          <button
            onClick={() => toggleSeries('unemployment')}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              visibleSeries.unemployment
                ? 'bg-green-100 text-green-800 border-2 border-green-300'
                : 'bg-gray-100 text-gray-500 border-2 border-gray-200 hover:bg-gray-200'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            실업률
          </button>
          <button
            onClick={() => toggleSeries('fedFunds')}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              visibleSeries.fedFunds
                ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                : 'bg-gray-100 text-gray-500 border-2 border-gray-200 hover:bg-gray-200'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            연방기금금리
          </button>
          <button
            onClick={() => toggleSeries('inflation')}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              visibleSeries.inflation
                ? 'bg-red-100 text-red-800 border-2 border-red-300'
                : 'bg-gray-100 text-gray-500 border-2 border-gray-200 hover:bg-gray-200'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            인플레이션율
          </button>
          <button
            onClick={() => toggleSeries('treasury')}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              visibleSeries.treasury
                ? 'bg-purple-100 text-purple-800 border-2 border-purple-300'
                : 'bg-gray-100 text-gray-500 border-2 border-gray-200 hover:bg-gray-200'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
            10년 국채금리
          </button>
        </div>
      </div>

      {/* 차트 */}
      <div className="h-96 w-full">
        <Line data={chartData} options={options} />
      </div>

      {/* 설명 */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
          💡 차트 해석 가이드:
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>
            • <strong>왼쪽 Y축</strong>: 시장/GDP 비율 (S&P 500 / GDP)
          </li>
          <li>
            • <strong>오른쪽 Y축</strong>: 실업률, 금리, 인플레이션 (퍼센트)
          </li>
          <li>• 높은 시장/GDP 비율 = 시장 과열 신호, 낮은 값 = 저평가 신호</li>
          <li>• 금리 상승/실업률 증가 시 주식시장에 부정적 영향 가능</li>
          <li>• 범례를 클릭하여 특정 지표만 선택적으로 볼 수 있습니다</li>
        </ul>
      </div>
    </div>
  );
}
