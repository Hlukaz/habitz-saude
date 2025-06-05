
import { supabase } from '@/integrations/supabase/client';

// Function to fetch user nutrition check-ins count
export const fetchUserNutritionCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('user_checkins')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .eq('type', 'nutrition');

  if (error) {
    console.error('Erro ao buscar contagem de nutrição:', error);
    return 0;
  }

  return count || 0;
};
