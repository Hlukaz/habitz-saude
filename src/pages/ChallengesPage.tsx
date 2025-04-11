
import React from 'react';
import { Plus, Trophy, Users, Calendar, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for demonstration
const mockActiveChallenges = [
  {
    id: 'challenge-1',
    name: 'Desafio de Abril',
    participants: 5,
    startDate: '10 Abr',
    endDate: '30 Abr',
    hasBet: true,
    betAmount: 20,
    progress: 40
  },
  {
    id: 'challenge-2',
    name: 'Fim de Semana Saudável',
    participants: 3,
    startDate: '15 Abr',
    endDate: '17 Abr',
    hasBet: false,
    progress: 60
  }
];

const mockCompletedChallenges = [
  {
    id: 'challenge-3',
    name: 'Março em Movimento',
    participants: 4,
    startDate: '01 Mar',
    endDate: '31 Mar',
    hasBet: true,
    betAmount: 30,
    wasWinner: true
  },
  {
    id: 'challenge-4',
    name: 'Semana de Exercícios',
    participants: 3,
    startDate: '20 Mar',
    endDate: '26 Mar',
    hasBet: false,
    wasWinner: false
  }
];

const ChallengesPage = () => {
  return (
    <div className="pb-20">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-levelup-dark">Desafios</h1>
        <button className="w-10 h-10 bg-levelup-primary rounded-full flex items-center justify-center text-white shadow-md">
          <Plus className="w-5 h-5" />
        </button>
      </header>
      
      {/* Active Challenges */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Desafios Ativos</h2>
        <div className="space-y-4">
          {mockActiveChallenges.map(challenge => (
            <div key={challenge.id} className="bg-card rounded-lg shadow-sm overflow-hidden">
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
                    <span className="text-sm">{challenge.startDate} - {challenge.endDate}</span>
                  </div>
                  {challenge.hasBet && (
                    <div className="flex items-center w-1/2">
                      <DollarSign className="w-4 h-4 text-levelup-accent mr-1" />
                      <span className="text-sm">Aposta: R${challenge.betAmount}</span>
                    </div>
                  )}
                </div>
                
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Progresso</span>
                    <span className="text-sm font-medium">{challenge.progress}%</span>
                  </div>
                  <div className="levelup-progress">
                    <div 
                      className="levelup-progress-bar" 
                      style={{ width: `${challenge.progress}%` }}
                    />
                  </div>
                </div>
                
                <button className="w-full py-2 bg-levelup-secondary text-white rounded-lg text-sm font-medium mt-2">
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Completed Challenges */}
      <div className="px-4">
        <h2 className="text-lg font-bold mb-3">Desafios Concluídos</h2>
        <div className="space-y-3">
          {mockCompletedChallenges.map(challenge => (
            <div 
              key={challenge.id}
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
                  <span>{challenge.startDate} - {challenge.endDate}</span>
                </div>
                {challenge.hasBet && (
                  <div className="flex items-center w-full mt-1">
                    <DollarSign className="w-3 h-3 mr-1 text-levelup-accent" />
                    <span className={challenge.wasWinner ? "text-levelup-success" : "text-levelup-danger"}>
                      {challenge.wasWinner 
                        ? `Ganhou R$${challenge.betAmount * (challenge.participants - 1)}`
                        : `Perdeu R$${challenge.betAmount}`
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;
