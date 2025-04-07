import {
  DJ,
  EntityName,
  UserDJRating,
  GlobalRanking,
} from '@/database/entities';
import { createClient } from '@/utils/supabase/client';
import { GlobalDJRankingDto } from '@/interfaces/dtos';

export interface GlobalDJRankingPaginatedResponse {
  list: GlobalDJRankingDto[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

interface FetchGlobalDJRankingsOptions {
  page: number;
  limit: number;
  userId: string;
  sortBy: 'user_rating' | 'global_rating' | 'user_unknown';
}

export async function fetchGlobalDJRankings(
  options: FetchGlobalDJRankingsOptions
): Promise<GlobalDJRankingPaginatedResponse> {
  const { page, limit, sortBy } = options;

  const offset = (page - 1) * limit;

  let list: GlobalDJRankingDto[] = [];

  if (sortBy === 'user_rating') {
    list = await fetchSortByUserRating(limit, offset);
  } else if (sortBy === 'global_rating') {
    list = await fetchSortByGlobalRating(limit, offset);
  } else if (sortBy === 'user_unknown') {
    list = await fetchSortByUserDJUnknown(limit, offset);
  }

  const totalPages = Math.ceil(list.length / limit);
  const hasMore = page < totalPages;

  return {
    list,
    total: list.length,
    page,
    totalPages,
    hasMore,
  };
}

async function fetchSortByGlobalRating(
  limit: number,
  offset: number
): Promise<GlobalDJRankingDto[]> {
  const supabase = createClient();

  // Fetch global rankings with the DJ data
  const { data, error } = await supabase
    .from(EntityName.GLOBAL_RANKINGS)
    .select('*, dj:dj_id(*)', { count: 'exact' })
    .eq('dj.status', 'APPROVED')
    .order('average_elo_rating', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  const globalRatingsData: (GlobalRanking & { dj: DJ })[] = data;

  return globalRatingsData.map((item, index) => ({
    dj: item.dj,
    average_elo_rating: item.average_elo_rating,
    total_battles: item.total_battles,
    last_updated: item.last_updated,
    ranking: index + 1,
  }));
}

async function fetchSortByUserRating(
  limit: number,
  offset: number
): Promise<GlobalDJRankingDto[]> {
  const supabase = createClient();

  // Fetch user ratings with the DJ data
  const { data, error } = await supabase
    .from(EntityName.USER_DJ_RATINGS)
    .select('*, dj:dj_id(*)', { count: 'exact' })
    .eq('dj.status', 'APPROVED')
    .or('unknown.is.null,unknown.eq.false')
    .order('elo_rating', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  const userRatingsData: (UserDJRating & { dj: DJ })[] = data;

  return userRatingsData.map((item, index) => ({
    dj: item.dj,
    average_elo_rating: -1,
    total_battles: -1,
    last_updated: item.last_updated,
    user_rating: item.elo_rating,
    user_knows_this_dj: true,
    user_ranking: index + 1,
  }));
}

async function fetchSortByUserDJUnknown(
  limit: number,
  offset: number
): Promise<GlobalDJRankingDto[]> {
  const supabase = createClient();

  // Fetch user ratings with the DJ data
  const { data, error } = await supabase
    .from(EntityName.USER_DJ_RATINGS)
    .select('*, dj:dj_id(*)', { count: 'exact' })
    .eq('dj.status', 'APPROVED')
    .eq('unknown', true)
    .order('dj(name)', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  const userRatingsData: (UserDJRating & { dj: DJ })[] = data;

  return userRatingsData.map((item) => ({
    dj: item.dj,
    average_elo_rating: -1,
    total_battles: -1,
    last_updated: item.last_updated,
    user_rating: item.elo_rating,
    user_knows_this_dj: false,
  }));
}

// export async function fetchGlobalDJRankings(
//   options: FetchGlobalDJRankingsOptions
// ): Promise<GlobalDJRankingPaginatedResponse> {
//   let result: DataResponse | undefined = undefined;

//   if (options.sortBy === 'average_elo_rating_desc') {
//     result = await getSortByGlobalRating(
//       options.userId,
//       (options.page - 1) * options.limit,
//       options.limit,
//       'DESC'
//     );
//   } else if (options.sortBy === 'average_elo_rating_asc') {
//     result = await getSortByGlobalRating(
//       options.userId,
//       (options.page - 1) * options.limit,
//       options.limit,
//       'ASC'
//     );
//   } else if (options.sortBy === 'user_rating_desc') {
//     result = await getSortByUserRating(
//       options.userId,
//       (options.page - 1) * options.limit,
//       options.limit,
//       'DESC'
//     );
//   } else if (options.sortBy === 'user_rating_asc') {
//     result = await getSortByUserRating(
//       options.userId,
//       (options.page - 1) * options.limit,
//       options.limit,
//       'ASC'
//     );
//   }
//   if (!result) throw new Error('Invalid sortBy option');

//   const totalPages = Math.ceil(result.totalCount / options.limit);
//   const hasMore = options.page < totalPages;

//   return {
//     globalRankings: result.data,
//     total: result.totalCount,
//     page: options.page,
//     totalPages,
//     hasMore,
//   };
// }

// async function getSortByGlobalRating(
//   userId: string,
//   offset: number,
//   limit: number,
//   sortBy: 'ASC' | 'DESC'
// ): Promise<DataResponse> {
//   // Fetch global rankings with the DJ data
//   const globalRatings = await supabase
//     .from(EntityName.GLOBAL_RANKINGS)
//     .select('*, dj:dj_id(*)', { count: 'exact' })
//     .eq('dj.status', 'APPROVED')
//     .order('average_elo_rating', { ascending: sortBy === 'ASC' })
//     .range(offset, offset + limit - 1);

//   if (globalRatings.error) throw globalRatings.error;

//   // Type the return data of supabase query
//   const globalRatingsData: (GlobalRanking & { dj: DJ })[] = globalRatings.data;

//   // Get the list of all djs ids from data
//   const djsIds = globalRatingsData.map((item) => item.dj.id);

//   // Fetch the djs data from the user_dj_ratings table (get user's related ratings)
//   const userRatings = await supabase
//     .from(EntityName.USER_DJ_RATINGS)
//     .select('*', { count: 'exact' })
//     .eq('user_id', userId)
//     .in('dj_id', djsIds);

//   if (userRatings.error) throw userRatings.error;

//   // Type the return data of supabase query
//   const userRatingsData: UserDJRating[] = userRatings.data;

//   // Merge the both list into data: GlobalDJRankingDto[]
//   const mergedData: GlobalDJRankingDto[] = globalRatingsData.map(
//     (item, index) => {
//       const userRating = userRatingsData.find(
//         (rating) => rating.dj_id === item.dj_id
//       );

//       return {
//         dj: item.dj,
//         average_elo_rating: item.average_elo_rating,
//         total_battles: item.total_battles,
//         last_updated: item.last_updated,
//         user_rating: userRating ? userRating.elo_rating : undefined,
//         user_knows_this_dj: userRating ? !userRating.unknown : undefined,
//       };
//     }
//   );

//   return {
//     data: mergedData,
//     totalCount: globalRatings.count || 0,
//   };
// }

// async function getSortByUserRating(
//   userId: string,
//   offset: number,
//   limit: number,
//   sortBy: 'ASC' | 'DESC'
// ): Promise<DataResponse> {
//   // Fetch user ratings with the DJ data
//   const userRatings = await supabase
//     .from(EntityName.USER_DJ_RATINGS)
//     .select(`*, dj:dj_id(*)`, { count: 'exact' })
//     .eq(`dj.status`, 'APPROVED')
//     .eq(`user_id`, userId)
//     .order(`elo_rating`, { ascending: sortBy === 'ASC' })
//     .range(offset, offset + limit - 1);

//   if (userRatings.error) throw userRatings.error;

//   // Type the return data of supabase query
//   const userRatingsData: (UserDJRating & { dj: DJ })[] = userRatings.data;

//   // Sort the user ratings by unknown last
//   userRatingsData.sort((a, b) => {
//     if (a.unknown && !b.unknown) return 1;
//     if (!a.unknown && b.unknown) return -1;
//     return 0;
//   });

//   // Get the list of all djs ids from data
//   const djsIds = userRatingsData.map((item) => item.dj.id);

//   // Get the global rankings for the djs ids
//   const globalRatings = await supabase
//     .from(EntityName.GLOBAL_RANKINGS)
//     .select('*', { count: 'exact' })
//     .in('dj_id', djsIds);

//   if (globalRatings.error) throw globalRatings.error;

//   // Type the return data of supabase query
//   const globalRatingsData: GlobalRanking[] = globalRatings.data;

//   // Merge the both list into data: GlobalDJRankingDto[]
//   const mergedData: GlobalDJRankingDto[] = userRatingsData.map((item) => {
//     const globalRanking = globalRatingsData.find(
//       (ranking) => ranking.dj_id === item.dj_id
//     );

//     if (!globalRanking) throw new Error('Global ranking not found');

//     return {
//       dj: item.dj,
//       average_elo_rating: globalRanking.average_elo_rating,
//       total_battles: globalRanking.total_battles,
//       last_updated: globalRanking.last_updated,
//       user_rating: item.elo_rating,
//       user_knows_this_dj: !item.unknown,
//     };
//   });

//   return {
//     data: mergedData,
//     totalCount: userRatings.count || 0,
//   };
// }

// interface DataResponse {
//   data: GlobalDJRankingDto[];
//   totalCount: number;
// }
