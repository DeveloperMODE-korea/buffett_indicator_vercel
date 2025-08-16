import { NextRequest, NextResponse } from 'next/server'

const FRED_API_KEY = process.env.FRED_API_KEY
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred/series/observations'

interface FredResponse {
  observations: Array<{
    date: string
    value: string
  }>
}

async function fetchFredData(seriesId: string, startDate: string = '2010-01-01'): Promise<Array<{date: string, value: number}>> {
  try {
    const url = `${FRED_BASE_URL}?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&start_date=${startDate}&frequency=q&sort_order=desc&limit=60`
    
    console.log(`Fetching FRED data for ${seriesId}...`)
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

// 버핏 지수 계산 (총 시가총액 / GDP * 100)
async function calculateBuffettIndicator(): Promise<Array<{date: string, value: number}>> {
  try {
    // Wilshire 5000 Total Market Index (조 달러 단위)
    const marketCapData = await fetchFredData('WILL5000INDFC', '2010-01-01')
    // GDP (십억 달러 단위)
    const gdpData = await fetchFredData('GDP', '2010-01-01')
    
    console.log(`Market cap data points: ${marketCapData.length}`)
    console.log(`GDP data points: ${gdpData.length}`)
    
    // 날짜별로 매칭하여 버핏 지수 계산
    const buffettData: Array<{date: string, value: number}> = []
    
    for (const mcPoint of marketCapData) {
      const matchingGdp = gdpData.find(gdpPoint => gdpPoint.date === mcPoint.date)
      if (matchingGdp && matchingGdp.value > 0 && mcPoint.value > 0) {
        // Market Cap은 백만 달러, GDP는 십억 달러이므로 단위 맞춤
        const ratio = (mcPoint.value / 1000) / matchingGdp.value * 100
        buffettData.push({
          date: mcPoint.date,
          value: parseFloat(ratio.toFixed(2))
        })
      }
    }
    
    console.log(`Calculated ${buffettData.length} Buffett Indicator points`)
    return buffettData
  } catch (error) {
    console.error('Error calculating Buffett Indicator:', error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Starting economic indicators data fetch...')
    
    // 병렬로 모든 데이터 가져오기
    const [
      buffettData,
      peRatioData,
      fedFundsData,
      inflationData,
      treasuryData
    ] = await Promise.all([
      calculateBuffettIndicator(),
      fetchFredData('MULTPL/SP500_PE_RATIO_MONTH', '2010-01-01'), // S&P 500 P/E Ratio
      fetchFredData('FEDFUNDS', '2010-01-01'), // Federal Funds Rate
      fetchFredData('CPIAUCSL', '2010-01-01'), // CPI (Consumer Price Index)
      fetchFredData('DGS10', '2010-01-01') // 10-Year Treasury Rate
    ])
    
    // CPI를 연간 인플레이션율로 변환
    const inflationRateData: Array<{date: string, value: number}> = []
    for (let i = 4; i < inflationData.length; i++) { // 4분기(1년) 전과 비교
      const current = inflationData[i]
      const yearAgo = inflationData[i - 4]
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
        buffettIndicator: buffettData.slice(-20), // 최근 20개 포인트
        peRatio: peRatioData.slice(-20),
        fedFundsRate: fedFundsData.slice(-20),
        inflationRate: inflationRateData.slice(-20),
        treasury10Year: treasuryData.slice(-20)
      },
      lastUpdated: new Date().toISOString(),
      dataPoints: {
        buffettIndicator: buffettData.length,
        peRatio: peRatioData.length,
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
