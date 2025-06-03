
import React from 'react';
import { Trophy, Users, Calendar, DollarSign, Dumbbell, Star, Zap } from 'lucide-react';
import { ChallengeWithDetails } from '@/hooks/useChallenges';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ChallengeDetailsSheet from './ChallengeDetailsSheet';

interface ActiveChallengeCardProps {
  challenge: ChallengeWithDetails;
}

const ActiveChallengeCard = ({ challenge }: ActiveChallengeCardProps) => {
  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden">
      <div className="bg-levelup-primary text-white p-3 flex items-center justify-between">
        <h3 className="font-bold">{challenge.name}</h3>
        <div className="flex items-center gap-2">
          {challenge.point_multiplier && challenge.point_multiplier > 1 && (
            <Badge className="bg-yellow-500 text-white">
              <Zap className="w-3 h-3 mr-1" />
              {challenge.point_multiplier}x
            </Badge>
          )}
          <Trophy className="w-5 h-5" />
        </div>
      </div>
      
      <div className="p-3">
        <div className="flex flex-wrap gap-y-2 mb-3">
          <div className="flex items-center w-1/2">
            <Users className="w-4 h-4 text-muted-foreground mr-1" />
            <span className="text-sm">{challenge.participants} participantes</span>
          </div>
          <div className="flex items-center w-1/2">
            <Calendar className="w-4 h-4 text-muted-foreground mr-1" />
            <span className="text-sm">{challenge.start_date} - {challenge.end_date}</span>
          </div>
          {challenge.activity_name && (
            <div className="flex items-center w-1/2">
              <Dumbbell className="w-4 h-4 text-muted-foreground mr-1" />
              <span className="text-sm">{challenge.activity_name}</span>
            </div>
          )}
          {challenge.has_bet && challenge.bet_amount && (
            <div className="flex items-center w-1/2">
              <DollarSign className="w-4 h-4 text-levelup-accent mr-1" />
              <span className="text-sm">Aposta: R${challenge.bet_amount}</span>
            </div>
          )}
        </div>

        {challenge.rewards && (
          <div className="mb-3">
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span className="text-xs text-muted-foreground">Recompensas disponíveis</span>
            </div>
          </div>
        )}
        
        {typeof challenge.progress === 'number' && (
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Progresso</span>
              <span className="text-sm font-medium">{challenge.progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-levelup-primary rounded-full" 
                style={{ width: `${challenge.progress}%` }}
              />
            </div>
          </div>
        )}
        
        <ChallengeDetailsSheet challenge={challenge}>
          <Button className="w-full py-2 bg-levelup-secondary text-white rounded-lg text-sm font-medium mt-2">
            Ver Detalhes
          </Button>
        </ChallengeDetailsSheet>
      </div>
    </div>
  );
};

export default ActiveChallengeCard;
