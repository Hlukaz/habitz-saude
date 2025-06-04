
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from '@/types/userProfile';
import { Achievement } from '@/types/activityTypes';

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

// Function to fetch user achievements with activity type information
export const fetchUserAchievements = async (userId: string): Promise<Achievement[]> => {
  try {
    // Primeiro buscamos conquistas que o usuário já desbloqueou
    const { data: unlockedData, error: unlockedError } = await supabase
      .from('user_achievements')
      .select(`
        id,
        unlocked_at,
        achievement:achievement_id (
          id,
          name,
          description,
          icon,
          required_points,
          tier,
          category,
          is_generic
        )
      `)
      .eq('user_id', userId);

    if (unlockedError) {
      console.error('Erro ao buscar conquistas desbloqueadas:', unlockedError);
    }

    // Buscamos todas as conquistas com suas atividades associadas
    const { data: allAchievementsData, error: allError } = await supabase
      .from('achievements')
      .select(`
        *,
        achievement_activities (
          activity_type_id,
          activity_types (
            id,
            name
          )
        )
      `);

    if (allError) {
      throw allError;
    }

    // Mapeamos as conquistas desbloqueadas
    const unlockedAchievements = (unlockedData || []).map((item: any) => ({
      id: item.achievement.id,
      name: item.achievement.name,
      description: item.achievement.description,
      icon: item.achievement.icon,
      required_points: item.achievement.required_points,
      tier: item.achievement.tier || 'bronze',
      category: item.achievement.category || 'general',
      is_generic: item.achievement.is_generic || true,
      unlocked: true,
      unlocked_at: item.unlocked_at,
      activity_type_ids: [] // Para conquistas já desbloqueadas, não precisamos dos IDs
    }));

    // Criamos uma lista de IDs de conquistas já desbloqueadas
    const unlockedIds = unlockedAchievements.map(a => a.id);

    // Adicionamos as conquistas que ainda não foram desbloqueadas
    const lockedAchievements = (allAchievementsData || [])
      .filter((a: any) => !unlockedIds.includes(a.id))
      .map((a: any) => ({
        id: a.id,
        name: a.name,
        description: a.description,
        icon: a.icon,
        required_points: a.required_points,
        tier: a.tier || 'bronze',
        category: a.category || 'general',
        is_generic: a.is_generic || true,
        unlocked: false,
        // Incluir os IDs dos tipos de atividade relacionados
        activity_type_ids: a.achievement_activities?.map((aa: any) => aa.activity_type_id) || []
      }));

    // Combinamos as duas listas
    return [...unlockedAchievements, ...lockedAchievements];
  } catch (error) {
    console.error('Erro ao buscar conquistas:', error);
    return [];
  }
};

// Custom hook for user profile data
export const useProfileData = (userId: string | undefined) => {
  const { 
    data: profile, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => userId ? fetchUserProfile(userId) : Promise.reject('Usuário não autenticado'),
    enabled: !!userId
  });

  const { 
    data: achievements = [],
    isLoading: isLoadingAchievements,
    error: achievementsError
  } = useQuery({
    queryKey: ['userAchievements', userId],
    queryFn: () => userId ? fetchUserAchievements(userId) : Promise.reject('Usuário não autenticado'),
    enabled: !!userId
  });

  return {
    profile,
    isLoading: isLoading || isLoadingAchievements,
    error: error || achievementsError,
    achievements
  };
};
