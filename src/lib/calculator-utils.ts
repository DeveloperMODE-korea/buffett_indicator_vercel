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
