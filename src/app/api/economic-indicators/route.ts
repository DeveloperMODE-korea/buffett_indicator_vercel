import { NextRequest, NextResponse } from 'next/server'

const FRED_API_KEY = process.env.NEXT_PUBLIC_FRED_API_KEY || process.env.FRED_API_KEY
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations'

interface FredResponse {
  observations: Array<{
    date: string
    value: string
  }>
}

async function fetchFredData(seriesId: string, startDate: string = '2010-01-01', frequency: string = 'm'): Promise<Array<{date: string, value: number}>> {
  try {
    const url = `${FRED_BASE_URL}?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&start_date=${startDate}&frequency=${frequency}&sort_order=desc&limit=60`
    
    console.log(`Fetching FRED data for ${seriesId}...`)
    console.log(`URL: ${url}`)
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`FRED API error: ${response.status} ${response.statusText}`)
    }
    
    const data: FredResponse = await response.json()
    
    return data.observations
      .filter(obs => obs.value !== '.' && obs.value !== '')
      .map(obs => ({
        date: obs.date,
        value: parseFloat(obs.value)
      }))
      .filter(obs => !isNaN(obs.value))
      .reverse() // 오래된 것부터 정렬
  } catch (error) {
    console.error(`Error fetching ${seriesId}:`, error)
    return []
  }
}

// 시장 지수 계산 (S&P 500 / GDP 비율)
async function calculateMarketGDPRatio(): Promise<Array<{date: string, value: number}>> {
  try {
    // S&P 500 지수
    const sp500Data = await fetchFredData('SP500', '2010-01-01')
    // GDP (십억 달러 단위)  
    const gdpData = await fetchFredData('GDP', '2010-01-01', 'q')
    
    console.log(`S&P 500 data points: ${sp500Data.length}`)
    console.log(`GDP data points: ${gdpData.length}`)
    
    // 날짜별로 매칭하여 시장/GDP 비율 계산
    const marketGDPData: Array<{date: string, value: number}> = []
    
    for (const sp500Point of sp500Data) {
      const matchingGdp = gdpData.find(gdpPoint => gdpPoint.date === sp500Point.date)
      if (matchingGdp && matchingGdp.value > 0 && sp500Point.value > 0) {
        // S&P 500 지수를 GDP(십억 달러)로 나누어 정규화
        const ratio = sp500Point.value / matchingGdp.value
        marketGDPData.push({
          date: sp500Point.date,
          value: parseFloat(ratio.toFixed(4))
        })
      }
    }
    
    console.log(`Calculated ${marketGDPData.length} Market/GDP ratio points`)
    return marketGDPData
  } catch (error) {
    console.error('Error calculating Market/GDP Ratio:', error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Starting economic indicators data fetch...')
    console.log('FRED API KEY available:', !!FRED_API_KEY)
    console.log('FRED API KEY (first 10 chars):', FRED_API_KEY?.substring(0, 10))
    
    // 병렬로 모든 데이터 가져오기
    const [
      marketGDPData,
      fedFundsData,
      inflationData,
      treasuryData,
      unemploymentData
    ] = await Promise.all([
      calculateMarketGDPRatio(),
      fetchFredData('FEDFUNDS', '2010-01-01'), // Federal Funds Rate
      fetchFredData('CPIAUCSL', '2010-01-01'), // CPI (Consumer Price Index)
      fetchFredData('DGS10', '2010-01-01'), // 10-Year Treasury Rate
      fetchFredData('UNRATE', '2010-01-01') // Unemployment Rate (P/E 비율 대신)
    ])
    
    // CPI를 연간 인플레이션율로 변환
    const inflationRateData: Array<{date: string, value: number}> = []
    for (let i = 12; i < inflationData.length; i++) { // 12개월(1년) 전과 비교
      const current = inflationData[i]
      const yearAgo = inflationData[i - 12]
      if (yearAgo && current.value > 0 && yearAgo.value > 0) {
        const inflationRate = ((current.value - yearAgo.value) / yearAgo.value) * 100
        inflationRateData.push({
          date: current.date,
          value: parseFloat(inflationRate.toFixed(2))
        })
      }
    }
    
    const response = {
      success: true,
      data: {
        buffettIndicator: marketGDPData.slice(-20), // 최근 20개 포인트
        unemploymentRate: unemploymentData.slice(-20),
        fedFundsRate: fedFundsData.slice(-20),
        inflationRate: inflationRateData.slice(-20),
        treasury10Year: treasuryData.slice(-20)
      },
      lastUpdated: new Date().toISOString(),
      dataPoints: {
        buffettIndicator: marketGDPData.length,
        unemploymentRate: unemploymentData.length,
        fedFundsRate: fedFundsData.length,
        inflationRate: inflationRateData.length,
        treasury10Year: treasuryData.length
      }
    }
    
    console.log('Economic indicators data fetch completed successfully')
    console.log('Data points:', response.dataPoints)
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in economic indicators API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch economic indicators',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
