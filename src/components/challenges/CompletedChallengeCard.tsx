
import React, { useState } from 'react';
import { Trophy, Users, Calendar, DollarSign, Dumbbell } from 'lucide-react';
import { ChallengeWithDetails } from '@/hooks/useChallenges';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import ChallengeDetailsSheet from './ChallengeDetailsSheet';
import ChallengeSummaryDialog from './ChallengeSummaryDialog';
import { useChallengeSummary } from '@/hooks/challenges/useChallengeSummary';

interface CompletedChallengeCardProps {
  challenge: ChallengeWithDetails;
}

const CompletedChallengeCard = ({ challenge }: CompletedChallengeCardProps) => {
  const { user } = useAuth();
  const [showSummary, setShowSummary] = useState(false);
  
  const { summary, userPoints, isWinner, isLoading } = useChallengeSummary(
    challenge.id, 
    user?.id
  );

  const handleViewSummary = () => {
    setShowSummary(true);
  };

  return (
    <div 
      className={cn(
        "bg-card p-3 rounded-lg shadow-sm border-l-4",
        challenge.wasWinner ? "border-levelup-success" : "border-levelup-danger"
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{challenge.name}</h3>
        {challenge.wasWinner && (
          <div className="bg-levelup-success/20 px-2 py-1 rounded text-xs text-levelup-success font-medium flex items-center">
            <Trophy className="w-3 h-3 mr-1" />
            Vencedor
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-y-1 mt-2 text-sm text-muted-foreground">
        <div className="flex items-center w-1/2">
          <Users className="w-3 h-3 mr-1" />
          <span>{challenge.participants} participantes</span>
        </div>
        <div className="flex items-center w-1/2">
          <Calendar className="w-3 h-3 mr-1" />
          <span>{challenge.start_date} - {challenge.end_date}</span>
        </div>
        {challenge.activity_name && (
          <div className="flex items-center w-1/2">
            <Dumbbell className="w-3 h-3 mr-1" />
            <span>{challenge.activity_name}</span>
          </div>
        )}
        {challenge.has_bet && challenge.bet_amount && (
          <div className="flex items-center w-full mt-1">
            <DollarSign className="w-3 h-3 mr-1 text-levelup-accent" />
            <span className={challenge.wasWinner ? "text-levelup-success" : "text-levelup-danger"}>
              {challenge.wasWinner 
                ? `Ganhou R$${(challenge.bet_amount * (challenge.participants - 1)).toFixed(2)}`
                : `Perdeu R$${challenge.bet_amount.toFixed(2)}`
              }
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleViewSummary}
          disabled={isLoading}
          className="flex-1"
        >
          Ver Resumo
        </Button>
        <ChallengeDetailsSheet challenge={challenge}>
          <Button variant="outline" size="sm" className="flex-1">
            Estatísticas
          </Button>
        </ChallengeDetailsSheet>
      </div>

      <ChallengeSummaryDialog
        isOpen={showSummary}
        onClose={() => setShowSummary(false)}
        challengeName={challenge.name}
        summary={summary}
        isWinner={isWinner}
        userPoints={userPoints}
      />
    </div>
  );
};

export default CompletedChallengeCard;
