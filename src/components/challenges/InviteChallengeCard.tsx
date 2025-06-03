
import React from 'react';
import { Check, X, Users, Calendar, DollarSign, Dumbbell } from 'lucide-react';
import { ChallengeWithDetails } from '@/hooks/useChallenges';
import { Button } from '@/components/ui/button';
import ChallengeDetailsSheet from './ChallengeDetailsSheet';

interface InviteChallengeCardProps {
  challenge: ChallengeWithDetails;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  isAccepting?: boolean;
  isDeclining?: boolean;
}

const InviteChallengeCard = ({ 
  challenge, 
  onAccept, 
  onDecline, 
  isAccepting, 
  isDeclining 
}: InviteChallengeCardProps) => {
  return (
    <div className="bg-card p-4 rounded-lg shadow-sm border border-levelup-secondary/20">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{challenge.name}</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
            onClick={() => onAccept?.(challenge.id)}
            disabled={isAccepting}
          >
            <Check className="w-4 h-4 mr-1" />
            Aceitar
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            onClick={() => onDecline?.(challenge.id)}
            disabled={isDeclining}
          >
            <X className="w-4 h-4 mr-1" />
            Recusar
          </Button>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground space-y-1">
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>Criado por {challenge.creator_name}</span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{challenge.start_date} - {challenge.end_date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{challenge.participants} participantes</span>
          </div>
          {challenge.activity_name && (
            <div className="flex items-center gap-1">
              <Dumbbell className="w-3 h-3" />
              <span>{challenge.activity_name}</span>
            </div>
          )}
          {challenge.has_bet && challenge.bet_amount && (
            <div className="flex items-center gap-1 text-levelup-accent">
              <DollarSign className="w-3 h-3" />
              <span>R${challenge.bet_amount}</span>
            </div>
          )}
        </div>
      </div>

      <ChallengeDetailsSheet challenge={challenge}>
        <Button variant="outline" className="w-full mt-3 text-sm">
          Ver Detalhes do Desafio
        </Button>
      </ChallengeDetailsSheet>
    </div>
  );
};

export default InviteChallengeCard;
