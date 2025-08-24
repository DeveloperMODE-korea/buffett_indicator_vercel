import { NextRequest, NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: '검색어를 입력해주세요.'
      }, { status: 400 })
    }

    console.log(`[Stock Search API] 검색어: ${query}`)

    // Yahoo Finance 검색 API 사용
    const searchResults = await yahooFinance.search(query, {
      quotesCount: 20,
      newsCount: 0,
      enableFuzzyQuery: true,
      quotesQueryId: 'tss_match_phrase_query',
      multiQuoteQueryId: 'multi_quote_single_token_query',
      newsQueryId: 'news_cie_vespa',
      enableCb: true,
      enableNavLinks: true,
      enableEnhancedTrivialQuery: true
    })

    // 검색 결과 처리
    const processedResults = searchResults.quotes?.map(quote => ({
      symbol: quote.symbol,
      name: quote.shortname || quote.longname || quote.displayName,
      exchange: quote.exchange || quote.fullExchangeName || 'Unknown',
      type: quote.quoteType || 'EQUITY',
      score: quote.score || 0
    })) || []

    // 심볼로 정확히 일치하는 결과를 우선순위로 정렬
    const exactMatches = processedResults.filter(result => 
      result.symbol.toUpperCase() === query.toUpperCase()
    )
    const otherMatches = processedResults.filter(result => 
      result.symbol.toUpperCase() !== query.toUpperCase()
    )

    const sortedResults = [...exactMatches, ...otherMatches]

    console.log(`[Stock Search API] 검색 결과: ${sortedResults.length}개`)

    return NextResponse.json({
      success: true,
      data: sortedResults,
      query: query,
      totalResults: sortedResults.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[Stock Search API] 검색 오류:', error)
    return NextResponse.json(
      { 
        success: false,
        error: '검색 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
