
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ChallengeSummary {
  id: string;
  challenge_id: string;
  winner_user_id: string | null;
  total_participants: number;
  completion_type: string;
  summary_text: string | null;
  winner_points: number | null;
  total_bet_pool: number | null;
  created_at: string;
}

const fetchChallengeSummary = async (challengeId: string): Promise<ChallengeSummary | null> => {
  try {
    const { data, error } = await supabase
      .from('challenge_summaries')
      .select('*')
      .eq('challenge_id', challengeId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No summary found - challenge might not be completed yet
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching challenge summary:', error);
    return null;
  }
};

const fetchUserChallengePoints = async (challengeId: string, userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('challenge_participants')
      .select('points')
      .eq('challenge_id', challengeId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return data?.points || 0;
  } catch (error) {
    console.error('Error fetching user challenge points:', error);
    return 0;
  }
};

export const useChallengeSummary = (challengeId: string, userId: string | undefined) => {
  const {
    data: summary,
    isLoading: summaryLoading,
    error: summaryError
  } = useQuery({
    queryKey: ['challengeSummary', challengeId],
    queryFn: () => fetchChallengeSummary(challengeId),
    enabled: !!challengeId
  });

  const {
    data: userPoints,
    isLoading: pointsLoading,
    error: pointsError
  } = useQuery({
    queryKey: ['userChallengePoints', challengeId, userId],
    queryFn: () => userId ? fetchUserChallengePoints(challengeId, userId) : Promise.resolve(0),
    enabled: !!challengeId && !!userId
  });

  const isWinner = summary?.winner_user_id === userId;

  return {
    summary,
    userPoints: userPoints || 0,
    isWinner,
    isLoading: summaryLoading || pointsLoading,
    error: summaryError || pointsError
  };
};
