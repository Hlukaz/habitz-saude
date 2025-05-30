
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCreateChallenge = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  const [challengeFormOpen, setChallengeFormOpen] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    name: '',
    activity_type_id: null as string | null,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    has_bet: false,
    bet_amount: null as number | null,
    is_habit_forming: true,
    invitedFriends: [] as string[],
    target_points: null as number | null
  });

  const createChallengeMutation = useMutation({
    mutationFn: async (challengeData: typeof newChallenge) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }

      console.log('Creating challenge with data:', challengeData);

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
        console.error('Error creating challenge:', challengeError);
        throw challengeError;
      }

      console.log('Challenge created successfully:', challenge);

      // Add the creator as a participant
      const { error: participantError } = await supabase
        .from('challenge_participants')
        .insert({
          challenge_id: challenge.id,
          user_id: userId,
          status: 'accepted'
        });

      if (participantError) {
        console.error('Error adding creator as participant:', participantError);
        throw participantError;
      }

      // Invite friends if provided
      if (challengeData.invitedFriends.length > 0) {
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
    },
    onSuccess: (data) => {
      console.log('Challenge creation mutation successful:', data);
      queryClient.invalidateQueries({ queryKey: ['activeChallenges'] });
      queryClient.invalidateQueries({ queryKey: ['challengeInvites'] });
      queryClient.invalidateQueries({ queryKey: ['completedChallenges'] });
      toast.success('Desafio criado com sucesso!');
      setChallengeFormOpen(false);
      setNewChallenge({
        name: '',
        activity_type_id: null,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        has_bet: false,
        bet_amount: null,
        is_habit_forming: true,
        invitedFriends: [],
        target_points: null
      });
    },
    onError: (error: any) => {
      console.error('Error creating challenge:', error);
      toast.error('Erro ao criar desafio: ' + error.message);
    }
  });

  const handleCreateChallenge = () => {
    console.log('Attempting to create challenge with data:', newChallenge);
    createChallengeMutation.mutate(newChallenge);
  };

  return {
    challengeFormOpen,
    setChallengeFormOpen,
    newChallenge,
    setNewChallenge,
    handleCreateChallenge,
    isCreatingChallenge: createChallengeMutation.isPending
  };
};
