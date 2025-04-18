import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

// Types for challenges
export type Challenge = {
  id: string;
  name: string;
  creator_id: string;
  activity_type_id: string | null;
  start_date: string;
  end_date: string;
  has_bet: boolean;
  bet_amount: number | null;
  created_at: string;
};

export type ChallengeParticipant = {
  id: string;
  challenge_id: string;
  user_id: string;
  joined_at: string;
  status: 'pending' | 'accepted' | 'declined';
};

export type ChallengeWithDetails = Challenge & {
  participants: number;
  progress?: number;
  creator_name?: string;
  activity_name?: string;
  is_creator?: boolean;
  status?: 'pending' | 'accepted' | 'declined';
  wasWinner?: boolean;
};

// Fetch active challenges where user is a participant
const fetchUserActiveChallenges = async (userId: string): Promise<ChallengeWithDetails[]> => {
  const { data: participantChallenges, error: participantError } = await supabase
    .from('challenge_participants')
    .select(`
      status,
      challenges (
        *,
        activity_types(name),
        profiles:creator_id(username, full_name)
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'accepted');

  if (participantError) {
    console.error('Error fetching active challenges:', participantError);
    return [];
  }

  const activeChallenges = (participantChallenges || [])
    .filter(item => item.challenges)
    .map(item => {
      const challenge = item.challenges as any;
      return {
        ...challenge,
        start_date: formatDateShort(challenge.start_date),
        end_date: formatDateShort(challenge.end_date),
        participants: 0,
        activity_name: challenge.activity_types?.name,
        creator_name: challenge.profiles?.full_name || challenge.profiles?.username,
        is_creator: challenge.creator_id === userId,
        status: item.status,
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

  return activeChallenges;
};

// Fetch challenge invites
const fetchChallengeInvites = async (userId: string): Promise<ChallengeWithDetails[]> => {
  const { data: invites, error } = await supabase
    .from('challenge_participants')
    .select(`
      status,
      challenges (
        *,
        activity_types(name),
        profiles:creator_id(username, full_name)
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'pending');

  if (error) {
    console.error('Error fetching challenge invites:', error);
    return [];
  }

  const challenges = (invites || [])
    .filter(item => item.challenges)
    .map(item => {
      const challenge = item.challenges as any;
      return {
        ...challenge,
        start_date: formatDateShort(challenge.start_date),
        end_date: formatDateShort(challenge.end_date),
        participants: 0,
        activity_name: challenge.activity_types?.name,
        creator_name: challenge.profiles?.full_name || challenge.profiles?.username,
        is_creator: challenge.creator_id === userId,
        status: 'pending' as const
      };
    });

  // Fetch participant count for each challenge
  for (const challenge of challenges) {
    const { count } = await supabase
      .from('challenge_participants')
      .select('*', { count: 'exact', head: true })
      .eq('challenge_id', challenge.id)
      .eq('status', 'accepted');
    
    challenge.participants = count || 0;
  }

  return challenges;
};

// Create a new challenge
const createChallenge = async (
  userId: string,
  challengeData: {
    name: string;
    activity_type_id: string | null;
    start_date: string;
    end_date: string;
    has_bet: boolean;
    bet_amount: number | null;
    invitedFriends?: string[];
  }
) => {
  // Create the challenge
  const { data: challenge, error: challengeError } = await supabase
    .from('challenges')
    .insert({
      name: challengeData.name,
      creator_id: userId,
      activity_type_id: challengeData.activity_type_id,
      start_date: challengeData.start_date,
      end_date: challengeData.end_date,
      has_bet: challengeData.has_bet,
      bet_amount: challengeData.has_bet ? challengeData.bet_amount : null
    })
    .select()
    .single();

  if (challengeError) {
    throw challengeError;
  }

  // Add the creator as a participant (status already accepted)
  const { error: participantError } = await supabase
    .from('challenge_participants')
    .insert({
      challenge_id: challenge.id,
      user_id: userId,
      status: 'accepted'
    });

  if (participantError) {
    throw participantError;
  }

  // Invite friends if provided
  if (challengeData.invitedFriends && challengeData.invitedFriends.length > 0) {
    const invites = challengeData.invitedFriends.map(friendId => ({
      challenge_id: challenge.id,
      user_id: friendId,
      status: 'pending'
    }));

    const { error: inviteError } = await supabase
      .from('challenge_participants')
      .insert(invites);

    if (inviteError) {
      console.error('Error inviting friends:', inviteError);
    }
  }

  return challenge;
};

// Accept a challenge invite
const acceptChallengeInvite = async (userId: string, challengeId: string) => {
  const { error } = await supabase
    .from('challenge_participants')
    .update({ status: 'accepted' })
    .eq('user_id', userId)
    .eq('challenge_id', challengeId);

  if (error) {
    throw error;
  }
};

// Decline a challenge invite
const declineChallengeInvite = async (userId: string, challengeId: string) => {
  const { error } = await supabase
    .from('challenge_participants')
    .update({ status: 'declined' })
    .eq('user_id', userId)
    .eq('challenge_id', challengeId);

  if (error) {
    throw error;
  }
};

// Helper functions
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

export const useChallenges = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();
  const [challengeFormOpen, setChallengeFormOpen] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    name: '',
    activity_type_id: null as string | null,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    has_bet: false,
    bet_amount: null as number | null,
    invitedFriends: [] as string[]
  });

  // Query for active challenges
  const {
    data: activeChallenges,
    isLoading: activeChallengesLoading,
    error: activeChallengesError
  } = useQuery({
    queryKey: ['activeChallenges', userId],
    queryFn: () => userId ? fetchUserActiveChallenges(userId) : Promise.resolve([]),
    enabled: !!userId
  });

  // Query for challenge invites
  const {
    data: challengeInvites,
    isLoading: challengeInvitesLoading,
    error: challengeInvitesError
  } = useQuery({
    queryKey: ['challengeInvites', userId],
    queryFn: () => userId ? fetchChallengeInvites(userId) : Promise.resolve([]),
    enabled: !!userId
  });

  // Query para buscar desafios concluídos
  const fetchCompletedChallenges = async (userId: string): Promise<ChallengeWithDetails[]> => {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('challenge_participants')
      .select(`
        status,
        challenge:challenges(
          id,
          name,
          creator_id,
          activity_type_id,
          start_date,
          end_date,
          has_bet,
          bet_amount,
          created_at,
          activity_types(name),
          profiles:creator_id(username, full_name)
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'accepted')
      .lt('challenge.end_date', now)
      .order('challenge.end_date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar desafios concluídos:', error);
      return [];
    }

    // Por enquanto, simularemos o resultado do vencedor aleatoriamente
    const completedChallenges = data
      .filter(item => item.challenge)
      .map(item => {
        const challenge = item.challenge as any;
        const wasWinner = Math.random() > 0.5; // Simulação temporária 
        
        return {
          id: challenge.id,
          name: challenge.name,
          creator_id: challenge.creator_id,
          activity_type_id: challenge.activity_type_id,
          start_date: formatDateShort(challenge.start_date),
          end_date: formatDateShort(challenge.end_date),
          has_bet: challenge.has_bet,
          bet_amount: challenge.bet_amount,
          created_at: challenge.created_at,
          participants: 0,
          activity_name: challenge.activity_types?.name,
          creator_name: challenge.profiles?.full_name || challenge.profiles?.username,
          is_creator: challenge.creator_id === userId,
          status: 'accepted' as const,
          wasWinner
        };
      });

    // Buscar o número de participantes para cada desafio
    for (const challenge of completedChallenges) {
      const { count } = await supabase
        .from('challenge_participants')
        .select('*', { count: 'exact', head: true })
        .eq('challenge_id', challenge.id)
        .eq('status', 'accepted');
      
      challenge.participants = count || 0;
    }

    return completedChallenges;
  };

  const {
    data: completedChallenges,
    isLoading: completedChallengesLoading,
    error: completedChallengesError
  } = useQuery({
    queryKey: ['completedChallenges', userId],
    queryFn: () => userId ? fetchCompletedChallenges(userId) : Promise.resolve([]),
    enabled: !!userId
  });

  // Mutation for creating a new challenge
  const createChallengeMutation = useMutation({
    mutationFn: (challengeData: typeof newChallenge) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      return createChallenge(userId, challengeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeChallenges'] });
      queryClient.invalidateQueries({ queryKey: ['challengeInvites'] });
      toast.success('Challenge created successfully!');
      setChallengeFormOpen(false);
      setNewChallenge({
        name: '',
        activity_type_id: null,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        has_bet: false,
        bet_amount: null,
        invitedFriends: []
      });
    },
    onError: (error: any) => {
      console.error('Error creating challenge:', error);
      toast.error('Error creating challenge: ' + error.message);
    }
  });

  // Mutation for accepting a challenge invite
  const acceptChallengeMutation = useMutation({
    mutationFn: (challengeId: string) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      return acceptChallengeInvite(userId, challengeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeChallenges'] });
      queryClient.invalidateQueries({ queryKey: ['challengeInvites'] });
      toast.success('Challenge accepted!');
    },
    onError: (error: any) => {
      console.error('Error accepting challenge:', error);
      toast.error('Error accepting challenge: ' + error.message);
    }
  });

  // Mutation for declining a challenge invite
  const declineChallengeMutation = useMutation({
    mutationFn: (challengeId: string) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      return declineChallengeInvite(userId, challengeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challengeInvites'] });
      toast.success('Challenge declined.');
    },
    onError: (error: any) => {
      console.error('Error declining challenge:', error);
      toast.error('Error declining challenge: ' + error.message);
    }
  });

  const handleCreateChallenge = () => {
    createChallengeMutation.mutate(newChallenge);
  };

  return {
    activeChallenges: activeChallenges || [],
    activeChallengesLoading,
    activeChallengesError,
    challengeInvites: challengeInvites || [],
    challengeInvitesLoading,
    challengeInvitesError,
    completedChallenges: completedChallenges || [],
    completedChallengesLoading,
    completedChallengesError,
    challengeFormOpen,
    setChallengeFormOpen,
    newChallenge,
    setNewChallenge,
    handleCreateChallenge,
    acceptChallenge: (challengeId: string) => acceptChallengeMutation.mutate(challengeId),
    declineChallenge: (challengeId: string) => declineChallengeMutation.mutate(challengeId),
    isCreatingChallenge: createChallengeMutation.isPending,
    isAcceptingChallenge: acceptChallengeMutation.isPending,
    isDecliningChallenge: declineChallengeMutation.isPending
  };
};
