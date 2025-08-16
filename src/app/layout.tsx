import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Buffett Indicator - 버핏 지수 관측소',
  description: '워렌 버핏의 선호 지표인 총 시가총액 대비 GDP 비율을 실시간으로 관측하는 웹사이트',
  keywords: ['Buffett Indicator', '버핏 지수', '주식시장', 'GDP', '시가총액'],
  authors: [{ name: 'Buffett Indicator Team' }],
  openGraph: {
    title: 'Buffett Indicator - 버핏 지수 관측소',
    description: '워렌 버핏의 선호 지표인 총 시가총액 대비 GDP 비율을 실시간으로 관측',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-900">
                    📊 버핏 지수 관측소
                  </h1>
                </div>
                <nav className="hidden sm:flex space-x-4">
                  <a href="#indicator" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    지수 현황
                  </a>
                  <a href="#chart" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    차트
                  </a>
                  <a href="#info" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    정보
                  </a>
                </nav>
              </div>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
