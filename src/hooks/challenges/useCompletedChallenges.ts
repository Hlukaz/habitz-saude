
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChallengeWithDetails } from '../useChallenges';

const fetchCompletedChallenges = async (userId: string): Promise<ChallengeWithDetails[]> => {
  try {
    const now = new Date().toISOString();
    
    // Get challenges where the user is a participant with 'accepted' status
    const { data: participantData, error: participantError } = await supabase
      .from('challenge_participants')
      .select(`
        id,
        challenge_id,
        status,
        user_id
      `)
      .eq('user_id', userId)
      .eq('status', 'accepted');

    if (participantError) {
      console.error('Error fetching challenge participants for completed challenges:', participantError);
      return [];
    }

    if (!participantData || participantData.length === 0) {
      return [];
    }

    // Get the challenge IDs where the user is a participant
    const challengeIds = participantData.map(participant => participant.challenge_id);

    // Get the completed challenge details
    const { data: challenges, error: challengesError } = await supabase
      .from('challenges')
      .select(`
        *,
        activity_types (
          name
        ),
        profiles:profiles!challenges_creator_id_fkey (
          username,
          full_name
        )
      `)
      .in('id', challengeIds)
      .lt('end_date', now);

    if (challengesError) {
      console.error('Error fetching completed challenges:', challengesError);
      return [];
    }

    // Map challenges to include additional details
    const completedChallenges = (challenges || []).map(challenge => {
      const activityName = challenge.activity_types?.name || null;
      const creatorProfile = challenge.profiles as any;
      const creatorName = creatorProfile?.full_name || creatorProfile?.username || 'Unknown';
      const wasWinner = Math.random() > 0.5; // Temporary simulation
      
      return {
        ...challenge,
        start_date: formatDateShort(challenge.start_date),
        end_date: formatDateShort(challenge.end_date),
        participants: 0, // We'll count them separately
        activity_name: activityName,
        creator_name: creatorName,
        is_creator: challenge.creator_id === userId,
        status: 'accepted' as const,
        wasWinner
      };
    });

    // Fetch participant count for each challenge
    for (const challenge of completedChallenges) {
      const { count } = await supabase
        .from('challenge_participants')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_id', challenge.id)
        .eq('status', 'accepted');
      
      challenge.participants = count || 0;
    }

    return completedChallenges;
  } catch (error) {
    console.error('Error in fetchCompletedChallenges:', error);
    return [];
  }
};

const formatDateShort = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
  return `${day} ${month.charAt(0).toUpperCase() + month.slice(1, 3)}`;
};

export const useCompletedChallenges = (userId: string | undefined) => {
  const {
    data: completedChallenges,
    isLoading: completedChallengesLoading,
    error: completedChallengesError
  } = useQuery({
    queryKey: ['completedChallenges', userId],
    queryFn: () => userId ? fetchCompletedChallenges(userId) : Promise.resolve([]),
    enabled: !!userId
  });

  return {
    completedChallenges: completedChallenges || [],
    completedChallengesLoading,
    completedChallengesError
  };
};
