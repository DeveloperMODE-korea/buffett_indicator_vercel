# 📊 버핏 지수 관측소 (Buffett Indicator Monitor)

워렌 버핏의 선호 지표인 총 시가총액 대비 GDP 비율을 실시간으로 관측하는 웹사이트입니다.

## ✨ 주요 기능

- 📈 **실시간 버핏 지수**: 미국 주식시장의 현재 버핏 지수를 실시간으로 확인
- 📊 **히스토리 차트**: 과거 데이터를 통한 장기 추이 분석
- 🎯 **시장 상태 판단**: 저평가/적정가치/고평가 상태를 직관적으로 표시
- 📱 **반응형 디자인**: 모든 디바이스에서 최적화된 사용자 경험

## 🛠 기술 스택

- **Frontend**: Next.js 15, React 18, TypeScript
- **스타일링**: Tailwind CSS
- **차트**: Chart.js, React Chart.js 2
- **API**: FRED API (GDP 데이터), Wilshire 5000 (시가총액)
- **배포**: Vercel

## 🚀 로컬 개발 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/DeveloperMODE-korea/buffett_indicator_vercel.git
cd buffett_indicator_vercel
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.example` 파일을 `.env.local`로 복사하고 필요한 API 키를 설정하세요:

```bash
cp .env.example .env.local
```

FRED API 키는 [FRED 웹사이트](https://fred.stlouisfed.org/docs/api/api_key.html)에서 무료로 발급받을 수 있습니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📊 버핏 지수란?

버핏 지수(Buffett Indicator)는 총 주식시장 시가총액을 GDP로 나눈 비율로, 주식시장의 과대평가/과소평가를 판단하는 지표입니다.

### 해석 기준
- **70% 미만**: 저평가 (매수 기회)
- **70% - 120%**: 적정가치
- **120% 초과**: 고평가 (주의 필요)

## 📈 데이터 소스

- **GDP 데이터**: 미국 연방준비제도(Fed) FRED API
- **시가총액 데이터**: Wilshire 5000 Total Market Index

## 🚀 Vercel 배포

### 1. Vercel 계정 연결

```bash
npm i -g vercel
vercel login
```

### 2. 프로젝트 배포

```bash
vercel
```

### 3. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

- `FRED_API_KEY`: FRED API 키

## 📝 API 엔드포인트

- `GET /api/buffett-indicator`: 현재 버핏 지수 조회
- `GET /api/historical?years=5`: 히스토리 데이터 조회 (기본 5년)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⚠️ 주의사항

- 이 도구는 투자 참고용이며, 투자 결정의 유일한 근거가 되어서는 안됩니다
- 투자에는 항상 위험이 따르므로 신중한 판단을 권장합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
buffett indicator
