export interface DJDto {
  id: string; // UUID
  name: string;
  photo: string;
  status: 'STAND_BY' | 'APPROVED' | 'REJECTED';
  instagram_url: string | null;
  facebook_url: string | null;
  website_url: string | null;
  youtube_url: string | null;
  created_at: Date;
}

export interface UserDJRatingDto {
  dj: DJDto;
  elo_rating: number;
  battles_count: number;
  unknown: boolean | null;
  last_updated: Date;
}

export interface GlobalRankingDto {
  dj: DJDto;
  average_elo_rating: number;
  total_battles: number;
  last_updated: Date;
}
