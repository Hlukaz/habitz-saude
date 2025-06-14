
import { supabase } from '@/integrations/supabase/client';
import { Achievement } from '@/types/activityTypes';
import { fetchUserNutritionCount } from './nutritionApi';

// Function to fetch user achievements with individual progress tracking
export const fetchUserAchievements = async (userId: string): Promise<Achievement[]> => {
  try {
    // Buscar perfil do usuário para obter streak
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('streak')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Erro ao buscar perfil:', profileError);
    }

    // Buscar contagem de check-ins de nutrição
    const nutritionCount = await fetchUserNutritionCount(userId);

    // Buscar conquistas com seus pontos individuais
    const { data: achievementsWithPoints, error: achievementsError } = await supabase
      .from('achievements')
      .select(`
        *,
        user_achievement_points!inner (
          current_points,
          required_points
        ),
        achievement_activities (
          activity_type_id,
          activity_types (
            id,
            name
          )
        )
      `)
      .eq('user_achievement_points.user_id', userId);

    if (achievementsError) {
      console.error('Erro ao buscar conquistas com pontos:', achievementsError);
    }

    // Buscar conquistas já desbloqueadas
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

    // Buscar todas as conquistas disponíveis
    const { data: allAchievements, error: allError } = await supabase
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

    // Mapear conquistas desbloqueadas
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
      current_points: item.achievement.required_points, // Conquista desbloqueada = pontos completos
      activity_type_ids: []
    }));

    const unlockedIds = unlockedAchievements.map(a => a.id);

    // Mapear conquistas com progresso
    const achievementsWithProgress = (achievementsWithPoints || []).map((a: any) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      icon: a.icon,
      required_points: a.required_points,
      tier: a.tier || 'bronze',
      category: a.category || 'general',
      is_generic: a.is_generic || true,
      unlocked: unlockedIds.includes(a.id),
      unlocked_at: unlockedIds.includes(a.id) ? unlockedAchievements.find(ua => ua.id === a.id)?.unlocked_at : undefined,
      current_points: a.user_achievement_points?.[0]?.current_points || 0,
      activity_type_ids: a.achievement_activities?.map((aa: any) => aa.activity_type_id) || []
    }));

    // Adicionar conquistas que ainda não têm progresso mas calcular progresso baseado na categoria
    const progressIds = achievementsWithProgress.map(a => a.id);
    const remainingAchievements = (allAchievements || [])
      .filter((a: any) => !progressIds.includes(a.id) && !unlockedIds.includes(a.id))
      .map((a: any) => {
        let currentPoints = 0;
        
        // Calcular pontos atuais baseado na categoria
        if (a.category === 'nutrition') {
          currentPoints = nutritionCount;
        } else if (a.category === 'streak') {
          currentPoints = userProfile?.streak || 0;
        }
        
        return {
          id: a.id,
          name: a.name,
          description: a.description,
          icon: a.icon,
          required_points: a.required_points,
          tier: a.tier || 'bronze',
          category: a.category || 'general',
          is_generic: a.is_generic || true,
          unlocked: false,
          current_points: currentPoints,
          activity_type_ids: a.achievement_activities?.map((aa: any) => aa.activity_type_id) || []
        };
      });

    return [...unlockedAchievements, ...achievementsWithProgress, ...remainingAchievements];
  } catch (error) {
    console.error('Erro ao buscar conquistas:', error);
    return [];
  }
};
