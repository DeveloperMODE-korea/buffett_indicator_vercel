import ETFRecommendations from '@/components/ETFRecommendations';

export default function ETFPage() {
  return <ETFRecommendations />;
}

export const metadata = {
  title: '추천 ETF 가이드 - 버핏 지수 관측소',
  description:
    '투자 목적과 위험 성향에 맞는 ETF를 찾아보세요. VTI, VOO, QQQ, IYW 등 다양한 ETF의 상세 정보와 장단점을 확인할 수 있습니다.',
  keywords: [
    'ETF',
    'VTI',
    'VOO',
    'QQQ',
    'IYW',
    'ETF 추천',
    '투자 가이드',
    '포트폴리오',
  ],
};
