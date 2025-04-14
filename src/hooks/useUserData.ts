
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Tipos para o perfil do usuário
export type UserProfile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  activity_points: number;
  nutrition_points: number;
  total_points: number;
  streak: number;
  streak_blocks: number;
  last_activity_date: string | null;
  last_streak_update: string | null;
  last_block_reset: string | null;
  notification_token: string | null;
};

// Tipos para o ranking de amigos
export type FriendRank = {
  id: string;
  name: string;
  points: number;
  position: number;
  positionChange: 'up' | 'down' | 'same';
  avatarUrl: string;
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

// Buscar ranking de amigos (mock por enquanto)
export const fetchFriendRanking = async (userId: string): Promise<FriendRank[]> => {
  // Simulando busca de ranking - isso pode ser implementado no futuro com dados reais
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

// Atualizar pontos do usuário
export const updateUserPoints = async (
  userId: string, 
  type: 'activity' | 'nutrition', 
  currentProfile: UserProfile
): Promise<UserProfile> => {
  // Calcula os novos pontos
  const newActivityPoints = type === 'activity' 
    ? currentProfile.activity_points + 1 
    : currentProfile.activity_points;
  
  const newNutritionPoints = type === 'nutrition' 
    ? currentProfile.nutrition_points + 1 
    : currentProfile.nutrition_points;
  
  const newTotalPoints = newActivityPoints + newNutritionPoints;

  // Atualiza o perfil no Supabase
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

  return data;
};

// Verificar se o check-in já foi feito hoje
export const checkIfCheckedInToday = async (
  userId: string,
  type: 'activity' | 'nutrition'
): Promise<boolean> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .eq('user_id', userId)
    .eq('type', type)
    .gte('created_at', today.toISOString())
    .limit(1);
    
  if (error) {
    throw error;
  }
  
  return data && data.length > 0;
};

export const useUserData = (userId: string | undefined) => {
  const [checkInType, setCheckInType] = useState<'activity' | 'nutrition' | null>(null);
  const queryClient = useQueryClient();

  // Buscar dados do perfil do usuário
  const { 
    data: userProfile, 
    isLoading: profileLoading, 
    error: profileError 
  } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => userId ? fetchUserProfile(userId) : Promise.reject('Usuário não autenticado'),
    enabled: !!userId
  });

  // Buscar ranking de amigos
  const {
    data: friendRanking,
    isLoading: rankingLoading,
    error: rankingError
  } = useQuery({
    queryKey: ['friendRanking', userId],
    queryFn: () => userId ? fetchFriendRanking(userId) : Promise.reject('Usuário não autenticado'),
    enabled: !!userId
  });

  // Mutação para atualizar pontos
  const updatePointsMutation = useMutation({
    mutationFn: async (type: 'activity' | 'nutrition') => {
      if (!userId || !userProfile) {
        throw new Error('Usuário não autenticado ou perfil não carregado');
      }
      
      // Verificar se já fez check-in hoje
      const alreadyCheckedIn = await checkIfCheckedInToday(userId, type);
      if (alreadyCheckedIn) {
        throw new Error(`Você já fez check-in de ${type === 'activity' ? 'atividade' : 'alimentação'} hoje`);
      }
      
      // Registrar check-in
      const { error: checkInError } = await supabase
        .from('check_ins')
        .insert({
          user_id: userId,
          type: type
        });
      
      if (checkInError) throw checkInError;
      
      // Atualizar pontos
      return updateUserPoints(userId, type, userProfile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
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
    checkInType,
    setCheckInType,
    handleCheckInSubmit,
  };
};
