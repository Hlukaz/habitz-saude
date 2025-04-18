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

// Tipo para registro de check-in
export type CheckInRecord = {
  id: string;
  user_id: string;
  type: 'activity' | 'nutrition';
  created_at: string;
  image_url?: string | null;
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
    xp: data.xp || 0,
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

// Buscar registros de check-in do usuário
export const fetchUserCheckIns = async (userId: string): Promise<CheckInRecord[]> => {
  const { data, error } = await supabase
    .from('user_checkins')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erro ao buscar check-ins:", error);
    return [];
  }

  return (data || []).map(item => ({
    id: item.id,
    user_id: item.user_id,
    type: item.type as 'activity' | 'nutrition',
    created_at: item.created_at,
    image_url: item.image_url
  }));
};

// Buscar dados de atividade da semana atual com base nos check-ins reais
export const fetchWeeklyActivity = async (userId: string): Promise<WeeklyActivityDay[]> => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Domingo, 1 = Segunda, ...
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - currentDay); // Define para o domingo da semana atual
  
  const dayAbbreviations = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  
  // Buscar check-ins do usuário na semana atual
  const startDate = weekStart.toISOString().split('T')[0];
  const endDate = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Adiciona 1 dia para incluir hoje
  
  const { data: checkIns, error } = await supabase
    .from('user_checkins')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', startDate)
    .lt('created_at', endDate);
  
  if (error) {
    console.error("Erro ao buscar check-ins da semana:", error);
    return createDefaultWeeklyActivity(dayAbbreviations, weekStart);
  }
  
  // Agrupar check-ins por data
  const checkInsByDate: Record<string, { activity: boolean, nutrition: boolean }> = {};
  
  checkIns?.forEach(checkIn => {
    const date = new Date(checkIn.created_at).toISOString().split('T')[0];
    
    if (!checkInsByDate[date]) {
      checkInsByDate[date] = { activity: false, nutrition: false };
    }
    
    if (checkIn.type === 'activity') {
      checkInsByDate[date].activity = true;
    } else if (checkIn.type === 'nutrition') {
      checkInsByDate[date].nutrition = true;
    }
  });
  
  // Criar array com os 7 dias da semana com os dados de check-in
  const weeklyActivity: WeeklyActivityDay[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    
    const checkInsForDay = checkInsByDate[dateString] || { activity: false, nutrition: false };
    
    // Um dia é considerado completo apenas se tem os dois tipos de check-in
    const isCompleted = checkInsForDay.activity && checkInsForDay.nutrition;
    
    weeklyActivity.push({
      day: dayAbbreviations[i],
      date: dateString,
      completed: isCompleted, // Só marcamos como completo se tiver os dois check-ins
      activityPoint: checkInsForDay.activity,
      nutritionPoint: checkInsForDay.nutrition
    });
  }
  
  return weeklyActivity;
};

// Função auxiliar para criar dados padrão da semana quando não há dados
const createDefaultWeeklyActivity = (
  dayAbbreviations: string[], 
  weekStart: Date
): WeeklyActivityDay[] => {
  const weeklyActivity: WeeklyActivityDay[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    
    weeklyActivity.push({
      day: dayAbbreviations[i],
      date: date.toISOString().split('T')[0],
      completed: false,
      activityPoint: false,
      nutritionPoint: false
    });
  }
  
  return weeklyActivity;
};

// Atualizar pontos do usuário e registrar check-in
export const updateUserPoints = async (
  userId: string, 
  type: 'activity' | 'nutrition', 
  currentProfile: UserProfile,
  imageUrl?: string,
  activityTypeId?: string
): Promise<UserProfile> => {
  // First register the check-in
  const { error: checkInError } = await supabase
    .from('user_checkins')
    .insert({
      user_id: userId,
      type: type,
      image_url: imageUrl || null,
      activity_type_id: activityTypeId || null
    });

  if (checkInError) {
    throw checkInError;
  }

  // Then update the points
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
      total_points: newTotalPoints,
      last_activity_date: new Date().toISOString().split('T')[0]
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  // After updating points, check for achievements
  if (type === 'activity' && activityTypeId) {
    await checkActivityAchievements(userId, activityTypeId, newActivityPoints);
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
    xp: data.xp || 0,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

// Verificar se o check-in já foi feito hoje
export const checkIfCheckedInToday = async (
  userId: string,
  type: 'activity' | 'nutrition'
): Promise<boolean> => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('user_checkins')
    .select('*')
    .eq('user_id', userId)
    .eq('type', type)
    .gte('created_at', today)
    .lt('created_at', new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]);
  
  if (error) {
    console.error("Erro ao verificar check-in:", error);
    return false;
  }
  
  return (data && data.length > 0);
};

const checkActivityAchievements = async (userId: string, activityTypeId: string, totalActivityPoints: number) => {
  // Get all achievements for this activity type that the user hasn't unlocked yet
  const { data: availableAchievements, error: achievementsError } = await supabase
    .from('achievements')
    .select(`
      id,
      name,
      required_points,
      xp_points,
      achievement_activities!inner(activity_type_id)
    `)
    .eq('achievement_activities.activity_type_id', activityTypeId)
    .not('id', 'in', (
      await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId)
    ).data?.map(ua => ua.achievement_id) || [])
    .order('required_points');

  if (achievementsError) {
    console.error('Error checking achievements:', achievementsError);
    return;
  }

  // Count activities of this type
  const { count } = await supabase
    .from('user_checkins')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('activity_type_id', activityTypeId);

  if (!count) return;

  // Check which achievements should be unlocked
  const achievementsToUnlock = availableAchievements?.filter(
    achievement => count >= achievement.required_points
  ) || [];

  // Unlock achievements
  for (const achievement of achievementsToUnlock) {
    const { error: unlockError } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievement.id
      });

    if (unlockError) {
      console.error('Error unlocking achievement:', unlockError);
      continue;
    }

    toast.success(`Conquista desbloqueada: ${achievement.name}!`);
  }
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
    enabled: !!userId,
    refetchInterval: 1000 * 60 * 5, // Atualiza a cada 5 minutos
  });

  const updatePointsMutation = useMutation({
    mutationFn: async ({ type, imageUrl }: { type: 'activity' | 'nutrition', imageUrl?: string }) => {
      if (!userId || !userProfile) {
        throw new Error('Usuário não autenticado ou perfil não carregado');
      }
      
      const alreadyCheckedIn = await checkIfCheckedInToday(userId, type);
      if (alreadyCheckedIn) {
        throw new Error(`Você já fez check-in de ${type === 'activity' ? 'atividade' : 'alimentação'} hoje`);
      }
      
      return updateUserPoints(userId, type, userProfile, imageUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
      queryClient.invalidateQueries({ queryKey: ['weeklyActivity', userId] });
      queryClient.invalidateQueries({ queryKey: ['userCheckIns', userId] });
      toast.success('Check-in realizado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar pontos:', error);
      toast.error(error.message || 'Erro ao realizar check-in. Tente novamente.');
    }
  });

  const handleCheckInSubmit = (images: string[]) => {
    if (!checkInType) return;
    
    const imageUrl = images.length > 0 ? images[0] : undefined;
    updatePointsMutation.mutate({ type: checkInType, imageUrl });
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
