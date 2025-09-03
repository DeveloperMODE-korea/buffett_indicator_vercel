'use client';

export default function InfoSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 버핏 지수란? */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center transition-colors">
          🤔 버핏 지수란?
        </h3>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 transition-colors">
          <p>
            <strong className="text-gray-900 dark:text-gray-100 transition-colors">
              버핏 지수(Buffett Indicator)
            </strong>
            는 워렌 버핏이 선호하는 주식시장 과대평가/과소평가 판단 지표입니다.
          </p>
          <p>
            총 시가총액을 GDP로 나눈 비율로 계산되며, 시장 전체의 가치가 경제
            규모 대비 적정한지를 평가합니다.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg transition-colors border border-blue-200 dark:border-blue-700">
            <p className="font-semibold text-blue-900 dark:text-blue-300 mb-2 transition-colors">
              계산 공식:
            </p>
            <p className="text-blue-800 dark:text-blue-200 transition-colors">
              버핏 지수 = (총 주식시장 시가총액 / GDP) × 100
            </p>
          </div>
        </div>
      </div>

      {/* 해석 방법 (Python 버전 기준으로 업데이트) */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center transition-colors">
          📊 해석 방법 (워렌 버핏 기준)
        </h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <span className="text-lg mt-0.5">🟢</span>
            <div>
              <div className="font-semibold text-green-700 dark:text-green-400 transition-colors">
                75% 미만: 현저한 저평가
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                매수 기회, 시장이 현저히 저평가된 상태
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-lg mt-0.5">🔵</span>
            <div>
              <div className="font-semibold text-blue-700 dark:text-blue-400 transition-colors">
                75% - 90%: 적정가치
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                시장이 합리적으로 평가된 범위
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-lg mt-0.5">🟡</span>
            <div>
              <div className="font-semibold text-yellow-700 dark:text-yellow-400 transition-colors">
                90% - 115%: 다소 고평가
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                시장이 다소 고평가된 상태, 주의 관찰
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-lg mt-0.5">🟠</span>
            <div>
              <div className="font-semibold text-orange-700 dark:text-orange-400 transition-colors">
                115% - 140%: 현저한 고평가
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                시장이 현저히 고평가된 상태, 주의 필요
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-lg mt-0.5">🔴</span>
            <div>
              <div className="font-semibold text-red-700 dark:text-red-400 transition-colors">
                140% 초과: 극도 고평가
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                시장이 극도로 고평가된 상태, 매우 주의
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 데이터 소스 */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center transition-colors">
          📈 데이터 소스
        </h3>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 transition-colors">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors">
              GDP 데이터
            </h4>
            <p className="text-sm">
              미국 연방준비제도(Fed)의 FRED API를 통해 최신 GDP 데이터를
              실시간으로 수집합니다.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors">
              시가총액 데이터
            </h4>
            <p className="text-sm">
              Wilshire 5000 지수를 기반으로 한 미국 전체 주식시장의 시가총액
              데이터를 사용합니다.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors">
              데이터 수집 방식
            </h4>
            <p className="text-sm">
              Google Finance에서 Wilshire 5000 지수를 직접 스크래핑하며, 실패시
              FRED API를 백업으로 사용합니다.
            </p>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600 pt-3 mt-4 transition-colors">
            * 데이터는 매일 업데이트되며, 공휴일 및 주말에는 최근 거래일
            기준으로 표시됩니다.
          </div>
        </div>
      </div>

      {/* 주의사항 */}
      <div className="card p-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 transition-colors">
        <h3 className="text-xl font-bold text-amber-900 dark:text-amber-300 mb-4 flex items-center transition-colors">
          ⚠️ 주의사항
        </h3>
        <div className="space-y-3 text-amber-800 dark:text-amber-200 text-sm transition-colors">
          <p>
            • 버핏 지수는 참고 지표일 뿐이며, 투자 결정의 유일한 근거가 되어서는
            안 됩니다.
          </p>
          <p>
            • 금리, 인플레이션, 기업 실적 등 다양한 경제 요인을 종합적으로
            고려해야 합니다.
          </p>
          <p>
            • 과거 데이터 기반 지표이므로, 미래 시장 움직임을 완벽히 예측할 수는
            없습니다.
          </p>
          <p>
            • 투자에는 항상 위험이 따르므로, 신중한 판단과 분산투자를
            권장합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
