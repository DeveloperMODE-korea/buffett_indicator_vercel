// 계산기 관련 타입 정의

export type CalculatorType = 'compound' | 'target' | 'dca' | 'retirement';

// 복리 계산 결과
export interface CompoundInterestResult {
  totalInvestment: number; // 총 투자원금
  finalAmount: number; // 최종 금액
  totalReturn: number; // 총 수익금
  returnRate: number; // 총 수익률
  yearlyData: YearlyData[]; // 연도별 데이터
}

export interface YearlyData {
  year: number;
  totalInvestment: number;
  balance: number;
  yearlyGain: number;
}

// 목표 수익률 계산 결과
export interface TargetReturnResult {
  requiredAnnualReturn: number; // 필요 연간 수익률
  requiredMonthlyReturn: number; // 필요 월간 수익률
  riskLevel: 'low' | 'medium' | 'high';
  achievable: boolean;
}

// DCA 계산 결과
export interface DCAResult {
  totalInvestment: number;
  estimatedValue: number;
  totalReturn: number;
  averageCostBasis: number;
  monthlyData: MonthlyData[];
}

export interface MonthlyData {
  month: number;
  investment: number;
  shares: number;
  totalShares: number;
  marketValue: number;
}

// 은퇴 자금 계산 결과
export interface RetirementResult {
  requiredAmount: number;
  currentShortfall: number;
  monthlyContributionNeeded: number;
  yearsToRetirement: number;
  inflationAdjustedAmount: number;
}
