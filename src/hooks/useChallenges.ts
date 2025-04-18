
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

// Tipos para desafios
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

// Buscar desafios ativos do usuário
const fetchUserActiveChallenges = async (userId: string): Promise<ChallengeWithDetails[]> => {
  // Desafios onde o usuário é participante e aceitou o convite
  const { data: participantChallenges, error: participantError } = await supabase
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
    .order('joined_at', { ascending: false });

  if (participantError) {
    console.error('Erro ao buscar desafios como participante:', participantError);
    return [];
  }

  // Transformar os dados para o formato esperado
  const activeChallenges = participantChallenges
    .filter(item => item.challenge)
    .map(item => {
      const challenge = item.challenge as any;
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
        participants: 0, // Será atualizado depois
        activity_name: challenge.activity_types?.name,
        creator_name: challenge.profiles?.full_name || challenge.profiles?.username,
        is_creator: challenge.creator_id === userId,
        status: item.status,
        // Calcular progresso baseado na data atual vs duração do desafio
        progress: calculateChallengeProgress(challenge.start_date, challenge.end_date)
      };
    });

  // Buscar o número de participantes para cada desafio
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

// Buscar convites de desafios pendentes para o usuário
const fetchChallengeInvites = async (userId: string): Promise<ChallengeWithDetails[]> => {
  const { data, error } = await supabase
    .from('challenge_participants')
    .select(`
      id,
      status,
      joined_at,
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
    .eq('status', 'pending')
    .order('joined_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar convites de desafios:', error);
    return [];
  }

  // Transformar os dados para o formato esperado
  const invites = data
    .filter(item => item.challenge)
    .map(item => {
      const challenge = item.challenge as any;
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
        participants: 0, // Será atualizado depois
        activity_name: challenge.activity_types?.name,
        creator_name: challenge.profiles?.full_name || challenge.profiles?.username,
        is_creator: challenge.creator_id === userId,
        status: 'pending' as const
      };
    });

  // Buscar o número de participantes para cada desafio
  for (const invite of invites) {
    const { count } = await supabase
      .from('challenge_participants')
      .select('*', { count: 'exact', head: true })
      .eq('challenge_id', invite.id)
      .eq('status', 'accepted');
    
    invite.participants = count || 0;
  }

  return invites;
};

// Buscar desafios concluídos do usuário
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

// Criar um novo desafio
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
  // Criar o desafio
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

  // Adicionar o criador como participante (status já aceito)
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

  // Convidar amigos se fornecidos
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
      console.error('Erro ao convidar amigos:', inviteError);
      // Não vamos falhar o desafio inteiro se os convites falharem
    }
  }

  return challenge;
};

// Aceitar um convite de desafio
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

// Recusar um convite de desafio
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

// Funções auxiliares
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

  // Se ainda não começou
  if (currentDate < startDate) return 0;
  // Se já terminou
  if (currentDate > endDate) return 100;

  // Calcula a duração total e quanto já passou
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsedDuration = currentDate.getTime() - startDate.getTime();
  
  // Calcula a porcentagem
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

  // Query para buscar desafios ativos
  const {
    data: activeChallenges,
    isLoading: activeChallengesLoading,
    error: activeChallengesError
  } = useQuery({
    queryKey: ['activeChallenges', userId],
    queryFn: () => userId ? fetchUserActiveChallenges(userId) : Promise.resolve([]),
    enabled: !!userId
  });

  // Query para buscar convites de desafios
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
  const {
    data: completedChallenges,
    isLoading: completedChallengesLoading,
    error: completedChallengesError
  } = useQuery({
    queryKey: ['completedChallenges', userId],
    queryFn: () => userId ? fetchCompletedChallenges(userId) : Promise.resolve([]),
    enabled: !!userId
  });

  // Mutation para criar um novo desafio
  const createChallengeMutation = useMutation({
    mutationFn: (challengeData: typeof newChallenge) => {
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }
      return createChallenge(userId, challengeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeChallenges'] });
      queryClient.invalidateQueries({ queryKey: ['challengeInvites'] });
      toast.success('Desafio criado com sucesso!');
      setChallengeFormOpen(false);
      // Reset do formulário
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
      console.error('Erro ao criar desafio:', error);
      toast.error('Erro ao criar desafio: ' + error.message);
    }
  });

  // Mutation para aceitar um convite de desafio
  const acceptChallengeMutation = useMutation({
    mutationFn: (challengeId: string) => {
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }
      return acceptChallengeInvite(userId, challengeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeChallenges'] });
      queryClient.invalidateQueries({ queryKey: ['challengeInvites'] });
      toast.success('Convite aceito com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao aceitar convite:', error);
      toast.error('Erro ao aceitar convite: ' + error.message);
    }
  });

  // Mutation para recusar um convite de desafio
  const declineChallengeMutation = useMutation({
    mutationFn: (challengeId: string) => {
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }
      return declineChallengeInvite(userId, challengeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challengeInvites'] });
      toast.success('Convite recusado.');
    },
    onError: (error: any) => {
      console.error('Erro ao recusar convite:', error);
      toast.error('Erro ao recusar convite: ' + error.message);
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
