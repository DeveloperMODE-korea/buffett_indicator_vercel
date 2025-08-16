import { FREDResponse, ApiResponse, BuffettIndicatorData, HistoricalData } from '@/types'

const FRED_API_KEY = process.env.NEXT_PUBLIC_FRED_API_KEY || process.env.FRED_API_KEY
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred'

/**
 * FRED API에서 GDP 데이터를 가져오는 함수
 * @param seriesId FRED 시리즈 ID (예: GDPC1 for Real GDP)
 * @param startDate 시작 날짜 (YYYY-MM-DD)
 * @param endDate 종료 날짜 (YYYY-MM-DD)
 */
export async function getFREDData(
  seriesId: string, 
  startDate?: string, 
  endDate?: string
): Promise<ApiResponse<FREDResponse>> {
  try {
    if (!FRED_API_KEY) {
      throw new Error('FRED API Key가 설정되지 않았습니다.')
    }

    const params = new URLSearchParams({
      series_id: seriesId,
      api_key: FRED_API_KEY,
      file_type: 'json',
      observation_start: startDate || '2000-01-01',
      observation_end: endDate || new Date().toISOString().split('T')[0],
    })

    const response = await fetch(`${FRED_BASE_URL}/series/observations?${params}`)
    
    if (!response.ok) {
      throw new Error(`FRED API 오류: ${response.statusText}`)
    }

    const data: FREDResponse = await response.json()
    
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error('FRED API 호출 오류:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'FRED API 호출 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 최신 GDP 데이터를 가져오는 함수
 */
export async function getLatestGDP(): Promise<ApiResponse<number>> {
  try {
    const response = await getFREDData('GDP') // 명목 GDP
    
    if (!response.success || !response.data) {
      throw new Error('GDP 데이터를 가져올 수 없습니다.')
    }

    const observations = response.data.observations
    const latestObservation = observations
      .filter(obs => obs.value && obs.value !== '.')
      .pop()

    if (!latestObservation) {
      throw new Error('유효한 GDP 데이터가 없습니다.')
    }

    return {
      success: true,
      data: parseFloat(latestObservation.value) * 1000000000, // 단위: 달러 (FRED는 10억 단위)
    }
  } catch (error) {
    console.error('GDP 데이터 조회 오류:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'GDP 데이터 조회 중 오류가 발생했습니다.',
    }
  }
}

/**
 * Wilshire 5000 시가총액 데이터를 가져오는 함수
 * 실제로는 다른 API나 데이터 소스를 사용해야 할 수 있습니다.
 */
export async function getWilshire5000Data(): Promise<ApiResponse<number>> {
  try {
    // Wilshire 5000 Total Market Index (WILL5000IND)
    const response = await getFREDData('WILL5000IND')
    
    if (!response.success || !response.data) {
      throw new Error('Wilshire 5000 데이터를 가져올 수 없습니다.')
    }

    const observations = response.data.observations
    const latestObservation = observations
      .filter(obs => obs.value && obs.value !== '.')
      .pop()

    if (!latestObservation) {
      throw new Error('유효한 Wilshire 5000 데이터가 없습니다.')
    }

    // Wilshire 5000 인덱스 값을 시가총액으로 변환 (근사치)
    // 실제 변환 공식은 더 복잡할 수 있습니다
    const indexValue = parseFloat(latestObservation.value)
    const estimatedMarketCap = indexValue * 1000000000 // 임시 변환 공식

    return {
      success: true,
      data: estimatedMarketCap,
    }
  } catch (error) {
    console.error('Wilshire 5000 데이터 조회 오류:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Wilshire 5000 데이터 조회 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 버핏 지수를 계산하는 함수
 */
export async function calculateBuffettIndicator(): Promise<ApiResponse<BuffettIndicatorData>> {
  try {
    const [gdpResponse, marketCapResponse] = await Promise.all([
      getLatestGDP(),
      getWilshire5000Data(),
    ])

    if (!gdpResponse.success || !gdpResponse.data) {
      throw new Error(`GDP 데이터 오류: ${gdpResponse.error}`)
    }

    if (!marketCapResponse.success || !marketCapResponse.data) {
      throw new Error(`시가총액 데이터 오류: ${marketCapResponse.error}`)
    }

    const gdp = gdpResponse.data
    const marketCap = marketCapResponse.data
    const buffettIndicator = (marketCap / gdp) * 100

    // 시장 상태 판단
    let status: 'undervalued' | 'fair' | 'overvalued'
    if (buffettIndicator < 70) {
      status = 'undervalued'
    } else if (buffettIndicator <= 120) {
      status = 'fair'
    } else {
      status = 'overvalued'
    }

    // 전일 대비 변화율 계산 (임시로 랜덤 값 사용)
    // 실제로는 이전 날짜의 데이터와 비교해야 합니다
    const changePercent = (Math.random() - 0.5) * 5 // -2.5% ~ +2.5%

    const data: BuffettIndicatorData = {
      currentValue: buffettIndicator,
      changePercent,
      lastUpdated: new Date().toISOString(),
      status,
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error('버핏 지수 계산 오류:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '버핏 지수 계산 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 히스토리 데이터를 가져오는 함수
 */
export async function getHistoricalData(years: number = 5): Promise<ApiResponse<HistoricalData[]>> {
  try {
    const startDate = new Date()
    startDate.setFullYear(startDate.getFullYear() - years)
    const startDateStr = startDate.toISOString().split('T')[0]

    const [gdpResponse, marketCapResponse] = await Promise.all([
      getFREDData('GDP', startDateStr),
      getFREDData('WILL5000IND', startDateStr),
    ])

    if (!gdpResponse.success || !marketCapResponse.success) {
      throw new Error('히스토리 데이터를 가져올 수 없습니다.')
    }

    // 데이터 결합 및 버핏 지수 계산
    const historicalData: HistoricalData[] = []
    
    // 실제 구현에서는 두 데이터셋을 날짜별로 매칭하여 계산해야 합니다
    // 여기서는 간단한 예시만 제공합니다

    return {
      success: true,
      data: historicalData,
    }
  } catch (error) {
    console.error('히스토리 데이터 조회 오류:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '히스토리 데이터 조회 중 오류가 발생했습니다.',
    }
  }
}
