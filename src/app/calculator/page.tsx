'use client';

import { useState } from 'react';
import CalculatorTabs from '@/components/calculator/CalculatorTabs';
import CompoundCalculator from '@/components/calculator/CompoundCalculator';
import TargetReturnCalculator from '@/components/calculator/TargetReturnCalculator';
import DCACalculator from '@/components/calculator/DCACalculator';
import RetirementCalculator from '@/components/calculator/RetirementCalculator';

type CalculatorType = 'compound' | 'target' | 'dca' | 'retirement';

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<CalculatorType>('compound');

  const renderCalculator = () => {
    switch (activeTab) {
      case 'compound':
        return <CompoundCalculator />;
      case 'target':
        return <TargetReturnCalculator />;
      case 'dca':
        return <DCACalculator />;
      case 'retirement':
        return <RetirementCalculator />;
      default:
        return <CompoundCalculator />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
          💰 투자 계산기 센터
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors">
          복리의 힘을 계산하고, 투자 목표를 달성하기 위한 전략을 세워보세요.
          다양한 시나리오를 시뮬레이션하여 현명한 투자 결정을 내릴 수 있습니다.
        </p>
      </div>

      {/* Calculator Tabs */}
      <CalculatorTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Calculator Content */}
      <div className="mt-8">{renderCalculator()}</div>

      {/* Info Section */}
      <div className="mt-16 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg transition-colors">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2 transition-colors">
            💡 투자 계산기 활용 팁
          </h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1 transition-colors">
            <p>• 현실적인 수익률을 설정하세요 (S&P 500 장기 평균: 연 7~10%)</p>
            <p>• 인플레이션(연 2~3%)을 고려하여 계획하세요</p>
            <p>• 다양한 시나리오를 시뮬레이션해보고 리스크를 관리하세요</p>
            <p>• 정기적인 투자가 복리 효과를 극대화합니다</p>
          </div>
        </div>
      </div>
    </div>
  );
}
