
import React from 'react';
import { Trophy, Users, Calendar, DollarSign, Dumbbell, Check, X } from 'lucide-react';
import { ChallengeWithDetails } from '@/hooks/useChallenges';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  const renderContent = () => {
    switch (variant) {
      case 'active':
        return (
          <div className="bg-card rounded-lg shadow-sm overflow-hidden">
            <div className="bg-levelup-primary text-white p-3 flex items-center justify-between">
              <h3 className="font-bold">{challenge.name}</h3>
              <Trophy className="w-5 h-5" />
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
              
              <button className="w-full py-2 bg-levelup-secondary text-white rounded-lg text-sm font-medium mt-2">
                Ver Detalhes
              </button>
            </div>
          </div>
        );

      case 'invite':
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
                  <div className="flex items-center gap-1 text

-levelup-accent">
                    <DollarSign className="w-3 h-3" />
                    <span>R${challenge.bet_amount}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'completed':
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
          </div>
        );
    }
  };

  return renderContent();
};

export default ChallengeCard;
