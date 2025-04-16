import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from '@/types/userProfile';

// Tipos para o ranking de amigos
export type FriendRank = {
  id: string;
  name: string;
  points: number;
  position: number;
  positionChange: 'up' | 'down' | 'same';
  avatarUrl: string;
};

// Tipo para os dados de atividade semanal
export type WeeklyActivityDay = {
  day: string;
  date: string;
  completed: boolean;
  activityPoint: boolean;
  nutritionPoint: boolean;
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

  return {
    id: data.id,
    username: data.username,
    full_name: data.full_name,
    avatar_url: data.avatar_url,
    activity_points: data.activity_points || 0,
    nutrition_points: data.nutrition_points || 0,
    total_points: data.total_points || 0,
    streak: data.streak || 0,
    streak_blocks: data.streak_blocks || 2,
    last_activity_date: data.last_activity_date,
    last_streak_update: data.last_streak_update,
    last_block_reset: data.last_block_reset,
    notification_token: data.notification_token,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

// Buscar ranking de amigos (mock por enquanto)
export const fetchFriendRanking = async (userId: string): Promise<FriendRank[]> => {
  return [{
    id: 'user-2',
    name: 'Ana Silva',
    points: 7,
    position: 1,
    positionChange: 'up',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?woman'
  }, {
    id: userId,
    name: 'Você',
    points: 5,
    position: 2,
    positionChange: 'same',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?person'
  }, {
    id: 'user-3',
    name: 'Carlos Gomes',
    points: 4,
    position: 3,
    positionChange: 'down',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?man'
  }, {
    id: 'user-4',
    name: 'Patricia Lima',
    points: 3,
    position: 4,
    positionChange: 'up',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?woman,2'
  }, {
    id: 'user-5',
    name: 'Marcelo Costa',
    points: 2,
    position: 5,
    positionChange: 'down',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?man,2'
  }];
};

// Buscar dados de atividade da semana atual
export const fetchWeeklyActivity = async (userId: string): Promise<WeeklyActivityDay[]> => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Domingo, 1 = Segunda, ...
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - currentDay); // Define para o domingo da semana atual
  
  const dayAbbreviations = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  
  // Criar array com os 7 dias da semana
  const weeklyActivity: WeeklyActivityDay[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    
    // Determinar se este dia já passou
    const isPastDay = date <= today;
    
    // Simulação: dias passados têm 70% de chance de terem sido completados
    const completed = isPastDay && Math.random() < 0.7;
    
    // Simulação: se completado, 80% de chance de ter os dois pontos
    const hasBothPoints = completed && Math.random() < 0.8;
    
    // Simulação: se não tem os dois pontos mas completou, 50% de chance de ter cada ponto
    const hasActivityPoint = hasBothPoints || (completed && Math.random() < 0.5);
    const hasNutritionPoint = hasBothPoints || (completed && Math.random() < 0.5);
    
    weeklyActivity.push({
      day: dayAbbreviations[i],
      date: date.toISOString().split('T')[0], // Formato YYYY-MM-DD
      completed: hasActivityPoint && hasNutritionPoint, // Consideramos completo se tem os dois pontos
      activityPoint: hasActivityPoint,
      nutritionPoint: hasNutritionPoint
    });
  }
  
  return weeklyActivity;
};

// Atualizar pontos do usuário
export const updateUserPoints = async (
  userId: string, 
  type: 'activity' | 'nutrition', 
  currentProfile: UserProfile
): Promise<UserProfile> => {
  const newActivityPoints = type === 'activity' 
    ? currentProfile.activity_points + 1 
    : currentProfile.activity_points;
  
  const newNutritionPoints = type === 'nutrition' 
    ? currentProfile.nutrition_points + 1 
    : currentProfile.nutrition_points;
  
  const newTotalPoints = newActivityPoints + newNutritionPoints;

  const { data, error } = await supabase
    .from('profiles')
    .update({ 
      activity_points: newActivityPoints,
      nutrition_points: newNutritionPoints,
      total_points: newTotalPoints
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    username: data.username,
    full_name: data.full_name,
    avatar_url: data.avatar_url,
    activity_points: data.activity_points || 0,
    nutrition_points: data.nutrition_points || 0,
    total_points: data.total_points || 0,
    streak: data.streak || 0,
    streak_blocks: data.streak_blocks || 2,
    last_activity_date: data.last_activity_date,
    last_streak_update: data.last_streak_update,
    last_block_reset: data.last_block_reset,
    notification_token: data.notification_token,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

// Verificar se o check-in já foi feito hoje
export const checkIfCheckedInToday = async (
  userId: string,
  type: 'activity' | 'nutrition'
): Promise<boolean> => {
  return false;
};

export const useUserData = (userId: string | undefined) => {
  const [checkInType, setCheckInType] = useState<'activity' | 'nutrition' | null>(null);
  const queryClient = useQueryClient();

  const { 
    data: userProfile, 
    isLoading: profileLoading, 
    error: profileError 
  } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => userId ? fetchUserProfile(userId) : Promise.reject('Usuário não autenticado'),
    enabled: !!userId
  });

  const {
    data: friendRanking,
    isLoading: rankingLoading,
    error: rankingError
  } = useQuery({
    queryKey: ['friendRanking', userId],
    queryFn: () => userId ? fetchFriendRanking(userId) : Promise.reject('Usuário não autenticado'),
    enabled: !!userId
  });
  
  const {
    data: weeklyActivity,
    isLoading: weeklyActivityLoading,
    error: weeklyActivityError
  } = useQuery({
    queryKey: ['weeklyActivity', userId],
    queryFn: () => userId ? fetchWeeklyActivity(userId) : Promise.reject('Usuário não autenticado'),
    enabled: !!userId
  });

  const updatePointsMutation = useMutation({
    mutationFn: async (type: 'activity' | 'nutrition') => {
      if (!userId || !userProfile) {
        throw new Error('Usuário não autenticado ou perfil não carregado');
      }
      
      const alreadyCheckedIn = await checkIfCheckedInToday(userId, type);
      if (alreadyCheckedIn) {
        throw new Error(`Você já fez check-in de ${type === 'activity' ? 'atividade' : 'alimentação'} hoje`);
      }
      
      return updateUserPoints(userId, type, userProfile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
      queryClient.invalidateQueries({ queryKey: ['weeklyActivity', userId] });
      toast.success('Check-in realizado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar pontos:', error);
      toast.error(error.message || 'Erro ao realizar check-in. Tente novamente.');
    }
  });

  const handleCheckInSubmit = (images: string[]) => {
    if (!checkInType) return;
    
    updatePointsMutation.mutate(checkInType);
    setCheckInType(null);
  };

  return {
    userProfile,
    profileLoading,
    profileError,
    friendRanking,
    rankingLoading,
    rankingError,
    weeklyActivity,
    weeklyActivityLoading,
    weeklyActivityError,
    checkInType,
    setCheckInType,
    handleCheckInSubmit,
  };
};
