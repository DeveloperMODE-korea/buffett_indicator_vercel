import { NextRequest, NextResponse } from 'next/server';
import { getHistoricalData } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const years = searchParams.get('years');
    const yearsNumber = years ? parseInt(years, 10) : 5;

    if (isNaN(yearsNumber) || yearsNumber <= 0) {
      return NextResponse.json(
        { error: '올바른 년도를 입력해주세요.' },
        { status: 400 }
      );
    }

    const result = await getHistoricalData(yearsNumber);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('히스토리 데이터 API 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '히스토리 데이터 조회 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
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
  });
}
