
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

