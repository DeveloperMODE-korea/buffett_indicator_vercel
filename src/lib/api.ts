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

// 중복된 구글 파이낸스 함수 제거됨 - getWilshire5000Data()에서 통합 처리

/**
 * FRED API에서 Wilshire 5000 데이터를 가져오는 백업 함수
 */
export async function getWilshire5000FromFRED(): Promise<ApiResponse<number>> {
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

    const indexValue = parseFloat(latestObservation.value)
    console.log(`FRED Wilshire 5000 Index: ${indexValue}`)
    
    return {
      success: true,
      data: indexValue,
    }
  } catch (error) {
    console.error('FRED Wilshire 5000 데이터 조회 오류:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Wilshire 5000 데이터 조회 중 오류가 발생했습니다.',
    }
  }
}

/**
 * Google Finance에서 Wilshire 5000 데이터를 가져오는 함수 (Python 버전 기반)
 */
export async function getWilshire5000Data(): Promise<ApiResponse<number>> {
  try {
    console.log('Google Finance에서 Wilshire 5000 데이터 가져오는 중...')
    
    // Python 코드와 동일한 URL 사용
    const url = 'https://www.google.com/finance/quote/FTW5000:INDEXNYSEGIS?hl=en'
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      },
    })

    if (!response.ok) {
      throw new Error(`Google Finance HTTP 오류: ${response.status}`)
    }

    const html = await response.text()
    
    // Python 코드와 동일한 클래스 패턴들 사용
    const pricePatterns = [
      /<div[^>]*class="YMlKec fxKbKc"[^>]*>([0-9,]+\.?[0-9]*)<\/div>/i,
      /<div[^>]*class="[^"]*YMlKec[^"]*"[^>]*>([0-9,]+\.?[0-9]*)<\/div>/i,
      /data-last-price="([0-9,]+\.?[0-9]*)"/i
    ]
    
    let wilshireValue = null
    for (const pattern of pricePatterns) {
      const match = html.match(pattern)
      if (match && match[1]) {
        const priceText = match[1].replace(/,/g, '')
        wilshireValue = parseFloat(priceText)
        console.log(`✅ Google Finance에서 Wilshire 5000 스크래핑 성공: ${priceText}`)
        break
      }
    }
    
    if (wilshireValue && !isNaN(wilshireValue)) {
      return {
        success: true,
        data: wilshireValue, // 원본 지수값 반환 (Python 코드와 동일)
      }
    } else {
      throw new Error('Google Finance에서 Wilshire 5000 가격을 찾을 수 없음')
    }
  } catch (error) {
    console.error('Google Finance 스크래핑 오류:', error)
    console.log('FRED API로 대체 시도...')
    
    // 백업: FRED API 사용
    return await getWilshire5000FromFRED()
  }
}

// 변화율 계산 함수 제거됨 - Python 코드에서는 변화율 계산하지 않음

/**
 * 버핏 지수를 계산하는 함수 (Python 코드와 동일한 로직)
 */
export async function calculateBuffettIndicator(): Promise<ApiResponse<BuffettIndicatorData>> {
  try {
    const [gdpResponse, wilshireResponse] = await Promise.all([
      getLatestGDP(),
      getWilshire5000Data(),
    ])

    if (!gdpResponse.success || !gdpResponse.data) {
      throw new Error(`GDP 데이터 오류: ${gdpResponse.error}`)
    }

    if (!wilshireResponse.success || !wilshireResponse.data) {
      throw new Error(`Wilshire 5000 데이터 오류: ${wilshireResponse.error}`)
    }

    const gdpBillions = gdpResponse.data / 1000000000 // 달러를 10억 달러 단위로 변환
    const wilshireIndex = wilshireResponse.data // 원본 Wilshire 5000 지수값

    // Python 코드와 정확히 동일한 계산 로직
    const marketCapTrillions = wilshireIndex / 1000 // Wilshire 5000 index를 조 달러로 변환
    const gdpTrillions = gdpBillions / 1000 // GDP를 조 달러로 변환
    const buffettRatio = (marketCapTrillions / gdpTrillions) * 100

    console.log(`🔢 현재 버핏 지수: ${buffettRatio.toFixed(2)}%`)
    console.log(`📊 상세 정보:`)
    console.log(`- Wilshire 5000 지수: ${wilshireIndex.toLocaleString()}`)
    console.log(`- 미국 주식시장 가치: $${marketCapTrillions.toFixed(3)} 조달러`)
    console.log(`- 미국 GDP: $${gdpTrillions.toFixed(3)} 조달러 ($${gdpBillions.toFixed(2)} 십억달러)`)
    console.log(`💡 계산: (${marketCapTrillions.toFixed(3)}T ÷ ${gdpTrillions.toFixed(3)}T) × 100 = ${buffettRatio.toFixed(2)}%`)

    // Python 버전과 동일한 해석 기준
    let status: 'undervalued' | 'fair' | 'overvalued'
    let interpretation = ''
    
    if (buffettRatio < 75) {
      status = 'undervalued'
      interpretation = '🟢 주식시장이 상당히 저평가되어 있습니다.'
    } else if (buffettRatio < 90) {
      status = 'fair'
      interpretation = '🔵 주식시장이 적정하게 평가되어 있습니다.'
    } else if (buffettRatio < 115) {
      status = 'fair'
      interpretation = '🟡 주식시장이 다소 고평가되어 있습니다.'
    } else if (buffettRatio < 140) {
      status = 'overvalued'
      interpretation = '🟠 주식시장이 상당히 고평가되어 있습니다.'
    } else {
      status = 'overvalued'
      interpretation = '🔴 주식시장이 극도로 고평가되어 있습니다. 주의가 필요합니다.'
    }

    console.log(`📈 버핏 지수 해석: ${interpretation}`)

    const data: BuffettIndicatorData = {
      currentValue: Math.round(buffettRatio * 100) / 100, // 소수점 둘째자리까지
      changePercent: 0, // 변화율 계산 제거
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
