
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Achievement } from '@/components/AchievementsList';

// Tipos para o perfil do usuário
export type UserProfile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  activity_points: number;
  nutrition_points: number;
  total_points: number;
  created_at: string;
  streak: number;
  streak_blocks: number;
  last_activity_date: string | null;
  last_streak_update: string | null;
  last_block_reset: string | null;
  notification_token: string | null;
};

// Buscar perfil do usuário
export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// Buscar todas as conquistas disponíveis
export const fetchAchievements = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('required_points', { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
};

// Buscar conquistas desbloqueadas pelo usuário
export const fetchUserAchievements = async (userId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*, achievement_id(*)')
    .eq('user_id', userId);

  if (error) {
    throw error;
  }

  return data || [];
};

export const useProfileData = (userId: string | undefined) => {
  // Buscar dados do perfil do usuário
  const { 
    data: profile, 
    isLoading: profileLoading, 
    error: profileError 
  } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => userId ? fetchUserProfile(userId) : Promise.reject('Usuário não autenticado'),
    enabled: !!userId
  });

  // Buscar todas as conquistas disponíveis
  const { 
    data: allAchievements, 
    isLoading: achievementsLoading 
  } = useQuery({
    queryKey: ['achievements'],
    queryFn: fetchAchievements
  });

  // Buscar conquistas desbloqueadas pelo usuário
  const { 
    data: userAchievements, 
    isLoading: userAchievementsLoading 
  } = useQuery({
    queryKey: ['userAchievements', userId],
    queryFn: () => userId ? fetchUserAchievements(userId) : Promise.reject('Usuário não autenticado'),
    enabled: !!userId
  });

  // Processar e combinar dados de conquistas
  const processAchievements = (): Achievement[] => {
    if (!allAchievements || !userAchievements) return [];
    
    // Criar mapa de conquistas desbloqueadas pelo usuário
    const unlockedMap = new Map();
    userAchievements.forEach(ua => {
      unlockedMap.set(ua.achievement_id.id, {
        unlocked: true,
        unlocked_at: ua.unlocked_at
      });
    });
    
    // Combinar com todas as conquistas
    return allAchievements.map(achievement => ({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
      required_points: achievement.required_points,
      unlocked: unlockedMap.has(achievement.id),
      unlocked_at: unlockedMap.get(achievement.id)?.unlocked_at
    }));
  };

  // Carregamento compartilhado para todos os dados
  const isLoading = profileLoading || achievementsLoading || userAchievementsLoading;
  const error = profileError;
  const achievements = processAchievements();

  return {
    profile,
    isLoading,
    error,
    achievements
  };
};
