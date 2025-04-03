export interface DJ {
  id: string; // UUID - Primary key
  name: string;
  photo: string;
  status: 'STAND_BY' | 'APPROVED' | 'REJECTED';
  instagram_url: string | null;
  facebook_url: string | null;
  website_url: string | null;
  youtube_url: string | null;
  created_at: Date;
}

export interface User {
  id: string; // Not uuid, because it's the user's id from supabase auth
  created_at: Date;
}

export interface UserDJRating {
  id: string; // UUID - Primary key
  user_id: string; // Foreign key to User.id
  dj_id: string; // Foreign key to DJ.id
  elo_rating: number;
  battles_count: number;
  unknown: boolean | null;
  last_updated: Date;
}

export interface GlobalRanking {
  dj_id: string; // Foreign key to DJ.id
  average_elo_rating: number;
  total_battles: number;
  last_updated: Date;
}
