// 버핏 지수 데이터 타입
export interface BuffettIndicatorData {
  currentValue: number; // 현재 버핏 지수 값
  changePercent: number; // 전일 대비 변화율
  lastUpdated: string; // 마지막 업데이트 시간
  status: 'undervalued' | 'fair' | 'overvalued'; // 시장 상태
}

// 히스토리 데이터 타입
export interface HistoricalData {
  date: string;
  value: number;
  gdp: number;
  marketCap: number;
}

// FRED API 응답 타입
export interface FREDResponse {
  realtime_start: string;
  realtime_end: string;
  observation_start: string;
  observation_end: string;
  units: string;
  output_type: number;
  file_type: string;
  order_by: string;
  sort_order: string;
  count: number;
  offset: number;
  limit: number;
  observations: FREDObservation[];
}

export interface FREDObservation {
  realtime_start: string;
  realtime_end: string;
  date: string;
  value: string;
}

// Google Finance 데이터 타입 (실제로는 대체 API 사용 예정)
export interface MarketCapData {
  symbol: string;
  price: number;
  marketCap: number;
  timestamp: string;
}

// API 응답 공통 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 차트 데이터 타입
export interface ChartDataPoint {
  x: string | Date;
  y: number;
}
