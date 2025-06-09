
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChallengeWithDetails } from '../useChallenges';

const fetchUserActiveChallenges = async (userId: string): Promise<ChallengeWithDetails[]> => {
  try {
    console.log('Fetching active challenges for user:', userId);

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
      console.error('Error fetching challenge participants:', participantError);
      return [];
    }

    if (!participantData || participantData.length === 0) {
      console.log('No active challenge participants found');
      return [];
    }

    // Get the challenge IDs where the user is a participant
    const challengeIds = participantData.map(participant => participant.challenge_id);
    console.log('Challenge IDs:', challengeIds);

    // Get the challenge details with activity types - only active challenges
    const { data: challenges, error: challengesError } = await supabase
      .from('challenges')
      .select(`
        *,
        activity_types (
          name
        )
      `)
      .in('id', challengeIds)
      .eq('status', 'active'); // Only get active challenges

    if (challengesError) {
      console.error('Error fetching active challenges:', challengesError);
      return [];
    }

    console.log('Fetched challenges:', challenges);

    // Filter out challenges that have ended (manual check)
    const currentDate = new Date();
    const filteredChallenges = (challenges || []).filter(challenge => {
      const endDate = new Date(challenge.end_date);
      return endDate >= currentDate; // Only include challenges that haven't ended yet
    });

    console.log('Filtered active challenges (excluding ended):', filteredChallenges);

    // Get creator profiles separately
    const creatorIds = [...new Set(filteredChallenges.map(c => c.creator_id))];
    const { data: creatorProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, full_name')
      .in('id', creatorIds);

    if (profilesError) {
      console.error('Error fetching creator profiles:', profilesError);
    }

    // Map challenges to include additional details
    const activeChallenges = filteredChallenges.map(challenge => {
      const activityName = challenge.activity_types?.name || 'Qualquer Atividade';
      const creatorProfile = creatorProfiles?.find(p => p.id === challenge.creator_id);
      const creatorName = creatorProfile?.full_name || creatorProfile?.username || 'Usuário';
      
      return {
        ...challenge,
        start_date: formatDateShort(challenge.start_date),
        end_date: formatDateShort(challenge.end_date),
        participants: 0, // We'll count them separately
        activity_name: activityName,
        creator_name: creatorName,
        is_creator: challenge.creator_id === userId,
        status: 'accepted' as const,
        progress: calculateChallengeProgress(challenge.start_date, challenge.end_date)
      };
    });

    // Fetch participant count for each challenge
    for (const challenge of activeChallenges) {
      const { count } = await supabase
        .from('challenge_participants')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_id', challenge.id)
        .eq('status', 'accepted');
      
      challenge.participants = count || 0;
    }

    console.log('Final active challenges:', activeChallenges);
    return activeChallenges;
  } catch (error) {
    console.error('Error in fetchUserActiveChallenges:', error);
    return [];
  }
};

const formatDateShort = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
  return `${day} ${month.charAt(0).toUpperCase() + month.slice(1, 3)}`;
};

const calculateChallengeProgress = (startDateStr: string, endDateStr: string) => {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const currentDate = new Date();

  if (currentDate < startDate) return 0;
  if (currentDate > endDate) return 100;

  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsedDuration = currentDate.getTime() - startDate.getTime();
  
  const progress = Math.round((elapsedDuration / totalDuration) * 100);
  return Math.min(100, Math.max(0, progress));
};

export const useActiveChallenges = (userId: string | undefined) => {
  const {
    data: activeChallenges,
    isLoading: activeChallengesLoading,
    error: activeChallengesError
  } = useQuery({
    queryKey: ['activeChallenges', userId],
    queryFn: () => userId ? fetchUserActiveChallenges(userId) : Promise.resolve([]),
    enabled: !!userId,
    refetchInterval: 30000 // Refetch every 30 seconds to catch status changes
  });

  return {
    activeChallenges: activeChallenges || [],
    activeChallengesLoading,
    activeChallengesError
  };
};
