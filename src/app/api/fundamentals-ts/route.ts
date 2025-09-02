import { NextRequest, NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol') || 'AAPL'
    const types = (searchParams.get('types') || 'quarterlyTotalAssets,quarterlyTotalLiabilitiesNetMinorityInterest,quarterlyTotalRevenue,quarterlyNetIncome').split(',')

    const res = await (yahooFinance as any).fundamentalsTimeSeries(symbol, { type: types })

    return NextResponse.json(
      { success: true, data: res, symbol, timestamp: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } }
    )
  } catch (error) {
    console.error('[Fundamentals TS API] 오류:', error)
    return NextResponse.json({ success: false, error: 'Fundamentals TS 로드 중 오류' }, { status: 500 })
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } })
}
