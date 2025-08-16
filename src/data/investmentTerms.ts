export interface InvestmentTerm {
  id: string
  term: string
  definition: string
  category: string
  example?: string
  relatedTerms?: string[]
}

export const investmentTerms: InvestmentTerm[] = [
  // 기본 투자 용어
  {
    id: 'buffett-indicator',
    term: '버핏 지수 (Buffett Indicator)',
    definition: '총 주식시장 시가총액을 국내총생산(GDP)로 나눈 비율. 워렌 버핏이 선호하는 시장 과열/과냉 판단 지표입니다.',
    category: '시장지표',
    example: '버핏 지수 = (총 시가총액 ÷ GDP) × 100',
    relatedTerms: ['GDP', '시가총액', 'P/E 비율']
  },
  {
    id: 'gdp',
    term: 'GDP (국내총생산)',
    definition: '한 국가에서 일정 기간 동안 생산된 모든 재화와 서비스의 시장가치 총합입니다.',
    category: '경제지표',
    example: '2023년 미국 GDP는 약 26조 달러입니다.',
    relatedTerms: ['버핏 지수', '경제성장률']
  },
  {
    id: 'market-cap',
    term: '시가총액 (Market Capitalization)',
    definition: '상장된 모든 주식의 시장 가치 총합. 주가 × 발행주식수로 계산됩니다.',
    category: '주식용어',
    example: '애플의 시가총액 = 주가 $180 × 발행주식 155억 주',
    relatedTerms: ['버핏 지수', '주가', '발행주식수']
  },
  {
    id: 'pe-ratio',
    term: 'P/E 비율 (Price-to-Earnings Ratio)',
    definition: '주가를 주당순이익으로 나눈 값. 주식이 얼마나 비싸게 거래되는지 나타내는 지표입니다.',
    category: '주식용어',
    example: 'P/E 15배 = 현재 주가가 연간 순이익의 15배',
    relatedTerms: ['PBR', 'ROE', '주당순이익']
  },
  {
    id: 'pbr',
    term: 'PBR (Price-to-Book Ratio)',
    definition: '주가를 주당순자산가치로 나눈 값. 기업의 자산 대비 주가 수준을 나타냅니다.',
    category: '주식용어',
    example: 'PBR 1.5배 = 주가가 순자산가치의 1.5배',
    relatedTerms: ['P/E 비율', '순자산가치', 'ROE']
  },
  {
    id: 'roe',
    term: 'ROE (Return on Equity)',
    definition: '자기자본이익률. 기업이 주주 자본을 얼마나 효율적으로 활용하여 이익을 창출하는지 나타내는 지표입니다.',
    category: '재무지표',
    example: 'ROE 15% = 자기자본 100원으로 15원의 순이익 창출',
    relatedTerms: ['ROA', 'P/E 비율', '자기자본']
  },
  {
    id: 'compound-interest',
    term: '복리 (Compound Interest)',
    definition: '원금과 이자를 합친 금액에 다시 이자가 붙는 것. 시간이 지날수록 기하급수적으로 증가합니다.',
    category: '투자기본',
    example: '연 10% 복리로 100만원 투자 시 10년 후 약 260만원',
    relatedTerms: ['단리', '연간수익률', '투자기간']
  },
  {
    id: 'dca',
    term: 'DCA (Dollar Cost Averaging)',
    definition: '정기적으로 일정 금액을 투자하는 전략. 시장 변동성을 분산시켜 평균 매수 단가를 낮추는 효과가 있습니다.',
    category: '투자전략',
    example: '매월 50만원씩 인덱스펀드에 투자하는 것',
    relatedTerms: ['포트폴리오', '분산투자', '변동성']
  },
  {
    id: 'volatility',
    term: '변동성 (Volatility)',
    definition: '자산 가격의 변동 정도를 나타내는 지표. 높을수록 가격 변동이 크고 위험도가 높습니다.',
    category: '위험관리',
    example: '변동성 20% = 연간 20% 범위에서 가격이 움직일 확률이 68%',
    relatedTerms: ['표준편차', '위험', 'DCA']
  },
  {
    id: 'diversification',
    term: '분산투자 (Diversification)',
    definition: '여러 자산에 투자금을 나누어 투자하는 전략. 리스크를 줄이면서 안정적인 수익을 추구합니다.',
    category: '투자전략',
    example: '주식 60%, 채권 30%, 부동산 10%로 분산',
    relatedTerms: ['포트폴리오', '리스크관리', '자산배분']
  },
  {
    id: 'bull-market',
    term: '강세장 (Bull Market)',
    definition: '주가가 지속적으로 상승하는 시장 상황. 투자자들의 낙관적 심리가 지배적인 상태입니다.',
    category: '시장용어',
    example: '2009-2021년 미국 주식시장의 장기 강세장',
    relatedTerms: ['약세장', '시장사이클', '투자심리']
  },
  {
    id: 'bear-market',
    term: '약세장 (Bear Market)',
    definition: '주가가 지속적으로 하락하는 시장 상황. 보통 고점 대비 20% 이상 하락한 상태를 말합니다.',
    category: '시장용어',
    example: '2008년 금융위기 당시의 주식시장',
    relatedTerms: ['강세장', '시장조정', '투자심리']
  },
  {
    id: 'inflation',
    term: '인플레이션 (Inflation)',
    definition: '물가가 지속적으로 상승하는 현상. 화폐의 구매력이 감소하여 투자 수익률에 영향을 줍니다.',
    category: '경제지표',
    example: '연 3% 인플레이션 = 100원 상품이 1년 후 103원',
    relatedTerms: ['디플레이션', '실질수익률', '금리']
  },
  {
    id: 'interest-rate',
    term: '금리 (Interest Rate)',
    definition: '돈을 빌리는 대가로 지급하는 이자율. 경제 전반과 투자 시장에 큰 영향을 미칩니다.',
    category: '경제지표',
    example: '기준금리 3% = 중앙은행이 설정한 기준 이자율',
    relatedTerms: ['인플레이션', '채권가격', '통화정책']
  },
  {
    id: 'etf',
    term: 'ETF (Exchange-Traded Fund)',
    definition: '거래소에서 거래되는 펀드. 특정 지수나 섹터를 추종하며 개별 주식처럼 거래 가능합니다.',
    category: '투자상품',
    example: 'S&P 500 ETF는 S&P 500 지수를 추종',
    relatedTerms: ['인덱스펀드', '뮤추얼펀드', '패시브투자']
  }
]

// 카테고리 목록
export const categories = [
  '전체',
  '시장지표',
  '경제지표', 
  '주식용어',
  '재무지표',
  '투자기본',
  '투자전략',
  '투자상품',
  '위험관리',
  '시장용어'
]
