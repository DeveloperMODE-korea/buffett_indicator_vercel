# � Buffett Indicator Platform

![Buffett Indicator](https://img.shields.io/badge/Buffett_Indicator-Stock_Analysis-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)
![MIT License](https://img.shields.io/badge/License-MIT-green)
![AI-Powered](https://img.shields.io/badge/AI-Powered-purple)
![Real-Time](https://img.shields.io/badge/Real--Time-Data-orange)

**차세대 AI 기반 금융 분석 플랫폼**으로 워렌 버핏의 투자 철학과 현대 데이터 사이언스를 결합한 종합적인 투자 의사결정 도구입니다.

해당 웹 페이지는 [DeveloperMODE Financial Terminal](https://github.com/DeveloperMODE-korea/DeveloperMODE_Financial-Terminal)을 계승하며, 더욱 발전된 기능과 사용자 경험을 제공합니다.

## 🎯 플랫폼 비전

> **"데이터 기반의 스마트한 투자 의사결정을 모든 투자자에게"**

현대 금융 시장의 복잡성을 AI와 빅데이터로 단순화하여, 개인 투자자도 전문가 수준의 분석을 할 수 있도록 지원합니다.

## ✨ 핵심 기능 & 혁신 기술

### 🧠 **AI 기반 스마트 분석**
- 📈 **실시간 버핏 지수**: GDP 대비 주식 시장 총액 비율을 통한 시장 밸류에이션 평가
- 🤖 **AI 시장 예측**: 머신러닝 알고리즘 기반 단기/장기 시장 트렌드 예측
- 🎯 **패턴 인식**: 역사적 데이터에서 수익성 높은 투자 패턴 자동 감지
- � **감정 분석**: 뉴스와 소셜미디어 데이터를 통한 시장 심리 분석

### �🔍 **고도화된 종목 분석**
- 🔍 **실시간 주식 검색**: 고성능 검색 엔진으로 미국/한국 전 종목 실시간 데이터
- 📊 **TradingView 차트 통합**: 전문적인 캔들스틱 차트 및 30+ 기술적 지표 분석
- 🧾 **포괄적 재무분석**: 
  - 재무제표(연간/분기): 손익계산서/대차대조표/현금흐름표
  - CSV 내보내기 및 시계열 데이터 시각화
  - 동종업계 비교 분석
- 🧩 **핵심 지표 대시보드**: 시가총액/베타/밸류에이션/수익성 지표 종합 요약

### 📰 **실시간 정보 생태계**
- 🏛️ **SEC 공시 추적**: Submissions API+Yahoo+Atom 3단 폴백으로 최신 공시 실시간 모니터링
- 📰 **뉴스 & 인사이트**: Insights → News → Yahoo RSS 다중 소스 기반 시장 정보
- 🧠 **애널리스트 컨센서스**: 추천 등급 변화/목표 주가 추이/업다운그레이드 추적
- 🏦 **기관투자자 동향**: 기관/펀드/내부자/대주주 보유 현황 및 변동 추이

### 📈 **고급 투자 도구**
- ⚡ **옵션 체인 분석**: 실시간 옵션 가격/그릭스/볼륨 분석 (가까운 만기 콜/풋)
- 📊 **펀드 & ETF 분석**: 
  - 프로필/포트폴리오 구성/성과 분석
  - 42개 ETF 심층 정보 및 맞춤 추천
  - CSV 내보내기 및 백테스팅 기능
- 🧰 **재무 타임시리즈**: 핵심 재무 지표의 장기 추이 시각화

### 🧮 **정밀 투자 계산기 스위트**
- � **복리 계산기**: 세금/인플레이션/배당 재투자 고려한 정밀 수익률 계산
- 📅 **적립식 투자(DCA)**: 달러 비용 평균화 전략 최적화 및 백테스팅
- 🏖️ **은퇴 설계**: 은퇴 목표 달성을 위한 체계적 투자 계획 수립
- 🎯 **목표 수익률 달성**: 특정 수익률 목표를 위한 최적 투자 기간/금액 계산
- 🔥 **FIRE 계산기**: 경제적 자유(Financial Independence) 달성 시점 예측

### 🌐 **사용자 경험 혁신**
- 📱 **완전 반응형 디자인**: 모바일/태블릿/데스크톱 모든 기기 최적화
- 🌙 **스마트 테마**: 다크/라이트 모드 자동 전환 및 사용자 선호도 학습
- � **실시간 알림**: 중요 시장 이벤트/목표가 달성/이상 패턴 감지 시 즉시 알림
- 🎨 **개인화 대시보드**: 사용자 투자 성향에 맞춘 정보 큐레이션

## 🛠️ 최첨단 기술 스택

### **Frontend Architecture**
- **Framework**: Next.js 15.4.6 (App Router, Server Components)
- **Language**: TypeScript 5.6.3 (타입 안전성 보장)
- **UI Library**: React 18 (Concurrent Features)
- **Styling**: Tailwind CSS 3.3.0 (유틸리티 우선 디자인)

### **Data & Analytics**
- **Charts**: 
  - TradingView Lightweight Charts (전문 금융 차트)
  - Chart.js (커스텀 분석 차트)
- **Data Sources**: 
  - Yahoo Finance API (실시간 시장 데이터)
  - FRED API (거시경제 지표)
  - SEC EDGAR API (공시 정보)
  - Multiple News APIs (시장 뉴스)

### **Infrastructure & DevOps**
- **Deployment**: Vercel (Edge Network, Serverless Functions)
- **CI/CD**: GitHub Actions (자동화된 배포 파이프라인)
- **Monitoring**: Real-time performance tracking
- **Security**: HTTPS, API 키 암호화, XSS 방지

### **Performance Optimization**
- **SSG/SSR**: 정적 생성 및 서버사이드 렌더링 하이브리드
- **Image Optimization**: Next.js Image Component
- **Code Splitting**: 자동 코드 분할로 초기 로딩 시간 최소화
- **CDN**: Global Edge Network 활용

## 🚀 확장성 있는 API 아키텍처

> **App Router 기반 RESTful API** - `src/app/api/*/route.ts`

### **🔍 데이터 검색 & 조회**

```typescript
// 실시간 종목 검색 (자동완성 지원)
GET /api/stock-search?query=AAPL
Response: { symbol, name, exchange, type, price, change }

// 다중 종목 실시간 데이터 (히스토리컬 포함)
GET /api/stock-data?symbols=AAPL,MSFT&history=true&days=30
Response: { realtime, historical, technical_indicators }

// 종합 종목 요약 (모듈식 데이터 요청)
GET /api/summary?symbols=AAPL&modules=price,summaryDetail,financialData,assetProfile
Response: { price, summary, financials, profile, ratios }
```

### **📊 심화 분석 도구**
```typescript
// 실적 발표 일정 및 컨센서스
GET /api/earnings?symbols=AAPL
Response: { next_earnings, estimates, surprises, guidance }

// 애널리스트 추천 및 목표주가
GET /api/analyst?symbols=AAPL  
Response: { recommendations, price_targets, upgrades_downgrades }

// 핵심 밸류에이션 지표
GET /api/key-stats?symbols=AAPL
Response: { valuation, profitability, growth, financial_health }

// 기관투자자 보유 현황
GET /api/ownership?symbols=AAPL
Response: { institutional, mutual_funds, insider, major_holders }
```

### **📰 시장 정보 & 뉴스**
```typescript
// 다중 소스 뉴스 (폴백 시스템)
GET /api/insights?symbols=AAPL
Fallback: Insights API → News API → Yahoo RSS
Response: { articles, sentiment_analysis, key_events }

// SEC 공시 문서 (실시간 업데이트)
GET /api/sec-filings?symbols=AAPL
Fallback: SEC Submissions → Yahoo → Atom Feed  
Response: { recent_filings, form_types, filing_dates }

// 신용등급 및 리서치 보고서
GET /api/ratings?symbols=AAPL
Response: { credit_ratings, research_reports, analyst_notes }
```

### **📈 파생상품 & 펀드**
```typescript
// 옵션 체인 분석
GET /api/options?symbol=AAPL
Response: { calls, puts, greeks, volatility, volume }

// ETF/펀드 심층 분석
GET /api/fund-facts?symbols=VTI
Response: { fund_profile, top_holdings, performance, expenses }

// 재무 시계열 데이터
GET /api/fundamentals-ts?symbols=AAPL&metrics=revenue,eps,debt
Response: { quarterly_data, annual_data, growth_rates }
```

### **🌍 거시경제 지표**
```typescript
// 버핏 지수 및 시장 지표
GET /api/buffett-indicator
Response: { current_ratio, historical_data, market_assessment }

// 경제 지표 대시보드  
GET /api/economic-indicators
Response: { gdp, inflation, unemployment, interest_rates }

// 시장 지수 종합
GET /api/market-indices
Response: { sp500, nasdaq, dow, international_indices }
```

### 간단 예시

```bash
# 요약+프로필
curl "http://localhost:3000/api/summary?symbols=AAPL&modules=price,summaryDetail,financialData,assetProfile" | jq .

# SEC 공시(폴백 포함)
curl "http://localhost:3000/api/sec-filings?symbols=AAPL" | jq .

# 옵션 체인(가까운 만기 요약)
curl "http://localhost:3000/api/options?symbol=AAPL" | jq .

# ETF 펀드 팩트
curl "http://localhost:3000/api/fund-facts?symbols=VTI" | jq .
```

## � 혁신 기능 로드맵

### 🎯 **Phase 1: AI-Powered Analytics (진행 중)**
- [ ] **머신러닝 시장 예측**: LSTM, Random Forest 기반 단기/중기 가격 예측
- [ ] **감정 분석 엔진**: 뉴스/소셜미디어 데이터로 시장 심리 수치화
- [ ] **패턴 인식 AI**: 차트 패턴 자동 감지 및 거래 신호 생성
- [ ] **리스크 평가 모델**: VaR, CVaR 기반 포트폴리오 위험 계산

### 📊 **Phase 2: 고급 기술적 분석 (계획 중)**
- [ ] **30+ 기술적 지표**: RSI, MACD, 볼린저 밴드, 일목균형표 등
- [ ] **거래량 분석**: Price-Volume 관계 분석 및 이상 패턴 감지
- [ ] **다중 시간프레임**: 1분~월봉까지 동시 분석
- [ ] **백테스팅 엔진**: 전략 성과 검증 및 최적화

### 🔬 **Phase 3: 퀀트 분석 도구 (연구 중)**
- [ ] **몬테카르로 시뮬레이션**: 포트폴리오 수익률 확률 분포 분석
- [ ] **효율적 프론티어**: 최적 포트폴리오 구성 알고리즘
- [ ] **팩터 분석**: Fama-French 5팩터 모델 기반 성과 분해
- [ ] **옵션 프라이싱**: Black-Scholes, Binomial Tree 모델

### 🌐 **Phase 4: 글로벌 시장 확장 (기획 중)**
- [ ] **다국가 시장**: 한국, 일본, 유럽 주요 시장 데이터 통합
- [ ] **환율 헷지 분석**: 환율 변동 리스크 계산 및 헷지 전략
- [ ] **ADR/ETF 비교**: 같은 기업의 다중 상장 종목 비교
- [ ] **시간대 동기화**: 글로벌 시장 시간대 통합 차트

### 🤖 **Phase 5: AI 어시스턴트 (미래)**
- [ ] **투자 어드바이저 봇**: 개인화된 투자 조언 및 전략 추천
- [ ] **자동 리포트 생성**: 포트폴리오 성과 분석 보고서 자동 작성
- [ ] **알고리즘 트레이딩**: 규칙 기반 자동 매매 신호 (정보 제공용)
- [ ] **학습형 대시보드**: 사용자 행동 패턴 학습으로 UI 최적화

## 💡 특별 기능 하이라이트

### 🧠 **AI 기반 스마트 기능**
- **지능형 종목 추천**: 사용자 포트폴리오 기반 맞춤 종목 발굴
- **이상 거래 감지**: 비정상적 거래량/가격 변동 실시간 알림  
- **뉴스 임팩트 분석**: 뉴스가 주가에 미치는 영향 정량화
- **섹터 로테이션 예측**: 거시경제 지표 기반 유망 섹터 예측

### 📈 **고급 분석 도구**
- **공매도 현황**: Short Interest 비율 및 대차거래 동향 추적
- **내부자 거래**: 임원/대주주 매매 동향으로 종목 신호 감지
- **기관 자금 흐름**: 기관투자자 순매수/매도 추이 분석
- **옵션 활동 분석**: Put/Call 비율, 최대 고통점(Max Pain) 계산

### 🎯 **개인화 서비스**
- **맞춤형 알림**: 관심 종목 목표가 달성/이상 패턴 감지 시 알림
- **투자 성향 분석**: 리스크 선호도 기반 포트폴리오 제안
- **수익률 벤치마킹**: S&P 500 대비 개인 포트폴리오 성과 비교
- **세금 최적화**: 세금 효율적인 매매 타이밍 제안

### 📋 워크플로우 구성

#### 1. **고도화된 CI/CD 파이프라인** (`.github/workflows/ci-cd.yml`)

**🎯 트리거 조건**
- `main`, `develop` 브랜치 푸시
- 모든 브랜치 대상 Pull Request
- 보안 이벤트 및 스케줄 기반 실행

**⚡ 병렬 처리 단계**
```yaml
Quality Gate (병렬 실행):
├── 🔍 Code Analysis
│   ├── ESLint (JavaScript/TypeScript 린팅)
│   ├── TypeScript 컴파일 검증
│   ├── Prettier 포맷팅 체크
│   └── 코드 복잡도 분석
├── 🧪 Testing Suite  
│   ├── 단위 테스트 (Jest)
│   ├── 통합 테스트 
│   ├── E2E 테스트 (Playwright)
│   └── 테스트 커버리지 측정
├── 🔒 Security Scanning
│   ├── npm audit (의존성 취약점)
│   ├── Snyk 보안 스캔
│   ├── CodeQL 정적 분석
│   └── Docker 이미지 스캔
└── 🏗️ Build Verification
    ├── Next.js 프로덕션 빌드
    ├── 번들 크기 분석
    ├── 트리 쉐이킹 검증
    └── 성능 메트릭 수집
```

**🚀 배포 단계 (조건부 실행)**
```yaml
Deployment Pipeline:
├── 📋 PR Preview Deploy
│   ├── Vercel 프리뷰 배포 
│   ├── Lighthouse CI 성능 측정
│   ├── Visual Regression 테스트
│   └── 자동 PR 코멘트 생성
├── 🎯 Staging Deploy (develop 브랜치)
│   ├── 스테이징 환경 배포
│   ├── 통합 테스트 실행  
│   ├── API 엔드포인트 검증
│   └── 성능 벤치마크
└── 🚀 Production Deploy (main 브랜치)
    ├── 프로덕션 배포
    ├── 헬스체크 실행
    ├── Slack/Email 알림
    └── 자동 롤백 준비
```

**📊 배포 후 모니터링**
- **실시간 성능 추적**: Core Web Vitals, 응답 시간
- **에러 모니터링**: Sentry 통합으로 실시간 에러 추적
- **사용자 분석**: 트래픽 패턴 및 사용자 행동 분석
- **업타임 모니터링**: 24/7 서비스 가용성 확인

#### 2. **스테이징 배포** (`.github/workflows/deploy-staging.yml`)

- **트리거**: `develop` 브랜치 푸시
- **목적**: 스테이징 환경 자동 배포

#### 3. **캐시 정리** (`.github/workflows/cache-cleanup.yml`)

- **트리거**: 매주 일요일 새벽 2시 (스케줄)
- **목적**: GitHub Actions 캐시 정리

### 🔐 필요한 GitHub Secrets

```bash
# Vercel 설정
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id

# 보안 스캔
SNYK_TOKEN=your_snyk_token
```

### 📊 배포 환경

| 환경           | 브랜치    | URL                                   | 목적          |
| -------------- | --------- | ------------------------------------- | ------------- |
| **Production** | `main`    | `https://your-app.vercel.app`         | 라이브 서비스 |
| **Staging**    | `develop` | `https://staging-your-app.vercel.app` | 테스트 환경   |
| **Preview**    | PR        | `https://pr-123-your-app.vercel.app`  | PR 검토       |

### 🔄 배포 프로세스

1. **개발자 작업**

   ```bash
   git checkout develop
   git add .
   git commit -m "feat: 새로운 기능 추가"
   git push origin develop
   ```

2. **자동화된 파이프라인**
   - ✅ 코드 품질 검사 (ESLint, TypeScript)
   - ✅ 보안 검사 (npm audit, Snyk)
   - ✅ 빌드 테스트
   - 🚀 스테이징 배포

3. **프로덕션 배포**

   ```bash
   git checkout main
   git merge develop
   git push origin main
   ```

   - 🚀 자동 프로덕션 배포
   - 📊 성능 측정
   - 📧 팀 알림

### 📈 모니터링 및 알림

- **Slack 알림**: 배포 성공/실패 알림
- **Lighthouse CI**: 성능 지표 모니터링
- **GitHub Actions**: 워크플로우 상태 추적

## 🚀 개발자 가이드 & 로컬 환경 설정

### **⚡ 빠른 시작 (Quick Start)**

```bash
# 1. 저장소 클론 및 이동
git clone https://github.com/DeveloperMODE-korea/buffett_indicator_vercel.git
cd buffett_indicator_vercel

# 2. Node.js 버전 확인 (권장: 18.x 이상)
node --version  # v18.17.0+

# 3. 의존성 설치 (npm 또는 yarn)
npm install
# 또는
yarn install

# 4. 환경 변수 설정 (.env.local 파일 생성)
cp .env.example .env.local  # 예제 파일이 있는 경우

# 5. 개발 서버 실행
npm run dev
# 🚀 http://localhost:3000 에서 확인
```

### **🔧 환경 변수 설정**

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```bash
# ===========================================
# 🌐 API 키 설정 (필수)
# ===========================================

# FRED API (미국 경제 데이터 - GDP, 인플레이션 등)
FRED_API_KEY=your_fred_api_key_here
# 발급: https://fred.stlouisfed.org/docs/api/api_key.html

# Yahoo Finance API (주식 데이터 - 기본 무료)
YAHOO_API_KEY=optional_for_premium_features

# Alpha Vantage API (보조 데이터 소스)
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key

# News API (뉴스 데이터)
NEWS_API_KEY=your_news_api_key

# ===========================================
# 🏗️ 애플리케이션 설정
# ===========================================

# 애플리케이션 URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

# 데이터베이스 (선택사항 - 사용자 설정 저장용)
DATABASE_URL=postgresql://user:password@localhost:5432/buffett_db

# Redis (캐싱 - 선택사항)
REDIS_URL=redis://localhost:6379

# ===========================================
# 🔒 보안 설정
# ===========================================

# JWT 시크릿 (사용자 인증용)
NEXTAUTH_SECRET=your_super_secret_jwt_key_here

# API 키 암호화
ENCRYPTION_SECRET=your_encryption_secret_here

# ===========================================
# 📊 모니터링 & 분석 (선택사항)
# ===========================================

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Vercel Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS=1

# Sentry (에러 추적)
SENTRY_DSN=your_sentry_dsn_here
```

### **🛠️ 개발 도구 & 스크립트**

```bash
# 📦 개발 환경
npm run dev              # 개발 서버 실행 (Hot Reload)
npm run dev:turbo        # Turbo 모드로 더 빠른 개발 서버
npm run dev:debug        # 디버깅 모드로 개발 서버

# 🏗️ 빌드 & 배포
npm run build            # 프로덕션 빌드 생성
npm run start            # 프로덕션 서버 실행
npm run export           # 정적 파일 내보내기
npm run analyze          # 번들 크기 분석

# 🧹 코드 품질 관리
npm run lint             # ESLint 린팅 검사
npm run lint:fix         # ESLint 자동 수정
npm run type-check       # TypeScript 타입 검사
npm run format           # Prettier 코드 포맷팅
npm run format:check     # 포맷팅 준수 검사

# 🔒 보안 & 의존성 관리
npm run security:audit   # 보안 취약점 감사
npm run security:fix     # 자동 보안 수정 적용
npm run deps:update      # 의존성 업데이트 체크
npm run deps:outdated    # 구버전 의존성 리스트

# 🧪 테스트 스위트
npm run test             # 단위 테스트 실행
npm run test:watch       # 테스트 감시 모드
npm run test:coverage    # 테스트 커버리지 리포트
npm run test:e2e         # E2E 테스트 실행 (Playwright)
npm run test:component   # 컴포넌트 테스트 (Storybook)

# 📊 성능 & 품질 분석
npm run lighthouse       # Lighthouse 성능 측정
npm run perf:audit       # 성능 프로파일링
npm run bundle:analyze   # 웹팩 번들 분석
```

### **🏗️ 프로젝트 아키텍처 & 개발 가이드**

```
📂 buffett_indicator_vercel/
├── 🚀 .github/
│   ├── workflows/           # GitHub Actions CI/CD 워크플로우
│   ├── ISSUE_TEMPLATE/      # 이슈 템플릿
│   └── pull_request_template.md
├── 🎨 public/              # 정적 에셋 (이미지, 아이콘, manifest)
├── 📱 src/
│   ├── app/                # Next.js 13+ App Router
│   │   ├── (dashboard)/    # 대시보드 그룹 라우트
│   │   ├── api/           # API 라우트 핸들러
│   │   ├── globals.css    # 글로벌 스타일
│   │   ├── layout.tsx     # 루트 레이아웃
│   │   └── page.tsx       # 홈페이지
│   ├── components/        # 재사용 가능한 React 컴포넌트
│   │   ├── ui/           # 기본 UI 컴포넌트 (shadcn/ui)
│   │   ├── charts/       # 차트 관련 컴포넌트
│   │   ├── calculator/   # 계산기 컴포넌트들
│   │   └── forms/        # 폼 관련 컴포넌트
│   ├── lib/              # 유틸리티 함수 및 라이브러리
│   │   ├── api.ts        # API 클라이언트
│   │   ├── utils.ts      # 공통 유틸리티
│   │   ├── constants.ts  # 상수 정의
│   │   └── validations.ts # 데이터 검증 스키마
│   ├── hooks/            # 커스텀 React 훅
│   ├── types/            # TypeScript 타입 정의
│   ├── data/             # 정적 데이터 및 설정
│   └── styles/           # 추가 스타일 파일
├── 📋 docs/               # 프로젝트 문서
├── 🧪 tests/             # 테스트 파일
│   ├── __mocks__/        # 모킹 파일
│   ├── unit/             # 단위 테스트
│   ├── integration/      # 통합 테스트
│   └── e2e/              # E2E 테스트 (Playwright)
├── 🔧 config/            # 설정 파일들
└── 📊 scripts/           # 빌드/배포 스크립트
```

### **💡 개발 베스트 프랙티스**

#### **📝 코드 컨벤션**
```typescript
// ✅ 좋은 예 - 명확한 타입 정의와 네이밍
interface StockAnalysis {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
}

const useStockData = (symbol: string): StockAnalysis | null => {
  // 훅 로직
}

// ✅ 컴포넌트 네이밍 - PascalCase
const BuffettIndicatorCard: React.FC<Props> = ({ data }) => {
  return <div>{/* JSX */}</div>
}
```

#### **🎯 성능 최적화 가이드**
```typescript
// ✅ React.memo로 불필요한 리렌더링 방지
const ExpensiveChart = React.memo(({ data }: ChartProps) => {
  return <TradingViewChart data={data} />
})

// ✅ 동적 import로 코드 스플리팅
const LazyCalculator = dynamic(() => import('./Calculator'), {
  loading: () => <CalculatorSkeleton />,
  ssr: false
})

// ✅ SWR을 활용한 데이터 캐싱
const { data, error, isLoading } = useSWR(
  `/api/stock-data?symbol=${symbol}`,
  fetcher,
  { revalidateOnFocus: false, dedupingInterval: 60000 }
)
```
npm run test           # 테스트 실행
npm run test:watch     # 테스트 감시 모드
npm run test:coverage  # 테스트 커버리지
```

## 🤝 기여 가이드 & 커뮤니티

### **🎯 기여 방법**

우리는 모든 형태의 기여를 환영합니다! 다음과 같은 방식으로 참여할 수 있습니다:

#### **🔧 코드 기여**
```bash
# 1. 프로젝트 포크
Fork → https://github.com/DeveloperMODE-korea/buffett_indicator_vercel

# 2. 로컬에 클론
git clone https://github.com/YOUR_USERNAME/buffett_indicator_vercel.git
cd buffett_indicator_vercel

# 3. 새로운 기능 브랜치 생성
git checkout -b feature/amazing-new-feature

# 4. 개발 진행
# - 코드 작성
# - 테스트 추가  
# - 문서 업데이트

# 5. 커밋 (Conventional Commits 규칙 준수)
git add .
git commit -m "feat: add amazing new feature for stock analysis"

# 6. 푸시 및 PR 생성
git push origin feature/amazing-new-feature
# GitHub에서 Pull Request 생성
```

#### **📝 커밋 메시지 컨벤션**
```bash
# 타입(스코프): 설명
feat(api): add short interest data endpoint
fix(chart): resolve TradingView chart rendering issue  
docs(readme): update API documentation
test(calculator): add unit tests for DCA calculator
refactor(components): optimize chart performance
style(ui): fix button hover states
chore(deps): update dependencies to latest versions
```

#### **🐛 버그 리포트**
[이슈 생성 시 다음 템플릿 사용](https://github.com/DeveloperMODE-korea/buffett_indicator_vercel/issues/new)
```markdown
## 🐛 Bug Report

### 환경 정보
- **OS**: Windows 11 / macOS 13 / Ubuntu 22.04
- **브라우저**: Chrome 120.0 / Safari 17.0 / Firefox 121.0  
- **Node.js**: v18.17.0
- **화면 해상도**: 1920x1080

### 재현 단계
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

### 예상 결과
A clear and concise description of what you expected to happen.

### 실제 결과  
A clear and concise description of what actually happened.

### 스크린샷
If applicable, add screenshots to help explain your problem.
```

#### **💡 기능 제안**
```markdown
## 🚀 Feature Request

### 기능 설명
A clear and concise description of what you want to happen.

### 해결하려는 문제
A clear and concise description of what the problem is.

### 제안하는 해결책
A clear and concise description of what you want to happen.

### 대안적 해결책
A clear and concise description of any alternative solutions.

### 추가 컨텍스트
Add any other context or screenshots about the feature request.
```

### **🏆 기여자 행동 강령**

- **존중**: 모든 기여자를 존중하며 건설적인 피드백을 제공합니다
- **협력**: 다양한 관점을 환영하며 함께 문제를 해결합니다  
- **학습**: 실수를 통해 배우며 지식을 공유합니다
- **품질**: 코드 품질과 사용자 경험을 최우선으로 생각합니다

### **🎖️ 기여자 인정**

- **코드 기여자**: GitHub 프로필에 Contributor 배지
- **문서 기여자**: README의 Contributors 섹션에 이름 추가
- **버그 리포터**: Issues Hall of Fame에 등재
- **활발한 기여자**: Maintainer 역할 제안

## 📊 프로젝트 통계 & 로드맵

### **📈 현재 상태**
![GitHub stars](https://img.shields.io/github/stars/DeveloperMODE-korea/buffett_indicator_vercel)
![GitHub forks](https://img.shields.io/github/forks/DeveloperMODE-korea/buffett_indicator_vercel)
![GitHub issues](https://img.shields.io/github/issues/DeveloperMODE-korea/buffett_indicator_vercel)
![GitHub pull requests](https://img.shields.io/github/issues-pr/DeveloperMODE-korea/buffett_indicator_vercel)
![GitHub last commit](https://img.shields.io/github/last-commit/DeveloperMODE-korea/buffett_indicator_vercel)

### **🗓️ 2024 개발 로드맵**

| Quarter | 주요 기능 | 상태 |
|---------|-----------|------|
| **Q1 2024** | AI 시장 예측 모델, 감정 분석 엔진 | 🚧 진행 중 |
| **Q2 2024** | 고급 기술적 분석 도구, 백테스팅 | 📋 계획됨 |
| **Q3 2024** | 글로벌 시장 확장, 다국가 데이터 | 🔮 검토 중 |
| **Q4 2024** | 모바일 앱, AI 투자 어드바이저 | 💭 아이디어 |

## 📄 라이센스 & 법적 고지

### **⚖️ MIT 라이센스**
이 프로젝트는 MIT 라이센스 하에 배포됩니다. 이는 다음을 의미합니다:

- ✅ **상업적 사용 가능**: 상업적 목적으로 자유롭게 사용
- ✅ **수정 가능**: 코드를 자유롭게 수정 및 개선  
- ✅ **배포 가능**: 수정된 버전을 자유롭게 배포
- ✅ **사적 사용**: 개인적 목적으로 자유롭게 사용
- ❗ **책임 제한**: 소프트웨어 사용으로 인한 손실에 대해 개발자가 책임지지 않음

**전체 라이센스 내용**: [`LICENSE`](LICENSE) 파일 참조

### **⚠️ 투자 면책 조항**
```
⚠️ 중요한 면책 조항 ⚠️

이 소프트웨어는 교육 및 정보 제공 목적으로만 제공됩니다.

• 투자 조언 아님: 이 플랫폼의 모든 정보와 분석은 투자 조언이 아닙니다
• 재무적 위험: 모든 투자에는 위험이 따르며 원금 손실 가능성이 있습니다
• 개인 책임: 모든 투자 결정은 개인의 책임하에 이루어져야 합니다  
• 데이터 정확성: 실시간 데이터의 정확성과 완성도를 보장하지 않습니다
• 전문가 상담: 중요한 투자 결정 전에 전문가와 상담하시기 바랍니다

투자 전에 항상 충분한 조사와 리스크 평가를 수행하시기 바랍니다.
```

### **🔒 프라이버시 정책**
- **데이터 수집**: 사용자 개인 정보를 수집하지 않습니다
- **쿠키 사용**: 필수적인 기능을 위해서만 쿠키 사용
- **제3자 서비스**: Google Analytics, Vercel Analytics 사용
- **API 키**: 모든 API 키는 서버에서 안전하게 관리됩니다

## 📞 연락처 & 커뮤니티

### **🌐 공식 채널**
- **🏠 홈페이지**: [https://buffett-indicator.vercel.app](https://buffett-indicator.vercel.app)
- **📚 GitHub**: [@DeveloperMODE-korea](https://github.com/DeveloperMODE-korea)
- **📧 이메일**: [contact@developermode-korea.com](mailto:contact@developermode-korea.com)
- **📱 Discord**: [개발자 커뮤니티 서버](https://discord.gg/developermode-korea)

### **💬 소통 채널**
- **🐛 버그 리포트**: [GitHub Issues](https://github.com/DeveloperMODE-korea/buffett_indicator_vercel/issues)
- **💡 기능 요청**: [GitHub Discussions](https://github.com/DeveloperMODE-korea/buffett_indicator_vercel/discussions)
- **❓ Q&A**: [Stack Overflow](https://stackoverflow.com/questions/tagged/buffett-indicator)
- **📢 공지사항**: [GitHub Releases](https://github.com/DeveloperMODE-korea/buffett_indicator_vercel/releases)

### **🤝 파트너십 & 후원**
- **💼 비즈니스 협력**: [business@developermode-korea.com](mailto:business@developermode-korea.com)
- **💖 후원하기**: [GitHub Sponsors](https://github.com/sponsors/DeveloperMODE-korea)
- **☕ 커피 한 잔**: [Buy Me a Coffee](https://buymeacoffee.com/developermode)

## 🙏 감사 인사 & 크레딧

### **🏆 핵심 기여자**
- **[@DeveloperMODE-korea](https://github.com/DeveloperMODE-korea)**: 프로젝트 창립자 및 메인 개발자
- **오픈소스 커뮤니티**: 수많은 라이브러리와 도구를 제공해주신 개발자들

### **🛠️ 기술 스택 감사**
- **[Next.js](https://nextjs.org/)**: 강력한 React 프레임워크
- **[TradingView](https://www.tradingview.com/)**: 전문적인 금융 차트 라이브러리
- **[Tailwind CSS](https://tailwindcss.com/)**: 직관적인 유틸리티 CSS 프레임워크
- **[Vercel](https://vercel.com/)**: 완벽한 배포 플랫폼
- **[Yahoo Finance API](https://finance.yahoo.com/)**: 실시간 시장 데이터
- **[FRED API](https://fred.stlouisfed.org/)**: 미국 경제 데이터

### **📊 데이터 제공**
- **미국 연방준비제도**: 경제 지표 및 GDP 데이터
- **Yahoo Finance**: 주식 시장 데이터 및 뉴스
- **SEC (Securities and Exchange Commission)**: 기업 공시 정보
- **각국 중앙은행**: 글로벌 경제 지표

### **🎨 디자인 영감**
- **Bloomberg Terminal**: 전문적인 금융 인터페이스 영감
- **Robinhood**: 사용자 친화적인 모바일 디자인
- **TradingView**: 직관적인 차트 및 분석 도구 UX

---

## 🌟 마지막 한마디

> **"투자는 미래를 예측하는 것이 아니라, 현재를 이해하는 것이다."**
> 
> \- 워렌 버핏 (Warren Buffett)

**Buffett Indicator Platform**은 단순한 주식 분석 도구를 넘어서, 데이터 기반의 합리적 투자 의사결정을 돕는 것을 목표로 합니다. 우리는 개인 투자자도 전문가 수준의 분석을 할 수 있는 민주화된 금융 도구를 만들고자 합니다.

### **🚀 함께 만들어가는 미래**
- **개인 투자자 역량 강화**: 복잡한 금융 데이터를 쉽게 이해할 수 있도록
- **투명한 투자 환경**: 정확하고 신뢰할 수 있는 정보 제공
- **지속적인 혁신**: AI와 머신러닝을 활용한 차세대 분석 도구
- **글로벌 접근성**: 전 세계 투자자들이 활용할 수 있는 플랫폼

---

<div align="center">

### ⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요! ⭐

[![GitHub stars](https://img.shields.io/github/stars/DeveloperMODE-korea/buffett_indicator_vercel?style=social)](https://github.com/DeveloperMODE-korea/buffett_indicator_vercel/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/DeveloperMODE-korea/buffett_indicator_vercel?style=social)](https://github.com/DeveloperMODE-korea/buffett_indicator_vercel/network/members)
[![GitHub watchers](https://img.shields.io/github/watchers/DeveloperMODE-korea/buffett_indicator_vercel?style=social)](https://github.com/DeveloperMODE-korea/buffett_indicator_vercel/watchers)

**[🚀 라이브 데모 보기](https://buffett-indicator.vercel.app)** | **[📚 문서 읽기](https://docs.buffett-indicator.com)** | **[💬 커뮤니티 참여](https://discord.gg/developermode-korea)**

---

**Made with ❤️ by DeveloperMODE Korea**

*Building the future of financial analysis, one commit at a time.*

</div>
