# Yahoo Finance API 가이드 (yahoo-finance2)

이 문서는 `yahoo-finance2` 라이브러리를 사용하여 Yahoo Finance API에서 금융 데이터를 가져오는 방법을 설명합니다.

## 설치

```bash
npm install yahoo-finance2
```

## 기본 사용법

### 라이브러리 임포트

**ES 모듈 (권장):**
```javascript
import yahooFinance from 'yahoo-finance2';
```

**CommonJS:**
```javascript
const yahooFinance = require('yahoo-finance2').default; // NOTE the .default
```

### 에러 처리

모든 Yahoo Finance API 호출은 try-catch 블록으로 감싸는 것이 좋습니다:

```javascript
let result;
try {
  result = await yahooFinance.quote(symbol);
} catch (error) {
  console.warn(`Skipping yf.quote("${symbol}"): [${error.name}] ${error.message}`);
  return;
}
```

## 주요 API 모듈

### 1. 주식 시세 조회 (Quote)

#### 단일 주식 시세
```javascript
const result = await yahooFinance.quote('AAPL');
```

#### 여러 주식 시세
```javascript
const results = await yahooFinance.quote(['AAPL', 'GOOGL', 'MSFT']);
```

#### 특정 필드만 조회
```javascript
const result = await yahooFinance.quote('TSLA', { 
  fields: ['symbol', 'displayName', 'regularMarketPrice'] 
});
```

#### 반환 형식 변경
```javascript
// Map 형태로 반환
const map = await yahooFinance.quote(['AAPL', 'GOOGL'], { return: "map" });

// Object 형태로 반환
const object = await yahooFinance.quote(['AAPL', 'GOOGL'], { return: "object" });
```

### 2. 역사적 데이터 (Historical)

```javascript
const query = 'TSLA';
const queryOptions = { 
  period1: '2021-02-01',
  period2: '2021-02-28',
  interval: '1d'
};
const result = await yahooFinance.historical(query, queryOptions);
```

**반환 데이터 예시:**
```javascript
[
  {
    date: new Date("2021-02-01T00:00:00.000Z"),
    open: 814.289978,
    high: 842,
    low: 795.559998,
    close: 839.809998,
    adjClose: 839.809998,
    volume: 25391400
  },
  // ...
]
```

### 3. 차트 데이터 (Chart)

#### 배열 형태 (기본)
```javascript
const query = 'AAPL';
const queryOptions = { 
  period1: '2021-05-08',
  period2: '2021-05-15',
  interval: '1d'
};
const result = await yahooFinance.chart(query, queryOptions);
```

#### 객체 형태
```javascript
const queryOptions = { 
  period1: '2021-05-08',
  return: "object"
};
const result = await yahooFinance.chart('AAPL', queryOptions);
```

### 4. 기업 요약 정보 (QuoteSummary)

`quoteSummary`는 다양한 모듈을 통해 상세한 기업 정보를 제공합니다.

#### 기본 사용법
```javascript
const symbol = 'AAPL';
const queryOptions = { modules: ['price', 'summaryDetail'] };
const result = await yahooFinance.quoteSummary(symbol, queryOptions);
```

#### 주요 모듈들

**가격 정보 (price):**
```javascript
await yahooFinance.quoteSummary('TSLA', { modules: ['price'] });
```

**요약 정보 (summaryDetail):**
```javascript
await yahooFinance.quoteSummary('AMZN', { modules: ['summaryDetail'] });
```

**재무 데이터 (financialData):**
```javascript
await yahooFinance.quoteSummary('TSLA', { modules: ['financialData'] });
```

**기업 프로필 (assetProfile):**
```javascript
await yahooFinance.quoteSummary('AAPL', { modules: ['assetProfile'] });
```

**수익 정보 (earnings):**
```javascript
await yahooFinance.quoteSummary('AAPL', { modules: ['earnings'] });
```

**대차대조표 (balanceSheetHistory/balanceSheetHistoryQuarterly):**
```javascript
// 연간
await yahooFinance.quoteSummary('BABA', { modules: ['balanceSheetHistory'] });

// 분기별
await yahooFinance.quoteSummary('BIDU', { modules: ['balanceSheetHistoryQuarterly'] });
```

