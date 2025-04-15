import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// User Profile type with all fields
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
    activity_points: profile.activity_points || 0,
    nutrition_points: profile.nutrition_points || 0,
    total_points: profile.total_points || 0,
    streak: profile.streak || 0,
    streak_blocks: profile.streak_blocks || 2, // Default to 2 streak blocks
    last_activity_date: profile.last_activity_date,
    last_streak_update: profile.last_streak_update,
    last_block_reset: profile.last_block_reset,
    notification_token: profile.notification_token,
    created_at: profile.created_at,
    updated_at: profile.updated_at
  }));
};
