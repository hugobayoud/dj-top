import { DJ, GlobalRanking, UserDJRating } from '@/database/entities';
import { GlobalDJRankingDto } from '@/interfaces/dtos';
import { supabase } from '@/utils/supabase/client';

export interface DJsPaginatedResponse {
  djs: DJ[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Fetch DJs from the database
 * Works in both client and server components
 */
export async function fetchDJs(options: {
  page?: number;
  limit?: number;
  approvedOnly?: boolean;
  sortBy?: 'name' | 'globalRanking' | 'userRanking';
  userId?: string;
  excludeUnknown?: boolean;
}): Promise<DJsPaginatedResponse> {
  const limit = options.limit
    ? options.limit > 100
      ? 100
      : options.limit
    : 100;
  const {
    page = 1,
    approvedOnly = true,
    sortBy = 'name',
    userId = undefined,
    excludeUnknown = false,
  } = options;

  // Calculate offset for pagination
  const offset = (page - 1) * limit;

  try {
    let query;

    // Determine the select statement based on sorting requirements
    if (sortBy === 'globalRanking') {
      // Join with global_rankings table
      query = supabase
        .from('djs')
        .select('*, global_rankings!inner(*)', { count: 'exact' });
    } else if (sortBy === 'userRanking' && userId) {
      // Join with user_dj_ratings table for specific user
      query = supabase
        .from('djs')
        .select('*, user_dj_ratings!inner(*)', { count: 'exact' });

      // Add filter for the specific user
      query = query.eq('user_dj_ratings.user_id', userId);

      // Filter out unknown DJs if requested
      if (excludeUnknown) {
        query = query.is('user_dj_ratings.unknown', false);
      }
    } else {
      // Default select without joins
      if (excludeUnknown && userId) {
        // If we need to filter unknown DJs but not sorting by userRanking
        query = supabase
          .from('djs')
          .select('*, user_dj_ratings(*)', { count: 'exact' })
          .eq('user_dj_ratings.user_id', userId)
          .is('user_dj_ratings.unknown', false);
      } else {
        query = supabase.from('djs').select('*', { count: 'exact' });
      }
    }

    // Apply filters as needed
    if (approvedOnly) {
      query = query.eq('status', 'APPROVED');
    }

    // Apply sorting based on the sortBy option
    if (sortBy === 'globalRanking') {
      query = query.order('global_rankings.average_elo_rating', {
        ascending: false,
      });
    } else if (sortBy === 'userRanking' && userId) {
      query = query.order('user_dj_ratings.elo_rating', { ascending: false });
    } else {
      query = query.order('name', { ascending: true });
    }

    // Apply pagination
    const { data, error, count } = await query.range(
      offset,
      offset + limit - 1
    );

    if (error) throw error;

    // Process data to flatten the structure if needed
    const processedData = data.map((item: any) => {
      if (sortBy === 'globalRanking' && item.global_rankings) {
        const { global_rankings, ...dj } = item;
        return {
          ...dj,
          average_elo_rating: global_rankings.average_elo_rating,
          total_battles: global_rankings.total_battles,
        };
      } else if (sortBy === 'userRanking' && userId && item.user_dj_ratings) {
        const { user_dj_ratings, ...dj } = item;
        return {
          ...dj,
          elo_rating: user_dj_ratings.elo_rating,
          battles_count: user_dj_ratings.battles_count,
          unknown: user_dj_ratings.unknown,
        };
      } else if (excludeUnknown && userId && item.user_dj_ratings) {
        const { user_dj_ratings, ...dj } = item;
        return {
          ...dj,
          elo_rating: user_dj_ratings[0]?.elo_rating,
          battles_count: user_dj_ratings[0]?.battles_count,
          unknown: user_dj_ratings[0]?.unknown,
        };
      }
      return item;
    });

    return {
      djs: processedData as DJ[],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
      hasMore: offset + limit < (count || 0),
    };
  } catch (error) {
    console.error('Error fetching DJs:', error);
    throw error;
  }
}

export interface GlobalDJRankingPaginatedResponse {
  globalRankings: GlobalDJRankingDto[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

interface FetchGlobalDJRankingsOptions {
  page: number;
  limit: number;
  userId: string;
  sortBy:
    | 'average_elo_rating_asc'
    | 'average_elo_rating_desc'
    | 'user_ranking_asc'
    | 'user_ranking_desc';
  filterBy: 'all' | 'only_known_by_user';
}

export async function fetchGlobalDJRankings(
  options: FetchGlobalDJRankingsOptions
): Promise<GlobalDJRankingPaginatedResponse> {
  // Validate and sanitize inputs
  const page = Math.max(0, options.page); // First page is 0
  const limit = Math.min(100, Math.max(1, options.limit)); // Between 1 and 100
  const offset = page * limit;

  // Build base query
  let baseQuery = supabase.from('global_ranking');

  // Handle user-specific filtering and sorting
  if (
    options.sortBy === 'user_ranking_asc' ||
    options.sortBy === 'user_ranking_desc' ||
    options.filterBy === 'only_known_by_user'
  ) {
    // Query with user-specific join
    let query = baseQuery
      .select(
        `
        *,
        dj:dj_id(id, name, photo, status),
        user_dj_rating!inner(id, user_id, dj_id, elo_rating, unknown)
      `
      )
      .eq('dj.status', 'APPROVED')
      .eq('user_dj_rating.user_id', options.userId);

    // Apply known-by-user filter if requested
    if (options.filterBy === 'only_known_by_user') {
      query = query.eq('user_dj_rating.unknown', false);
    }

    // Apply sorting
    if (options.sortBy === 'user_ranking_asc') {
      query = query.order('user_dj_rating.elo_rating', { ascending: true });
    } else if (options.sortBy === 'user_ranking_desc') {
      query = query.order('user_dj_rating.elo_rating', { ascending: false });
    } else if (options.sortBy === 'average_elo_rating_asc') {
      query = query.order('average_elo_rating', { ascending: true });
    } else {
      query = query.order('average_elo_rating', { ascending: false });
    }

    // Get count (separate query for count to avoid typing issues)
    const countQuery = baseQuery
      .select('id', { count: 'exact', head: true })
      .eq('dj.status', 'APPROVED')
      .eq('user_dj_rating.user_id', options.userId);

    if (options.filterBy === 'only_known_by_user') {
      countQuery.eq('user_dj_rating.unknown', false);
    }

    const { count: totalCount, error: countError } = await countQuery;
    if (countError) throw countError;

    // Apply pagination to data query
    query = query.range(offset, offset + limit - 1);

    // Execute the query
    const { data, error } = await query;
    if (error) throw error;

    // Format the results
    const totalPages = Math.ceil((totalCount || 1) / limit);

    return {
      globalRankings: data || [],
      total: totalCount || 1,
      page,
      totalPages,
      hasMore: page < totalPages - 1,
    };
  } else {
    // Simple query without user-specific joins
    let query = baseQuery
      .select(
        `
        *,
        dj:dj_id(id, name, photo, status)
      `
      )
      .eq('dj.status', 'APPROVED');

    // Apply sorting
    if (options.sortBy === 'average_elo_rating_asc') {
      query = query.order('average_elo_rating', { ascending: true });
    } else {
      query = query.order('average_elo_rating', { ascending: false });
    }

    // Get count
    const { count: totalCount, error: countError } = await baseQuery
      .select('id', { count: 'exact', head: true })
      .eq('dj.status', 'APPROVED');

    if (countError) throw countError;

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Execute the query
    const { data, error } = await query;
    if (error) throw error;

    // Format the results
    const totalPages = Math.ceil((totalCount || 1) / limit);

    return {
      globalRankings: data || [],
      total: totalCount || 0,
      page,
      totalPages,
      hasMore: page < totalPages - 1,
    };
  }
}