**손익계산서 (incomeStatementHistory/incomeStatementHistoryQuarterly):**
```javascript
// 연간
await yahooFinance.quoteSummary('PLTR', { modules: ['incomeStatementHistory'] });

// 분기별
await yahooFinance.quoteSummary('PLTR', { modules: ['incomeStatementHistoryQuarterly'] });
```

**현금흐름표 (cashflowStatementHistory/cashflowStatementHistoryQuarterly):**
```javascript
// 연간
await yahooFinance.quoteSummary('KO', { modules: ['cashflowStatementHistory'] });

// 분기별
await yahooFinance.quoteSummary('PLTR', { modules: ['cashflowStatementHistoryQuarterly'] });
```

### 5. 기본 지표 시계열 (FundamentalsTimeSeries)

```javascript
const query = 'AAPL';
const queryOptions = { 
  module: 'fundamentalsTimeSeries',  // 필수 매개변수
  type: [
    'quarterlyTotalAssets',
    'quarterlyTotalLiabilitiesNetMinorityInterest',
    'quarterlyTotalRevenue',
    'quarterlyNetIncome'
  ],
  period1: '2020-01-01',
  period2: '2023-12-31'
};
const result = await yahooFinance.fundamentalsTimeSeries(query, queryOptions);
```

**반환 데이터 예시:**
```javascript
{
  date: 2023-06-30T00:00:00.000Z,
  quarterlyCurrentDebt: 11209000000,
  quarterlyTotalEquityGrossMinorityInterest: 60274000000,
  quarterlyCashFinancial: 25337000000,
  quarterlyInventory: 7351000000,
  // ... 더 많은 재무 지표들
}
```

### 6. 옵션 데이터 (Options)

```javascript
const symbol = 'AYX';
const queryOptions = { 
  lang: 'en-US', 
  formatted: false, 
  region: 'US' 
};
const result = await yahooFinance.options(symbol, queryOptions);
```

**반환 데이터 구조:**
```javascript
{
  underlyingSymbol: 'AYX',
  expirationDates: [
    new Date('2021-04-16T00:00:00.000Z'),
    new Date('2021-05-21T00:00:00.000Z'),
    // ...
  ],
  strikes: [45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
  quote: {
    // 기본 주식 정보
  },
  options: [
    {
      expirationDate: new Date('2021-04-16T00:00:00.000Z'),
      calls: [
        {
          contractSymbol: 'AYX210416C00155000',
          strike: 155,
          lastPrice: 0.13,
          bid: 0,
          ask: 0.86,
          volume: 2,
          openInterest: 5,
          impliedVolatility: 1.3984405078125,
          inTheMoney: false
        }
      ],
      puts: [
        {
          contractSymbol: 'AYX210416P00045000',
          strike: 45,
          lastPrice: 0.16,
          bid: 0,
          ask: 0.32,
          volume: 8,
          openInterest: 118,
          impliedVolatility: 1.2656286718749998,
          inTheMoney: false
        }
      ]
    }
  ]
}
```

### 7. 주식 검색 (Search)

```javascript
const query = 'AAPL';
const result = await yahooFinance.search(query);
```

### 8. 인사이트 (Insights)

```javascript
const symbol = 'AYX';
const queryOptions = { 
  lang: 'en-US', 
  reportsCount: 2, 
  region: 'US' 
};
const result = await yahooFinance.insights(symbol, queryOptions);
```

### 9. 트렌딩 주식 (TrendingSymbols)

```javascript
const queryOptions = { count: 5, lang: 'en-US' };
const result = await yahooFinance.trendingSymbols('US', queryOptions);
```

### 10. 일일 상승/하락 주식

#### 상승 주식
```javascript
const queryOptions = { count: 5, region: 'US', lang: 'en-US' };
const result = await yahooFinance.dailyGainers(queryOptions);
```

#### 하락 주식
```javascript
const queryOptions = { count: 5, region: 'US', lang: 'en-US' };
const result = await yahooFinance.dailyLosers(queryOptions);
```

### 11. 스크리너 (Screener)

```javascript
const queryOptions = {
  scrIds: 'day_gainers',
  count: 25
};
const result = await yahooFinance.screener(queryOptions);
```

## API 함수 시그니처

모든 Yahoo Finance API 함수는 다음과 같은 일반적인 구조를 따릅니다:

```javascript
await yahooFinance.moduleName(query, queryOptions, moduleOptions);
```

