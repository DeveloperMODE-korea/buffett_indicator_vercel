'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BuffettIndicatorCard from '@/components/BuffettIndicatorCard';
import EconomicComparisonChart from '@/components/EconomicComparisonChart';
import InfoSection from '@/components/InfoSection';
import RealTimeStockData from '@/components/RealTimeStockData';

interface IndicatorData {
  currentValue: number;
  changePercent: number;
  lastUpdated: string;
  status: 'overvalued' | 'undervalued' | 'fair';
}

export default function Home() {
  const [indicatorData, setIndicatorData] = useState<IndicatorData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBuffettIndicator();
  }, []);

  const fetchBuffettIndicator = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/buffett-indicator');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data');
      }

      setIndicatorData(result.data);
    } catch (err) {
      console.error('Error fetching Buffett Indicator:', err);
      setError(
        err instanceof Error
          ? err.message
          : '데이터를 불러오는 중 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
          미국 버핏 지수 실시간 관측
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
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

      {/* Real-time Stock Data */}
      <section id="stock-data" className="mb-12">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-700">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              📈 실시간 주식시장 데이터
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              주요 주식과 시장 지수의 실시간 가격 정보를 확인하세요. 30초마다
              자동 업데이트됩니다.
            </p>
          </div>
          <RealTimeStockData />
        </div>
      </section>

      {/* Investment Dictionary Section */}
      <section id="dictionary" className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-700">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              📚 투자 용어 사전
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              투자와 경제 용어를 쉽게 찾아보세요. 버핏 지수부터 기본적인 투자
              개념까지!
            </p>
          </div>

          {/* 인기 용어 미리보기 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
              <Link href="/dictionary" className="block text-center">
                <div className="text-2xl mb-2">📈</div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                  버핏 지수
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  시장지표
                </div>
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
              <Link href="/dictionary" className="block text-center">
                <div className="text-2xl mb-2">💰</div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                  P/E 비율
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  주식용어
                </div>
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
              <Link href="/dictionary" className="block text-center">
                <div className="text-2xl mb-2">🔄</div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                  복리
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  투자기본
                </div>
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
              <Link href="/dictionary" className="block text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                  변동성
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  위험관리
                </div>
              </Link>
            </div>
          </div>

          {/* 용어 사전 바로가기 버튼 */}
          <div className="text-center">
            <Link
              href="/dictionary"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              전체 용어 사전 보기
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ETF Recommendations Section */}
      <section id="etf-recommendations" className="mb-12">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-700">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              📈 추천 ETF 가이드
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              투자 목적과 위험 성향에 맞는 ETF를 찾아보세요. VTI, VOO, QQQ, IYW
              등 다양한 ETF의 상세 정보를 확인할 수 있습니다.
            </p>
          </div>

          {/* 인기 ETF 미리보기 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
              <Link href="/etf" className="block text-center">
                <div className="text-2xl mb-2">📊</div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                  VTI
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  미국 전체 시장
                </div>
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
              <Link href="/etf" className="block text-center">
                <div className="text-2xl mb-2">🚀</div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                  QQQ
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  기술주
                </div>
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
              <Link href="/etf" className="block text-center">
                <div className="text-2xl mb-2">💰</div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                  JEPI
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  고배당 소득
                </div>
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
              <Link href="/etf" className="block text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                  ARKK
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  혁신 투자
                </div>
              </Link>
            </div>
          </div>

          {/* ETF 가이드 바로가기 버튼 */}
          <div className="text-center">
            <Link
              href="/etf"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              전체 ETF 가이드 보기
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Economic Comparison Chart Section */}
      <section id="economic-comparison" className="mb-12">
        <EconomicComparisonChart />
      </section>

      {/* Info Section */}
      <section id="info">
        <InfoSection />
      </section>
    </div>
  );
}
