# 📊 버핏 지수 관측소

실시간 주식 시장 데이터와 버핏 지수를 제공하는 Next.js 기반 웹 애플리케이션입니다.

## 🚀 주요 기능

- 📈 **실시간 버핏 지수**: GDP 대비 주식 시장 총액 비율
- 🔍 **주식 검색**: 실시간 주식 정보 검색 및 차트 시각화
- 📊 **TradingView 차트**: 전문적인 캔들스틱 차트 및 거래량 분석
- 📱 **반응형 디자인**: 모바일/데스크톱 최적화
- 🌙 **다크모드**: 테마 자동 전환 지원
- 📈 **ETF 가이드**: 42개 ETF 정보 및 추천
- 🧮 **투자 계산기**: 다양한 투자 시뮬레이션 도구

## 🛠️ 기술 스택

- **Frontend**: Next.js 15.4.6, React 18, TypeScript
- **Styling**: Tailwind CSS 3.3.0
- **Charts**: TradingView Lightweight Charts, Chart.js
- **Data**: Yahoo Finance API, FRED API
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## 🔄 CI/CD 파이프라인

### 📋 워크플로우 구성

#### 1. **메인 CI/CD 파이프라인** (`.github/workflows/ci-cd.yml`)
- **트리거**: `main`, `develop` 브랜치 푸시, PR
- **단계**:
  - 🔍 **Lint & Test**: ESLint, TypeScript 체크, 빌드
  - 🧪 **Test**: 단위 테스트 실행
  - 🔒 **Security**: 보안 감사 및 Snyk 스캔
  - 🚀 **Deploy Preview**: PR 시 Vercel 프리뷰 배포
  - 🚀 **Deploy Production**: main 브랜치 시 프로덕션 배포
  - 📊 **Performance**: Lighthouse CI 성능 측정

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

### 📊 배포 환경

| 환경 | 브랜치 | URL | 목적 |
|------|--------|-----|------|
| **Production** | `main` | `https://your-app.vercel.app` | 라이브 서비스 |
| **Staging** | `develop` | `https://staging-your-app.vercel.app` | 테스트 환경 |
| **Preview** | PR | `https://pr-123-your-app.vercel.app` | PR 검토 |

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

## 🚀 로컬 개발

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/DeveloperMODE-korea/buffett_indicator_vercel.git
cd buffett_indicator_vercel

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```bash
# FRED API (GDP 데이터)
FRED_API_KEY=your_fred_api_key

# 기타 설정
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 사용 가능한 스크립트

```bash
# 개발
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버 실행

# 코드 품질
npm run lint         # ESLint 실행
npm run type-check   # TypeScript 체크
npm run format       # Prettier 포맷팅
npm run format:check # Prettier 체크

# 보안
npm run security:audit  # 보안 감사
npm run security:fix    # 보안 수정

# 테스트
npm run test           # 테스트 실행
npm run test:watch     # 테스트 감시 모드
npm run test:coverage  # 테스트 커버리지
```

## 📁 프로젝트 구조

```
buffett_indicator_vercel/
├── .github/
│   ├── workflows/          # GitHub Actions 워크플로우
│   └── dependabot.yml      # 자동 의존성 업데이트
├── src/
│   ├── app/               # Next.js App Router
│   ├── components/        # React 컴포넌트
│   ├── lib/              # 유틸리티 함수
│   └── types/            # TypeScript 타입 정의
├── public/               # 정적 파일
└── docs/                 # 문서
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

- **GitHub**: [@DeveloperMODE-korea](https://github.com/DeveloperMODE-korea)
- **프로젝트 링크**: [https://github.com/DeveloperMODE-korea/buffett_indicator_vercel](https://github.com/DeveloperMODE-korea/buffett_indicator_vercel)

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!
