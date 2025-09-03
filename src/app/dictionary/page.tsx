import InvestmentDictionary from '@/components/InvestmentDictionary';

export default function DictionaryPage() {
  return <InvestmentDictionary />;
}

export const metadata = {
  title: '투자 용어 사전 - 버핏 지수 관측소',
  description:
    '투자와 경제에 관련된 용어들을 쉽게 찾아보세요. 버핏 지수, GDP, P/E 비율 등 핵심 투자 용어 해설.',
  keywords: [
    '투자 용어',
    '경제 용어',
    '버핏 지수',
    'GDP',
    'P/E 비율',
    '투자 사전',
  ],
};
