import { NextResponse } from 'next/server'

// 임시 모의 데이터 생성
function generateMockData(baseValue: number, volatility: number, count: number = 20): Array<{date: string, value: number}> {
  const data: Array<{date: string, value: number}> = []
  const startDate = new Date('2020-01-01')
  
  for (let i = 0; i < count; i++) {
    const date = new Date(startDate)
    date.setMonth(startDate.getMonth() + i * 3) // 분기별 데이터
    
    // 랜덤 변동성을 추가하여 리얼한 데이터 생성
    const randomChange = (Math.random() - 0.5) * volatility
    const trendValue = baseValue + (Math.sin(i * 0.3) * volatility * 0.5) // 약간의 트렌드 추가
    const finalValue = Math.max(0.01, trendValue + randomChange) // 최소값 보장
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(finalValue.toFixed(4))
    })
  }
  
  return data
}

// 인플레이션율 모의 데이터 (연간 증가율)
function generateInflationData(): Array<{date: string, value: number}> {
  const data: Array<{date: string, value: number}> = []
  const startDate = new Date('2020-01-01')
  const baseValues = [1.2, 1.5, 2.1, 3.2, 4.1, 3.8, 2.9, 2.1, 1.8, 2.3, 2.6, 2.2, 1.9, 2.4, 2.8, 3.1, 2.7, 2.3, 2.0, 2.2]
  
  for (let i = 0; i < baseValues.length; i++) {
    const date = new Date(startDate)
    date.setMonth(startDate.getMonth() + i * 3)
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: baseValues[i]
    })
  }
  
  return data
}

export async function GET() {
  try {
    // 실제같은 모의 데이터 생성
    const mockData = {
      // 시장/GDP 비율 (S&P 500 지수 정규화)
      buffettIndicator: generateMockData(0.15, 0.05), // 기본값 0.15, 변동성 0.05
      
      // 실업률 (3-8% 범위)
      unemploymentRate: generateMockData(5.2, 1.8),
      
      // 연방기금금리 (0-6% 범위)
      fedFundsRate: generateMockData(2.5, 2.0),
      
      // 인플레이션율 (실제같은 패턴)
      inflationRate: generateInflationData(),
      
      // 10년 국채금리 (2-5% 범위)
      treasury10Year: generateMockData(3.2, 1.5)
    }
    
    console.log('📊 Mock data generated successfully')
    console.log('Data points:', {
      buffettIndicator: mockData.buffettIndicator.length,
      unemploymentRate: mockData.unemploymentRate.length,
      fedFundsRate: mockData.fedFundsRate.length,
      inflationRate: mockData.inflationRate.length,
      treasury10Year: mockData.treasury10Year.length
    })
    
    const response = {
      success: true,
      data: mockData,
      lastUpdated: new Date().toISOString(),
      dataPoints: {
        buffettIndicator: mockData.buffettIndicator.length,
        unemploymentRate: mockData.unemploymentRate.length,
        fedFundsRate: mockData.fedFundsRate.length,
        inflationRate: mockData.inflationRate.length,
        treasury10Year: mockData.treasury10Year.length
      },
      isMockData: true,
      note: 'This is mock data for testing purposes. Real FRED API key needed for actual data.'
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('🚨 Mock API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
