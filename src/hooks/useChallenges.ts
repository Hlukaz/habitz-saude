import { useAuth } from '@/context/AuthContext';
import { useCreateChallenge } from './challenges/useCreateChallenge';
import { useChallengeInvites } from './challenges/useChallengeInvites';
import { useActiveChallenges } from './challenges/useActiveChallenges';
import { useCompletedChallenges } from './challenges/useCompletedChallenges';

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
  target_points?: number | null;
  point_multiplier?: number | null;
  elimination_threshold?: number | null;
  rewards?: string | null;
  educational_tips?: string | null;
  reminder_enabled?: boolean;
  gradual_progression?: boolean;
};

export type ChallengeParticipant = {
  id: string;
  challenge_id: string;
  user_id: string;
  joined_at: string;
  status: 'pending' | 'accepted' | 'declined';
  points?: number;
  is_eliminated?: boolean;
  tier_level?: number;
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

export const useChallenges = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const createChallengeHook = useCreateChallenge(userId);
  const challengeInvitesHook = useChallengeInvites(userId);
  const activeChallengesHook = useActiveChallenges(userId);
  const completedChallengesHook = useCompletedChallenges(userId);

  return {
    ...createChallengeHook,
    ...challengeInvitesHook,
    ...activeChallengesHook,
    ...completedChallengesHook
  };
};
