import { NextRequest, NextResponse } from 'next/server'
import { calculateBuffettIndicator } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const result = await calculateBuffettIndicator()
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error('버핏 지수 API 오류:', error)
    return NextResponse.json(
      { 
        success: false,
        error: '버핏 지수 계산 중 오류가 발생했습니다.' 
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
