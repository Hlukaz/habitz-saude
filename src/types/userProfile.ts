
export interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  streak: number;
  streak_blocks: number;
  last_activity_date: string | null;
  last_streak_update: string | null;
  last_block_reset: string | null;
  notification_token: string | null;
  xp: number;
  created_at: string;
  updated_at: string;
}
