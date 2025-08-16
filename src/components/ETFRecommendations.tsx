'use client'

import { useState, useMemo } from 'react'
import { etfRecommendations, etfCategories, etfByPurpose, ETFInfo } from '@/data/etfRecommendations'

export default function ETFRecommendations() {
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedPurpose, setSelectedPurpose] = useState('전체')
  const [selectedETF, setSelectedETF] = useState<ETFInfo | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 필터링된 ETF 목록
  const filteredETFs = useMemo(() => {
    let filtered = etfRecommendations

    // 카테고리 필터
    if (selectedCategory !== '전체') {
      filtered = filtered.filter(etf => etf.category === selectedCategory)
    }

    // 투자 목적 필터
    if (selectedPurpose !== '전체') {
      const purposeSymbols = etfByPurpose[selectedPurpose as keyof typeof etfByPurpose] || []
      filtered = filtered.filter(etf => purposeSymbols.includes(etf.symbol))
    }

    return filtered
  }, [selectedCategory, selectedPurpose])

  // 리스크 레벨에 따른 색상
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20'
      case 'high': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
    }
  }

  // ETF 카드 클릭 핸들러
  const handleETFClick = (etf: ETFInfo) => {
    setSelectedETF(etf)
    setIsModalOpen(true)
  }

  // 모달 닫기
  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedETF(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          📈 추천 ETF 가이드
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          투자 목적과 위험 성향에 맞는 ETF를 찾아보세요. 
          각 ETF의 상세 정보와 장단점을 확인할 수 있습니다.
        </p>
      </div>

      {/* 필터 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 카테고리 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              📂 카테고리
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {etfCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* 투자 목적 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              🎯 투자 목적
            </label>
            <select
              value={selectedPurpose}
              onChange={(e) => setSelectedPurpose(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="전체">전체</option>
              <option value="초보 투자자">초보 투자자</option>
              <option value="장기 투자">장기 투자</option>
              <option value="소득 투자">소득 투자</option>
              <option value="성장 투자">성장 투자</option>
              <option value="안정적 투자">안정적 투자</option>
              <option value="분산 투자">분산 투자</option>
              <option value="은퇴 준비">은퇴 준비</option>
              <option value="높은 수익 추구">높은 수익 추구</option>
              <option value="인플레이션 헤징">인플레이션 헤징</option>
              <option value="섹터 투자">섹터 투자</option>
              <option value="가치 투자">가치 투자</option>
              <option value="국제 분산">국제 분산</option>
              <option value="신흥시장">신흥시장</option>
              <option value="채권 투자">채권 투자</option>
              <option value="부동산 투자">부동산 투자</option>
              <option value="원자재 투자">원자재 투자</option>
              <option value="혁신 투자">혁신 투자</option>
              <option value="고배당 투자">고배당 투자</option>
            </select>
          </div>
        </div>

        {/* 결과 카운트 */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          총 <span className="font-semibold text-blue-600 dark:text-blue-400">{filteredETFs.length}</span>개의 ETF를 찾았습니다.
        </div>
      </div>

      {/* ETF 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredETFs.map((etf) => (
          <div
            key={etf.symbol}
            onClick={() => handleETFClick(etf)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 p-6 cursor-pointer transition-all duration-300 hover:scale-105 group"
          >
            {/* ETF 헤더 */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {etf.symbol}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {etf.name}
                </p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(etf.riskLevel)}`}>
                {etf.riskLevel === 'low' ? '낮음' : etf.riskLevel === 'medium' ? '보통' : '높음'}
              </span>
            </div>

            {/* 카테고리 */}
            <div className="mb-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {etf.category}
              </span>
            </div>

            {/* 설명 */}
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
              {etf.description}
            </p>

            {/* 주요 정보 */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">수수료</span>
                <span className="font-medium text-gray-900 dark:text-white">{etf.expenseRatio}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">자산 규모</span>
                <span className="font-medium text-gray-900 dark:text-white">{etf.aum}</span>
              </div>
              {etf.ytdReturn && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">YTD 수익률</span>
                  <span className={`font-medium ${etf.ytdReturn.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {etf.ytdReturn}
                  </span>
                </div>
              )}
              {etf.dividendYield && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">배당 수익률</span>
                  <span className="font-medium text-gray-900 dark:text-white">{etf.dividendYield}</span>
                </div>
              )}
            </div>

            {/* 적합성 */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">적합한 투자자</h4>
              <div className="flex flex-wrap gap-1">
                {etf.suitability.slice(0, 3).map((suit, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {suit}
                  </span>
                ))}
                {etf.suitability.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    +{etf.suitability.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* 상세보기 버튼 */}
            <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
              상세 정보 보기
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* 검색 결과가 없는 경우 */}
      {filteredETFs.length === 0 && (
        <div className="text-center py-16">
          <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.239 0-4.239-.885-5.708-2.292m-.292 3.292A7.962 7.962 0 016 18c-1.736 0-3.369-.676-4.596-1.904M12 6.253v.747M12 6c-2.239 0-4.239.885-5.708 2.292M12 6c2.239 0 4.239.885 5.708 2.292" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            조건에 맞는 ETF가 없습니다
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            다른 필터 조건을 시도해보세요.
          </p>
        </div>
      )}

      {/* ETF 상세 모달 */}
      {isModalOpen && selectedETF && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleModalClose} />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              {/* 모달 헤더 */}
              <div className="px-8 pt-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedETF.symbol}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      {selectedETF.name}
                    </p>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(selectedETF.riskLevel)}`}>
                        위험도: {selectedETF.riskLevel === 'low' ? '낮음' : selectedETF.riskLevel === 'medium' ? '보통' : '높음'}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {selectedETF.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleModalClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 모달 바디 */}
              <div className="px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* 왼쪽: 기본 정보 */}
                  <div className="space-y-6">
                    {/* 설명 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        📝 ETF 설명
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {selectedETF.description}
                      </p>
                    </div>

                    {/* 주요 지표 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        📊 주요 지표
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400">수수료</div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">{selectedETF.expenseRatio}</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 dark:text-gray-400">자산 규모</div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">{selectedETF.aum}</div>
                        </div>
                        {selectedETF.ytdReturn && (
                          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 dark:text-gray-400">YTD 수익률</div>
                            <div className={`text-lg font-bold ${selectedETF.ytdReturn.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {selectedETF.ytdReturn}
                            </div>
                          </div>
                        )}
                        {selectedETF.dividendYield && (
                          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 dark:text-gray-400">배당 수익률</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">{selectedETF.dividendYield}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 적합한 투자자 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        👥 적합한 투자자
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedETF.suitability.map((suit, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {suit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 오른쪽: 장단점 */}
                  <div className="space-y-6">
                    {/* 장점 */}
                    <div>
                      <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-3">
                        ✅ 장점
                      </h3>
                      <ul className="space-y-2">
                        {selectedETF.pros.map((pro, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 단점 */}
                    <div>
                      <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-3">
                        ⚠️ 단점
                      </h3>
                      <ul className="space-y-2">
                        {selectedETF.cons.map((con, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 투자 팁 */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                        💡 투자 팁
                      </h3>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• 장기 투자 관점에서 접근하세요</li>
                        <li>• 포트폴리오 분산을 고려하세요</li>
                        <li>• 정기적으로 리밸런싱하세요</li>
                        <li>• 투자 목적에 맞는 ETF를 선택하세요</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
