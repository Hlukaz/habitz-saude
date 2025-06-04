
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/userProfile';

// Fetch profile of the user
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

// Check and unlock achievements based on user's total points
export const checkAndUnlockAchievements = async (userId: string, totalPoints: number): Promise<void> => {
  try {
    // Buscar todas as conquistas que o usuário ainda não desbloqueou
    const { data: availableAchievements, error: achievementsError } = await supabase
      .from('achievements')
      .select(`
        id,
        name,
        required_points,
        category,
        is_generic
      `)
      .lte('required_points', totalPoints);

    if (achievementsError) {
      console.error('Erro ao buscar conquistas:', achievementsError);
      return;
    }

    if (!availableAchievements || availableAchievements.length === 0) {
      return;
    }

    // Buscar conquistas já desbloqueadas pelo usuário
    const { data: unlockedAchievements, error: unlockedError } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    if (unlockedError) {
      console.error('Erro ao buscar conquistas desbloqueadas:', unlockedError);
      return;
    }

    const unlockedIds = unlockedAchievements?.map(ua => ua.achievement_id) || [];

    // Filtrar conquistas que ainda não foram desbloqueadas
    const newAchievements = availableAchievements.filter(
      achievement => !unlockedIds.includes(achievement.id)
    );

    // Desbloquear novas conquistas
    if (newAchievements.length > 0) {
      const achievementsToInsert = newAchievements.map(achievement => ({
        user_id: userId,
        achievement_id: achievement.id,
        unlocked_at: new Date().toISOString()
      }));

      const { error: insertError } = await supabase
        .from('user_achievements')
        .insert(achievementsToInsert);

      if (insertError) {
        console.error('Erro ao desbloquear conquistas:', insertError);
      } else {
        console.log(`${newAchievements.length} novas conquistas desbloqueadas para o usuário ${userId}`);
      }
    }
  } catch (error) {
    console.error('Erro na verificação de conquistas:', error);
  }
};

// Check and unlock specific activity achievements
export const checkActivitySpecificAchievements = async (
  userId: string, 
  activityTypeId: string, 
  activityPoints: number
): Promise<void> => {
  try {
    // Buscar conquistas específicas para este tipo de atividade
    const { data: activityAchievements, error: activityError } = await supabase
      .from('achievement_activities')
      .select(`
        achievement:achievements!inner (
          id,
          name,
          required_points,
          category,
          is_generic
        )
      `)
      .eq('activity_type_id', activityTypeId);

    if (activityError) {
      console.error('Erro ao buscar conquistas de atividade:', activityError);
      return;
    }

    if (!activityAchievements || activityAchievements.length === 0) {
      return;
    }

    // Buscar conquistas já desbloqueadas pelo usuário
    const { data: unlockedAchievements, error: unlockedError } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    if (unlockedError) {
      console.error('Erro ao buscar conquistas desbloqueadas:', unlockedError);
      return;
    }

    const unlockedIds = unlockedAchievements?.map(ua => ua.achievement_id) || [];

    // Filtrar conquistas que o usuário pode desbloquear
    const eligibleAchievements = activityAchievements.filter(item => {
      const achievement = item.achievement;
      return achievement && 
             !unlockedIds.includes(achievement.id) &&
             activityPoints >= achievement.required_points;
    });

    // Desbloquear novas conquistas específicas
    if (eligibleAchievements.length > 0) {
      const achievementsToInsert = eligibleAchievements.map(item => ({
        user_id: userId,
        achievement_id: item.achievement.id,
        unlocked_at: new Date().toISOString()
      }));

      const { error: insertError } = await supabase
        .from('user_achievements')
        .insert(achievementsToInsert);

      if (insertError) {
        console.error('Erro ao desbloquear conquistas específicas:', insertError);
      } else {
        console.log(`${eligibleAchievements.length} conquistas específicas desbloqueadas`);
      }
    }
  } catch (error) {
    console.error('Erro na verificação de conquistas específicas:', error);
  }
};

// Update user points and register check-in
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

  // Only update the user_activity_points table if it's an activity check-in with a type
  if (type === 'activity' && activityTypeId) {
    // Check if there's an existing record for this user and activity type
    const { data: existingPoints, error: fetchError } = await supabase
      .from('user_activity_points')
      .select('*')
      .eq('user_id', userId)
      .eq('activity_type_id', activityTypeId)
      .maybeSingle();
    
    if (fetchError) {
      throw fetchError;
    }

    let newActivityPoints = 1;
    if (existingPoints) {
      // Update existing record
      newActivityPoints = existingPoints.points + 1;
      const { error: updateError } = await supabase
        .from('user_activity_points')
        .update({ points: newActivityPoints })
        .eq('id', existingPoints.id);
        
      if (updateError) {
        throw updateError;
      }
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from('user_activity_points')
        .insert({ 
          user_id: userId, 
          activity_type_id: activityTypeId,
          points: 1 
        });
        
      if (insertError) {
        throw insertError;
      }
    }

    // Check activity-specific achievements
    await checkActivitySpecificAchievements(userId, activityTypeId, newActivityPoints);
  }

  // Update profile
  const { data, error } = await supabase
    .from('profiles')
    .update({ 
      last_activity_date: new Date().toISOString().split('T')[0]
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Calcular total de pontos e verificar conquistas gerais
  const { data: allActivityPoints, error: pointsError } = await supabase
    .from('user_activity_points')
    .select('points')
    .eq('user_id', userId);

  if (!pointsError && allActivityPoints) {
    const totalPoints = allActivityPoints.reduce((sum, item) => sum + item.points, 0);
    // Check general achievements based on total points
    await checkAndUnlockAchievements(userId, totalPoints);
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

// Check if the user has already checked in today
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

// Invoca a função de banco de dados para verificar conquistas
export const checkActivityAchievementsDb = async (userId: string, activityTypeId: string) => {
  try {
    // Chamar a função no banco de dados que verificará as conquistas
    const { data, error } = await supabase.rpc('check_activity_achievements', {
      user_id_param: userId,
      activity_type_id_param: activityTypeId
    });

    if (error) {
      console.error('Erro ao verificar conquistas:', error);
    }
    
    return data;
  } catch (error) {
    console.error('Erro na verificação de conquistas:', error);
  }
};