**매개변수:**
- `query`: 심볼 또는 검색 쿼리 (필수)
- `queryOptions`: 모듈별 쿼리 옵션 (선택)
- `moduleOptions`: 공통 모듈 옵션 (선택)

**공통 모듈 옵션:**
```javascript
const moduleOptions = {
  devel: boolean|string,      // 개발 모드
  fetchOptions: {},           // fetch 옵션
  validateResult: boolean     // 결과 검증
};
```

## 데이터 검증

기본적으로 모든 결과는 검증됩니다. 검증을 비활성화하려면:

```javascript
const result = await yahooFinance.search('gold', {}, { validateResult: false });
```

## 동시성 제어

요청 동시성을 제어할 수 있습니다:

```javascript
const moduleOptions = { query: { concurrency: 1 }};
yahooFinance.someModule(symbol, query, moduleOptions);
```

## 버전 차이점 (V1 vs V2+)

### V1 (구버전)
```javascript
// V1은 단일 OPTIONS 객체를 매개변수로 사용
yahooFinanceV1.historical({ symbol, from, to });
yahooFinanceV1.quote({ symbol, modules });
```

### V2+ (현재 버전)
```javascript
// V2+는 SYMBOL을 첫 번째 매개변수로, OPTIONS를 두 번째 매개변수로 사용
yahooFinanceV2.historical(symbol, { period1 });
yahooFinanceV2.quoteSummary(symbol, { modules });
```

## 실제 사용 예시

### 포트폴리오 추적기
```javascript
async function getPortfolioData(symbols) {
  try {
    // 현재 가격 조회
    const quotes = await yahooFinance.quote(symbols);
    
    // 각 주식의 상세 정보 조회
    const details = await Promise.all(
      symbols.map(symbol => 
        yahooFinance.quoteSummary(symbol, { 
          modules: ['price', 'summaryDetail', 'financialData'] 
        })
      )
    );
    
    return { quotes, details };
  } catch (error) {
    console.error('포트폴리오 데이터 로드 실패:', error);
  }
}
```

### 재무 분석 도구
```javascript
async function analyzeStock(symbol) {
  try {
    // 재무제표 데이터
    const financials = await yahooFinance.quoteSummary(symbol, {
      modules: [
        'incomeStatementHistory',
        'balanceSheetHistory', 
        'cashflowStatementHistory',
        'financialData',
        'defaultKeyStatistics'
      ]
    });
    
    // 역사적 가격 데이터
    const historical = await yahooFinance.historical(symbol, {
      period1: '2020-01-01',
      interval: '1d'
    });
    
    return { financials, historical };
  } catch (error) {
    console.error(`${symbol} 분석 실패:`, error);
  }
}
```

## 주의사항

1. **Rate Limiting**: Yahoo Finance API는 요청 제한이 있으므로 과도한 요청을 피하세요.

2. **데이터 정확성**: 실시간 데이터가 아닐 수 있으므로 중요한 거래 결정에는 공식 데이터를 사용하세요.

3. **에러 처리**: 네트워크 오류나 잘못된 심볼로 인한 오류를 항상 처리하세요.

4. **검증**: `validateResult: false`를 사용할 때는 수동으로 결과를 검증하세요.

5. **필수 매개변수**: `fundamentalsTimeSeries`와 같은 일부 함수는 특정 매개변수가 필수입니다.

## 문제 해결

### 일반적인 오류들

**InvalidOptionsError**: 필수 매개변수 누락
```javascript
// 잘못된 예시
await yahooFinance.fundamentalsTimeSeries(symbol, { type: ['quarterlyRevenue'] });

// 올바른 예시
await yahooFinance.fundamentalsTimeSeries(symbol, { 
  module: 'fundamentalsTimeSeries',  // 필수
  type: ['quarterlyRevenue'],
  period1: '2020-01-01',
  period2: '2023-12-31'
});
```

**Network Errors**: 네트워크 연결 문제
```javascript
try {
  const result = await yahooFinance.quote('AAPL');
} catch (error) {
  if (error.name === 'NetworkError') {
    console.log('네트워크 연결을 확인하세요');
  }
}
```

이 가이드를 참조하여 Yahoo Finance API를 효과적으로 활용하세요. 더 자세한 정보는 [공식 GitHub 저장소](https://github.com/gadicc/node-yahoo-finance2)를 참조하세요.
