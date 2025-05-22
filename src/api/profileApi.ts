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

    if (existingPoints) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('user_activity_points')
        .update({ points: existingPoints.points + 1 })
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
  }

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

  // After updating points, check for achievements using the database function
  if (type === 'activity' && activityTypeId) {
    await checkActivityAchievementsDb(userId, activityTypeId);
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
