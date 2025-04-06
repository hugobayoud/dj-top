/**
 * Constants for Elo rating system
 */
export const BASE_ELO = 1400;
export const K_FACTOR = 32;

export type FetchDJsSortOption =
  | 'user_rating'
  | 'global_rating'
  | 'user_unknown';
