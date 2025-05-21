
export type WeeklyActivityDay = {
  day: string;
  date: string;
  completed: boolean;
  activityPoint: boolean;
  nutritionPoint: boolean;
};

export type CheckInRecord = {
  id: string;
  user_id: string;
  type: 'activity' | 'nutrition';
  created_at: string;
  image_url?: string | null;
};

export type ActivityTypePoints = {
  activity_type_id: string;
  activity_name: string; 
  points: number;
};

export type FriendRank = {
  id: string;
  name: string;
  points: number;
  position: number;
  positionChange: 'up' | 'down' | 'same';
  avatarUrl: string;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  required_points: number;
  unlocked: boolean;
  unlocked_at?: string;
  tier?: 'bronze' | 'silver' | 'gold';
  category?: 'general' | 'activity' | 'nutrition' | 'streak';
  is_generic?: boolean;
};
