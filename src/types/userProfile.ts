
export type UserProfile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  activity_points: number;
  nutrition_points: number;
  total_points: number;
  streak: number;
  streak_blocks: number;
  last_activity_date: string | null;
  last_streak_update: string | null;
  last_block_reset: string | null;
  notification_token: string | null;
  created_at: string;
  updated_at: string;
};
