import { NextRequest, NextResponse } from 'next/server';

import { fetchGlobalDJRankings } from '@/utils/api';
import { FetchDJsSortOption } from '@/constant/djs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const sort = searchParams.get('sort') as FetchDJsSortOption;

    const globalRankings = await fetchGlobalDJRankings({
      page: page,
      limit: 100,
      userId: 'user_1',
      sortBy: sort,
    });

    return NextResponse.json({
      list: globalRankings.list,
      totalPages: globalRankings.totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.warn('Error fetching DJs:', error);
    return NextResponse.json({ error: 'Failed to fetch DJs' }, { status: 500 });
  }
}
