export interface DJ {
  id: string;
  name: string;
  photo: string;
  instagram_url: string | null;
  facebook_url: string | null;
  website_url: string | null;
  youtube_url: string | null;
  status: 'STAND_BY' | 'APPROVED' | 'REJECTED';
  created_at: string;
}
