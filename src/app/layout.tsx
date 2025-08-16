import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { Analytics } from '@vercel/analytics/next'
import ThemeToggle from '@/components/ThemeToggle'
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                    📊 버핏 지수 관측소
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <nav className="hidden sm:flex space-x-4">
                    <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      버핏 지수
                    </Link>
                    <a href="#economic-comparison" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      📊 지표 비교
                    </a>
                    <Link href="/calculator" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      투자 계산기
                    </Link>
                    <Link href="/etf" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      📈 ETF 가이드
                    </Link>
                    <Link href="/dictionary" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      📚 용어 사전
                    </Link>
                    <a href="#info" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      정보
                    </a>
                  </nav>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </header>
          <main className="transition-colors">{children}</main>
          
          {/* Footer */}
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                {/* 좌측: 프로젝트 정보 */}
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">
                    📊 버핏 지수 관측소
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                    워렌 버핏의 선호 지표를 실시간으로 관측하는 웹사이트
                  </p>
                </div>

                {/* 우측: GitHub 링크 */}
                <div className="flex items-center space-x-4">
                  <a
                    href="https://github.com/DeveloperMODE-korea/buffett_indicator_vercel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-gray-900 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    {/* GitHub 아이콘 */}
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">GitHub</span>
                  </a>
                </div>
              </div>

              {/* 하단 구분선 */}
              <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                    © 2024 버핏 지수 관측소. All rights reserved.
                  </p>
                  <div className="flex items-center space-x-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                      Made with ❤️ using Next.js & Tailwind CSS
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
