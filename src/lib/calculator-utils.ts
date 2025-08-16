// 투자 계산 관련 유틸리티 함수들

// 복리 계산 결과 타입
export interface CompoundInterestResult {
  totalInvestment: number;    // 총 투자원금
  finalAmount: number;        // 최종 금액
  totalReturn: number;        // 총 수익금
  returnRate: number;         // 총 수익률
  yearlyData: YearlyData[];   // 연도별 데이터
}

export interface YearlyData {
  year: number;
  totalInvestment: number;
  balance: number;
  yearlyGain: number;
}

// 목표 수익률 계산 결과 타입
export interface TargetReturnResult {
  requiredAnnualReturn: number;   // 필요 연간 수익률
  requiredMonthlyReturn: number;  // 필요 월간 수익률
  riskLevel: 'low' | 'medium' | 'high';
  achievable: boolean;
}

/**
 * 복리 계산 함수
 * @param principal 초기 투자금
 * @param monthlyContribution 월 추가 투자금
 * @param annualRate 연 수익률 (퍼센트)
 * @param years 투자 기간 (년)
 * @param compoundingFrequency 복리 주기 (연: 1, 월: 12)
 */
export function calculateCompoundInterest({
  principal,
  monthlyContribution,
  annualRate,
  years,
  compoundingFrequency = 12
}: {
  principal: number;
  monthlyContribution: number;
  annualRate: number;
  years: number;
  compoundingFrequency?: number;
}): CompoundInterestResult {
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;
  
  let balance = principal;
  const yearlyData: YearlyData[] = [];
  
  // 월별 계산
  for (let month = 1; month <= totalMonths; month++) {
    // 이자 적용
    balance = balance * (1 + monthlyRate);
    
    // 월 투자금 추가 (첫 달 제외)
    if (month > 1) {
      balance += monthlyContribution;
    }
    
    // 연말마다 데이터 저장
    if (month % 12 === 0) {
      const year = month / 12;
      const totalInvestment = principal + (monthlyContribution * (month - 1));
      
      yearlyData.push({
        year,
        totalInvestment,
        balance,
        yearlyGain: balance - totalInvestment
      });
    }
  }
  
  const totalInvestment = principal + (monthlyContribution * (totalMonths - 1));
  const finalAmount = balance;
  const totalReturn = finalAmount - totalInvestment;
  const returnRate = (totalReturn / totalInvestment) * 100;
  
  return {
    totalInvestment,
    finalAmount,
    totalReturn,
    returnRate,
    yearlyData
  };
}

/**
 * 목표 수익률 계산 함수
 * @param currentAsset 현재 자산
 * @param targetAsset 목표 자산
 * @param years 투자 기간
 * @param monthlyContribution 월 추가 투자금 (선택사항)
 */
export function calculateTargetReturn({
  currentAsset,
  targetAsset,
  years,
  monthlyContribution = 0
}: {
  currentAsset: number;
  targetAsset: number;
  years: number;
  monthlyContribution?: number;
}): TargetReturnResult {
  const totalMonthlyContributions = monthlyContribution * years * 12;
  const totalStartingCapital = currentAsset + totalMonthlyContributions;
  
  // 복리 계산을 통한 필요 수익률 계산
  const requiredAnnualReturn = Math.pow(targetAsset / currentAsset, 1 / years) - 1;
  const requiredMonthlyReturn = Math.pow(1 + requiredAnnualReturn, 1 / 12) - 1;
  
  // 리스크 레벨 판단
  let riskLevel: 'low' | 'medium' | 'high';
  if (requiredAnnualReturn <= 0.07) {
    riskLevel = 'low';
  } else if (requiredAnnualReturn <= 0.12) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'high';
  }
  
  // 달성 가능성 (연 15% 이상은 매우 어려움으로 판단)
  const achievable = requiredAnnualReturn <= 0.15;
  
  return {
    requiredAnnualReturn: requiredAnnualReturn * 100,
    requiredMonthlyReturn: requiredMonthlyReturn * 100,
    riskLevel,
    achievable
  };
}

/**
 * 숫자를 한국어 형식으로 포맷팅 (천 단위 콤마)
 * @param num 숫자
 * @param decimals 소수점 자리수
 */
export function formatCurrency(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('ko-KR').format(Number(num.toFixed(decimals)));
}

// DCA 계산 결과 타입
export interface DCAResult {
  totalInvestment: number;      // 총 투자금
  estimatedValue: number;       // 예상 자산가치
  totalReturn: number;          // 총 수익금
  returnRate: number;           // 수익률
  monthlyData: DCAMonthlyData[]; // 월별 데이터
  scenarios: {
    pessimistic: number;        // 비관적 시나리오
    realistic: number;          // 현실적 시나리오
    optimistic: number;         // 낙관적 시나리오
  };
}

export interface DCAMonthlyData {
  month: number;
  investment: number;
  cumulativeInvestment: number;
  estimatedValue: number;
  gain: number;
}

/**
 * DCA(정기투자) 계산 함수
 * @param monthlyInvestment 월 투자금
 * @param years 투자 기간
 * @param annualReturn 예상 연간 수익률
 * @param volatility 변동성 (표준편차)
 */
