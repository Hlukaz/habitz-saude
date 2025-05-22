
export type UserProfile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  streak: number;
  streak_blocks: number;
  last_activity_date: string | null;
  last_streak_update: string | null;
  last_block_reset: string | null;
  notification_token: string | null;
  xp: number;
  created_at: string;
  updated_at: string;
  email: string | null;
};
