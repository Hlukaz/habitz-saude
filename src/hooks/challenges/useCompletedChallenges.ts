import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChallengeWithDetails } from '../useChallenges';

const fetchCompletedChallenges = async (userId: string): Promise<ChallengeWithDetails[]> => {
  try {
    console.log('Fetching completed challenges for user:', userId);

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
      console.log('No completed challenge participants found');
      return [];
    }

    // Get the challenge IDs where the user is a participant
    const challengeIds = participantData.map(participant => participant.challenge_id);

    // First, get all challenges the user participates in
    const { data: allChallenges, error: challengesError } = await supabase
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
      .in('id', challengeIds);

    if (challengesError) {
      console.error('Error fetching challenges:', challengesError);
      return [];
    }

    if (!allChallenges || allChallenges.length === 0) {
      console.log('No challenges found');
      return [];
    }

    // Filter for completed challenges (status = 'completed' OR end_date has passed)
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    
    const completedChallenges = allChallenges.filter(challenge => {
      const endDate = new Date(challenge.end_date);
      endDate.setHours(23, 59, 59, 999); // Set to end of day for accurate comparison
      
      const isCompleted = challenge.status === 'completed';
      const hasEnded = endDate < currentDate;
      
      console.log(`Challenge ${challenge.name}: status=${challenge.status}, endDate=${challenge.end_date}, hasEnded=${hasEnded}, isCompleted=${isCompleted}`);
      
      return isCompleted || hasEnded;
    });

    console.log('Filtered completed challenges:', completedChallenges);

    // Get challenge summaries to determine winners
    const { data: summaries, error: summariesError } = await supabase
      .from('challenge_summaries')
      .select('*')
      .in('challenge_id', completedChallenges.map(c => c.id));

    if (summariesError) {
      console.error('Error fetching challenge summaries:', summariesError);
    }

    // Map challenges to include additional details
    const finalCompletedChallenges = completedChallenges.map(challenge => {
      const activityName = challenge.activity_types?.name || 'Qualquer Atividade';
      const creatorProfile = challenge.profiles as any;
      const creatorName = creatorProfile?.full_name || creatorProfile?.username || 'Usuário';
      
      // Check if user was the winner from challenge summaries
      const summary = summaries?.find(s => s.challenge_id === challenge.id);
      const wasWinner = summary?.winner_user_id === userId;
      
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
    for (const challenge of finalCompletedChallenges) {
      const { count } = await supabase
        .from('challenge_participants')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_id', challenge.id)
        .eq('status', 'accepted');
      
      challenge.participants = count || 0;
    }

    console.log('Final completed challenges:', finalCompletedChallenges);
    return finalCompletedChallenges;
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
    enabled: !!userId,
    refetchInterval: 30000 // Refetch every 30 seconds to catch newly completed challenges
  });

  return {
    completedChallenges: completedChallenges || [],
    completedChallengesLoading,
    completedChallengesError
  };
};