export function calculateDCA({
  monthlyInvestment,
  years,
  annualReturn,
  volatility = 15
}: {
  monthlyInvestment: number;
  years: number;
  annualReturn: number;
  volatility?: number;
}): DCAResult {
  const monthlyReturn = annualReturn / 100 / 12;
  const totalMonths = years * 12;
  const totalInvestment = monthlyInvestment * totalMonths;
  
  // 복리 계산으로 예상 가치 계산
  let estimatedValue = 0;
  const monthlyData: DCAMonthlyData[] = [];
  
  for (let month = 1; month <= totalMonths; month++) {
    // 매월 투자금을 투자하고, 기존 자산에는 수익률 적용
    estimatedValue = (estimatedValue * (1 + monthlyReturn)) + monthlyInvestment;
    const cumulativeInvestment = monthlyInvestment * month;
    const gain = estimatedValue - cumulativeInvestment;
    
    monthlyData.push({
      month,
      investment: monthlyInvestment,
      cumulativeInvestment,
      estimatedValue,
      gain
    });
  }
  
  const totalReturn = estimatedValue - totalInvestment;
  const returnRate = (totalReturn / totalInvestment) * 100;
  
  // 시나리오 계산 (변동성 고려)
  const pessimisticReturn = (annualReturn - volatility) / 100;
  const optimisticReturn = (annualReturn + volatility) / 100;
  
  const scenarios = {
    pessimistic: calculateDCAScenario(monthlyInvestment, years, pessimisticReturn),
    realistic: estimatedValue,
    optimistic: calculateDCAScenario(monthlyInvestment, years, optimisticReturn)
  };
  
  return {
    totalInvestment,
    estimatedValue,
    totalReturn,
    returnRate,
    monthlyData,
    scenarios
  };
}

function calculateDCAScenario(monthlyInvestment: number, years: number, annualReturn: number): number {
  const monthlyReturn = annualReturn / 12;
  const totalMonths = years * 12;
  let value = 0;
  
  for (let month = 1; month <= totalMonths; month++) {
    value = (value * (1 + monthlyReturn)) + monthlyInvestment;
  }
  
  return value;
}

// 은퇴 계산 결과 타입
export interface RetirementResult {
  requiredAmount: number;           // 필요한 은퇴 자금
  inflationAdjustedAmount: number;  // 인플레이션 조정 금액
  currentShortfall: number;         // 현재 부족분
  monthlyContributionNeeded: number; // 필요한 월 적립금
  yearsToRetirement: number;        // 은퇴까지 남은 년수
  monthlyIncomeAtRetirement: number; // 은퇴 후 월 소득
}

/**
 * 은퇴 자금 계산 함수
 * @param currentAge 현재 나이
 * @param retirementAge 은퇴 희망 나이
 * @param currentAsset 현재 자산
 * @param monthlyExpense 은퇴 후 월 생활비
 * @param lifeExpectancy 예상 수명
 * @param inflationRate 인플레이션율
 * @param expectedReturn 예상 투자 수익률
 */
export function calculateRetirement({
  currentAge,
  retirementAge,
  currentAsset,
  monthlyExpense,
  lifeExpectancy,
  inflationRate,
  expectedReturn
}: {
  currentAge: number;
  retirementAge: number;
  currentAsset: number;
  monthlyExpense: number;
  lifeExpectancy: number;
  inflationRate: number;
  expectedReturn: number;
}): RetirementResult {
  const yearsToRetirement = retirementAge - currentAge;
  const retirementYears = lifeExpectancy - retirementAge;
  
  // 인플레이션을 고려한 미래 생활비
  const futureMonthlyExpense = monthlyExpense * Math.pow(1 + inflationRate / 100, yearsToRetirement);
  
  // 은퇴 기간 동안 필요한 총 자금 (인플레이션 고려)
  let requiredAmount = 0;
  for (let year = 0; year < retirementYears; year++) {
    const yearlyExpense = futureMonthlyExpense * 12 * Math.pow(1 + inflationRate / 100, year);
    // 은퇴 후에도 자산이 성장한다고 가정 (보수적으로 인플레이션율 적용)
    const discountRate = Math.pow(1 + inflationRate / 100, year);
    requiredAmount += yearlyExpense / discountRate;
  }
  
  const inflationAdjustedAmount = requiredAmount;
  
  // 현재 자산이 은퇴 시점까지 성장할 금액
  const futureCurrentAsset = currentAsset * Math.pow(1 + expectedReturn / 100, yearsToRetirement);
  
  // 부족분 계산
  const currentShortfall = Math.max(0, requiredAmount - futureCurrentAsset);
  
  // 필요한 월 적립금 계산 (연금 적립 공식)
  const monthlyReturn = expectedReturn / 100 / 12;
  const totalMonths = yearsToRetirement * 12;
  
  let monthlyContributionNeeded = 0;
  if (currentShortfall > 0) {
    if (monthlyReturn > 0) {
      monthlyContributionNeeded = currentShortfall * monthlyReturn / (Math.pow(1 + monthlyReturn, totalMonths) - 1);
    } else {
      monthlyContributionNeeded = currentShortfall / totalMonths;
    }
  }
  
  const monthlyIncomeAtRetirement = requiredAmount / (retirementYears * 12);
  
  return {
    requiredAmount: inflationAdjustedAmount,
    inflationAdjustedAmount,
    currentShortfall,
    monthlyContributionNeeded,
    yearsToRetirement,
    monthlyIncomeAtRetirement
  };
}

/**
 * 금액을 억, 만 단위로 변환
 * @param amount 금액
 */
export function formatKoreanCurrency(amount: number): string {
  if (amount >= 100000000) {
    const eok = Math.floor(amount / 100000000);
    const man = Math.floor((amount % 100000000) / 10000);
    if (man > 0) {
      return `${eok}억 ${man}만원`;
    }
    return `${eok}억원`;
  } else if (amount >= 10000) {
    const man = Math.floor(amount / 10000);
    const remainder = amount % 10000;
    if (remainder > 0) {
      return `${man}만 ${formatCurrency(remainder)}원`;
    }
    return `${man}만원`;
  }
  return `${formatCurrency(amount)}원`;
}
