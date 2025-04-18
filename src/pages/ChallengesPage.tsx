import React from 'react';
import { Plus, Trophy, Users, Calendar, DollarSign, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ActivityTypeSelect from '@/components/ActivityTypeSelect';
import { Separator } from '@/components/ui/separator';

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
  const [newChallengeActivityType, setNewChallengeActivityType] = React.useState<string | null>(null);

  const availableChallenges = [
    {
      id: 'challenge-invite-1',
      name: 'Corrida da Semana',
      creator: 'João Silva',
      participants: 2,
      startDate: '20 Abr',
      endDate: '27 Abr',
      hasBet: true,
      betAmount: 15
    },
    {
      id: 'challenge-invite-2',
      name: 'Yoga Matinal',
      creator: 'Maria Santos',
      participants: 4,
      startDate: '22 Abr',
      endDate: '29 Abr',
      hasBet: false
    }
  ];

  return (
    <div className="pb-20">
      <header className="p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-levelup-dark">Desafios</h1>
        <Sheet>
          <SheetTrigger asChild>
            <button className="w-10 h-10 bg-levelup-primary rounded-full flex items-center justify-center text-white shadow-md">
              <Plus className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Criar Novo Desafio</SheetTitle>
              <SheetDescription>
                Configure as regras do seu desafio e convide amigos para participar.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="challenge-name">Nome do Desafio</Label>
                <Input id="challenge-name" placeholder="Digite o nome do desafio" />
              </div>
              
              <ActivityTypeSelect
                onSelect={setNewChallengeActivityType}
                selectedActivityType={newChallengeActivityType}
                className="w-full"
              />

              <div>
                <Label htmlFor="bet-amount">Valor da Aposta (opcional)</Label>
                <Input 
                  id="bet-amount" 
                  type="number" 
                  placeholder="R$ 0,00" 
                  min="0" 
                  step="0.01" 
                />
              </div>

              <div className="space-y-2">
                <Label>Convidar Amigos</Label>
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Selecionar Amigos
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button className="w-full">Criar Desafio</Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>
      
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
      
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Lista de Desafios</h2>
        <div className="space-y-3">
          {availableChallenges.map(challenge => (
            <div 
              key={challenge.id} 
              className="bg-card p-4 rounded-lg shadow-sm border border-levelup-secondary/20"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{challenge.name}</h3>
                <Button variant="outline" size="sm">
                  Participar
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>Criado por {challenge.creator}</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{challenge.startDate} - {challenge.endDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{challenge.participants} participantes</span>
                  </div>
                  {challenge.hasBet && (
                    <div className="flex items-center gap-1 text-levelup-accent">
                      <DollarSign className="w-3 h-3" />
                      <span>R${challenge.betAmount}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
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
