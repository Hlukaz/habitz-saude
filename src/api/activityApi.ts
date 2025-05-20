
import { supabase } from '@/integrations/supabase/client';
import { WeeklyActivityDay, ActivityTypePoints, CheckInRecord } from '@/types/activityTypes';

// Fetch user check-ins
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

// Fetch weekly activity data
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

// Helper function for creating default weekly activity
export const createDefaultWeeklyActivity = (
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

// Fetch activity type points
export const fetchActivityTypePoints = async (userId: string): Promise<ActivityTypePoints[]> => {
  const { data, error } = await supabase
    .from('user_activity_points')
    .select(`
      activity_type_id,
      points,
      activity_types(name)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error("Erro ao buscar pontos por tipo de atividade:", error);
    return [];
  }

  return (data || []).map(item => ({
    activity_type_id: item.activity_type_id,
    activity_name: item.activity_types?.name || 'Desconhecido',
    points: item.points
  }));
};
