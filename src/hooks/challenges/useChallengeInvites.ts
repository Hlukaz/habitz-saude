
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ChallengeWithDetails } from '../useChallenges';

const fetchChallengeInvites = async (userId: string): Promise<ChallengeWithDetails[]> => {
  try {
    // Get challenges where the user has a pending invitation
    const { data: pendingInvites, error: invitesError } = await supabase
      .from('challenge_participants')
      .select(`
        id,
        challenge_id,
        status,
        user_id
      `)
      .eq('user_id', userId)
      .eq('status', 'pending');

    if (invitesError) {
      console.error('Error fetching challenge invites:', invitesError);
      return [];
    }

    if (!pendingInvites || pendingInvites.length === 0) {
      return [];
    }

    // Get the challenge IDs for pending invites
    const challengeIds = pendingInvites.map(invite => invite.challenge_id);

    // Get the challenge details
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
      .in('id', challengeIds);

    if (challengesError) {
      console.error('Error fetching challenge details for invites:', challengesError);
      return [];
    }

    // Map challenges to include additional details
    const inviteChallenges = (challenges || []).map(challenge => {
      const activityName = challenge.activity_types?.name || null;
      const creatorProfile = challenge.profiles as any;
      const creatorName = creatorProfile?.full_name || creatorProfile?.username || 'Unknown';
      
      return {
        ...challenge,
        start_date: formatDateShort(challenge.start_date),
        end_date: formatDateShort(challenge.end_date),
        participants: 0, // We'll count them separately
        activity_name: activityName,
        creator_name: creatorName,
        is_creator: challenge.creator_id === userId,
        status: 'pending' as const
      };
    });

    // Fetch participant count for each challenge
    for (const challenge of inviteChallenges) {
      const { count } = await supabase
        .from('challenge_participants')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_id', challenge.id)
        .eq('status', 'accepted');
      
      challenge.participants = count || 0;
    }

    return inviteChallenges;
  } catch (error) {
    console.error('Error in fetchChallengeInvites:', error);
    return [];
  }
};

const formatDateShort = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
  return `${day} ${month.charAt(0).toUpperCase() + month.slice(1, 3)}`;
};

export const useChallengeInvites = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const {
    data: challengeInvites,
    isLoading: challengeInvitesLoading,
    error: challengeInvitesError
  } = useQuery({
    queryKey: ['challengeInvites', userId],
    queryFn: () => userId ? fetchChallengeInvites(userId) : Promise.resolve([]),
    enabled: !!userId
  });

  // Mutation for accepting a challenge invite
  const acceptChallengeMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('challenge_participants')
        .update({ status: 'accepted' })
        .eq('user_id', userId)
        .eq('challenge_id', challengeId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeChallenges'] });
      queryClient.invalidateQueries({ queryKey: ['challengeInvites'] });
      toast.success('Desafio aceito com sucesso!');
    },
    onError: (error: any) => {
      console.error('Error accepting challenge:', error);
      toast.error('Erro ao aceitar desafio: ' + error.message);
    }
  });

  // Mutation for declining a challenge invite
  const declineChallengeMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('challenge_participants')
        .update({ status: 'declined' })
        .eq('user_id', userId)
        .eq('challenge_id', challengeId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challengeInvites'] });
      toast.success('Desafio recusado.');
    },
    onError: (error: any) => {
      console.error('Error declining challenge:', error);
      toast.error('Erro ao recusar desafio: ' + error.message);
    }
  });

  return {
    challengeInvites: challengeInvites || [],
    challengeInvitesLoading,
    challengeInvitesError,
    acceptChallenge: (challengeId: string) => acceptChallengeMutation.mutate(challengeId),
    declineChallenge: (challengeId: string) => declineChallengeMutation.mutate(challengeId),
    isAcceptingChallenge: acceptChallengeMutation.isPending,
    isDecliningChallenge: declineChallengeMutation.isPending
  };
};
