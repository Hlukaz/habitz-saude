
import React from 'react';
import { ChallengeWithDetails } from '@/hooks/useChallenges';
import ActiveChallengeCard from './ActiveChallengeCard';
import InviteChallengeCard from './InviteChallengeCard';
import CompletedChallengeCard from './CompletedChallengeCard';

type ChallengeCardProps = {
  challenge: ChallengeWithDetails;
  variant?: 'active' | 'invite' | 'completed';
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  isAccepting?: boolean;
  isDeclining?: boolean;
};

const ChallengeCard = ({
  challenge,
  variant = 'active',
  onAccept,
  onDecline,
  isAccepting,
  isDeclining
}: ChallengeCardProps) => {
  switch (variant) {
    case 'active':
      return <ActiveChallengeCard challenge={challenge} />;
    
    case 'invite':
      return (
        <InviteChallengeCard 
          challenge={challenge}
          onAccept={onAccept}
          onDecline={onDecline}
          isAccepting={isAccepting}
          isDeclining={isDeclining}
        />
      );
    
    case 'completed':
      return <CompletedChallengeCard challenge={challenge} />;
    
    default:
      return <ActiveChallengeCard challenge={challenge} />;
  }
};

export default ChallengeCard;
