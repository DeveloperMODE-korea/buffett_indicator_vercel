'use client'

import { useState, useMemo } from 'react'
import { investmentTerms, categories, InvestmentTerm } from '@/data/investmentTerms'
import TermModal from './ui/TermModal'

export default function InvestmentDictionary() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedTerm, setSelectedTerm] = useState<InvestmentTerm | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 검색 및 필터링된 용어들
  const filteredTerms = useMemo(() => {
    return investmentTerms.filter(term => {
      const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           term.definition.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === '전체' || term.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  // 용어 클릭 핸들러
  const handleTermClick = (term: InvestmentTerm) => {
    setSelectedTerm(term)
    setIsModalOpen(true)
  }

  // 관련 용어 클릭 핸들러
  const handleRelatedTermClick = (termId: string) => {
    const term = investmentTerms.find(t => t.id === termId)
    if (term) {
      setSelectedTerm(term)
    }
  }

  // 모달 닫기
  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedTerm(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          📚 투자 용어 사전
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          투자와 경제에 관련된 용어들을 쉽게 찾아보세요. 
          용어를 클릭하면 자세한 설명을 확인할 수 있습니다.
        </p>
      </div>

      {/* 검색 및 필터 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 검색바 */}
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              용어 검색
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                placeholder="용어 또는 설명을 검색해보세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* 카테고리 필터 */}
          <div className="lg:w-64">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              카테고리
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 검색 결과 카운트 */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          총 <span className="font-semibold text-blue-600 dark:text-blue-400">{filteredTerms.length}</span>개의 용어를 찾았습니다.
        </div>
      </div>

      {/* 용어 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTerms.map((term) => (
          <div
            key={term.id}
            onClick={() => handleTermClick(term)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 p-6 cursor-pointer transition-all duration-300 hover:scale-105 group"
          >
            {/* 카테고리 배지 */}
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {term.category}
              </span>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* 용어명 */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {term.term}
            </h3>

            {/* 정의 미리보기 */}
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
              {term.definition.length > 80 
                ? `${term.definition.substring(0, 80)}...` 
                : term.definition}
            </p>

            {/* 관련 용어 개수 */}
            {term.relatedTerms && term.relatedTerms.length > 0 && (
              <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                관련 용어 {term.relatedTerms.length}개
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 검색 결과가 없는 경우 */}
      {filteredTerms.length === 0 && (
        <div className="text-center py-16">
          <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.239 0-4.239-.885-5.708-2.292m-.292 3.292A7.962 7.962 0 016 18c-1.736 0-3.369-.676-4.596-1.904M12 6.253v.747M12 6c-2.239 0-4.239.885-5.708 2.292M12 6c2.239 0 4.239.885 5.708 2.292" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            검색 결과가 없습니다
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            다른 검색어나 카테고리를 시도해보세요.
          </p>
        </div>
      )}

      {/* 용어 상세 모달 */}
      <TermModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        term={selectedTerm}
        onTermClick={handleRelatedTermClick}
      />
    </div>
  )
}
