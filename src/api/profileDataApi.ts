
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/userProfile';

// Function to fetch all user profiles
export const fetchProfiles = async (): Promise<UserProfile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');

  if (error) {
    throw error;
  }

  return data.map((profile: any) => ({
    id: profile.id,
    username: profile.username,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    streak: profile.streak || 0,
    streak_blocks: profile.streak_blocks || 2,
    last_activity_date: profile.last_activity_date,
    last_streak_update: profile.last_streak_update,
    last_block_reset: profile.last_block_reset,
    notification_token: profile.notification_token,
    xp: profile.xp || 0,
    created_at: profile.created_at,
    updated_at: profile.updated_at
  }));
};

// Function to fetch a single user profile
export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    username: data.username,
    full_name: data.full_name,
    avatar_url: data.avatar_url,
    streak: data.streak || 0,
    streak_blocks: data.streak_blocks || 2,
    last_activity_date: data.last_activity_date,
    last_streak_update: data.last_streak_update,
    last_block_reset: data.last_block_reset,
    notification_token: data.notification_token,
    xp: data.xp || 0,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};
