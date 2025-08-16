'use client'

interface CalculatorTabsProps {
  activeTab: 'compound' | 'target' | 'dca' | 'retirement'
  onTabChange: (tab: 'compound' | 'target' | 'dca' | 'retirement') => void
}

export default function CalculatorTabs({ activeTab, onTabChange }: CalculatorTabsProps) {
  const tabs = [
    {
      id: 'compound' as const,
      name: '복리 계산기',
      icon: '📈',
      description: '복리의 마법을 경험해보세요'
    },
    {
      id: 'target' as const,
      name: '목표 수익률',
      icon: '🎯',
      description: '목표 달성에 필요한 수익률'
    },
    {
      id: 'dca' as const,
      name: '정기투자(DCA)',
      icon: '⏰',
      description: '시간 분산 투자 전략'
    },
    {
      id: 'retirement' as const,
      name: '은퇴 자금',
      icon: '🏖️',
      description: '편안한 은퇴를 위한 계획'
    }
  ]

  return (
    <div className="w-full">
      {/* Desktop Tabs */}
      <div className="hidden sm:block">
        <div className="border-b border-gray-200 dark:border-gray-700 transition-colors">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span className="text-lg mr-2">{tab.icon}</span>
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          계산기 선택
        </label>
        <select
          id="tabs"
          name="tabs"
          value={activeTab}
          onChange={(e) => onTabChange(e.target.value as any)}
          className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 transition-colors"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.icon} {tab.name}
            </option>
          ))}
        </select>
      </div>

      {/* Active Tab Description */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
          {tabs.find(tab => tab.id === activeTab)?.description}
        </p>
      </div>
    </div>
  )
}
