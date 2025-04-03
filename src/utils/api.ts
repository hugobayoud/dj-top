import { DJ } from '@/database/entities';
import { supabase } from '@/utils/supabase/client';

/**
 * Fetch DJs from the database
 * Works in both client and server components
 */
export async function fetchDJs(options: {
  page?: number;
  limit?: number;
  approvedOnly?: boolean;
}) {
  const { page = 1, limit = 100, approvedOnly = true } = options;

  // Calculate offset for pagination
  const offset = (page - 1) * limit;

  try {
    let query;

    // Use the appropriate Supabase client based on the context (server or client)
    query = supabase.from('djs').select('*', { count: 'exact' });

    // Apply filters as needed
    if (approvedOnly) {
      query = query.eq('status', 'APPROVED');
    }

    // Apply sorting and pagination
    const { data, error, count } = await query
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      djs: data as DJ[],
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
