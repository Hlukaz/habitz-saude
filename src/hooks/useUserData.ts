
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { UserProfile } from '@/types/userProfile';
import { ActivityTypePoints, FriendRank, WeeklyActivityDay } from '@/types/activityTypes';
import { 
  fetchUserProfile,
  updateUserPoints,
  checkIfCheckedInToday 
} from '@/api/profileApi';
import { 
  fetchWeeklyActivity, 
  fetchActivityTypePoints,
  fetchUserCheckIns
} from '@/api/activityApi';
import { fetchFriendRanking } from '@/api/socialApi';

// Re-export the types for backward compatibility
export type { 
  ActivityTypePoints, 
  FriendRank,
  WeeklyActivityDay 
};

export const useUserData = (userId: string | undefined) => {
  const [checkInType, setCheckInType] = useState<'activity' | 'nutrition' | null>(null);
  const queryClient = useQueryClient();

  // Fetch user profile
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
    enabled: !!userId,
    refetchInterval: 1000 * 60 * 5, // Atualiza a cada 5 minutos
  });

  const {
    data: activityTypePoints,
    isLoading: activityTypePointsLoading,
    error: activityTypePointsError
  } = useQuery({
    queryKey: ['activityTypePoints', userId],
    queryFn: () => userId ? fetchActivityTypePoints(userId) : Promise.reject('Usuário não autenticado'),
    enabled: !!userId
  });

  const updatePointsMutation = useMutation({
    mutationFn: async ({ 
      type, 
      imageUrl, 
      activityTypeId 
    }: { 
      type: 'activity' | 'nutrition', 
      imageUrl?: string,
      activityTypeId?: string
    }) => {
      if (!userId || !userProfile) {
        throw new Error('Usuário não autenticado ou perfil não carregado');
      }
      
      const alreadyCheckedIn = await checkIfCheckedInToday(userId, type);
      if (alreadyCheckedIn) {
        throw new Error(`Você já fez check-in de ${type === 'activity' ? 'atividade' : 'alimentação'} hoje`);
      }
      
      return updateUserPoints(userId, type, userProfile, imageUrl, activityTypeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
      queryClient.invalidateQueries({ queryKey: ['weeklyActivity', userId] });
      queryClient.invalidateQueries({ queryKey: ['userCheckIns', userId] });
      queryClient.invalidateQueries({ queryKey: ['activityTypePoints', userId] });
      toast.success('Check-in realizado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar pontos:', error);
      toast.error(error.message || 'Erro ao realizar check-in. Tente novamente.');
    }
  });

  const handleCheckInSubmit = (images: string[], activityTypeId?: string) => {
    if (!checkInType) return;
    
    const imageUrl = images.length > 0 ? images[0] : undefined;
    updatePointsMutation.mutate({ 
      type: checkInType, 
      imageUrl,
      activityTypeId 
    });
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
    activityTypePoints,
    activityTypePointsLoading,
    activityTypePointsError,
    checkInType,
    setCheckInType,
    handleCheckInSubmit,
  };
};
