
import React, { useState } from 'react';
import { 
  Plus, 
  Trophy, 
  Users, 
  Calendar, 
  DollarSign, 
  Share2, 
  Clock, 
  Dumbbell,
  Check,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ActivityTypeSelect from '@/components/ActivityTypeSelect';
import { Separator } from '@/components/ui/separator';
import { useChallenges } from '@/hooks/useChallenges';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ChallengesPage = () => {
  const {
    activeChallenges,
    activeChallengesLoading,
    challengeInvites,
    challengeInvitesLoading,
    completedChallenges,
    completedChallengesLoading,
    challengeFormOpen,
    setChallengeFormOpen,
    newChallenge,
    setNewChallenge,
    handleCreateChallenge,
    acceptChallenge,
    declineChallenge,
    isCreatingChallenge,
    isAcceptingChallenge,
    isDecliningChallenge
  } = useChallenges();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM', { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  // Estado para controlar o diálogo de seleção de amigos
  const [friendsDialogOpen, setFriendsDialogOpen] = useState(false);
  
  // Mock de amigos para selecionar (substituir com dados reais depois)
  const mockFriends = [
    { id: 'friend-1', name: 'Ana Silva', avatar: 'https://source.unsplash.com/random/100x100/?woman' },
    { id: 'friend-2', name: 'Carlos Gomes', avatar: 'https://source.unsplash.com/random/100x100/?man' },
    { id: 'friend-3', name: 'Patricia Lima', avatar: 'https://source.unsplash.com/random/100x100/?woman,2' },
    { id: 'friend-4', name: 'Marcelo Costa', avatar: 'https://source.unsplash.com/random/100x100/?man,2' }
  ];

  // Estado para controlar quais amigos estão selecionados
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  // Função para alternar a seleção de um amigo
  const toggleFriendSelection = (friendId: string) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter(id => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };

  // Função para confirmar a seleção de amigos
  const confirmFriendSelection = () => {
    setNewChallenge({
      ...newChallenge,
      invitedFriends: selectedFriends
    });
    setFriendsDialogOpen(false);
  };

  return (
    <div className="pb-20">
      <header className="p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-levelup-dark">Desafios</h1>
        <Sheet open={challengeFormOpen} onOpenChange={setChallengeFormOpen}>
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
                <Input 
                  id="challenge-name" 
                  placeholder="Digite o nome do desafio" 
                  value={newChallenge.name}
                  onChange={(e) => setNewChallenge({...newChallenge, name: e.target.value})}
                />
              </div>
              
              <ActivityTypeSelect
                onSelect={(type) => setNewChallenge({...newChallenge, activity_type_id: type})}
                selectedActivityType={newChallenge.activity_type_id}
                className="w-full"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Data Início</Label>
                  <Input 
                    id="start-date" 
                    type="date" 
                    value={newChallenge.start_date}
                    onChange={(e) => setNewChallenge({...newChallenge, start_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">Data Fim</Label>
                  <Input 
                    id="end-date" 
                    type="date" 
                    value={newChallenge.end_date}
                    onChange={(e) => setNewChallenge({...newChallenge, end_date: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="has-bet" 
                  className="h-4 w-4"
                  checked={newChallenge.has_bet}
                  onChange={(e) => setNewChallenge({...newChallenge, has_bet: e.target.checked})}
                />
                <Label htmlFor="has-bet">Incluir aposta</Label>
              </div>

              {newChallenge.has_bet && (
                <div>
                  <Label htmlFor="bet-amount">Valor da Aposta</Label>
                  <Input 
                    id="bet-amount" 
                    type="number" 
                    placeholder="R$ 0,00" 
                    min="0" 
                    step="0.01"
                    value={newChallenge.bet_amount || ''}
                    onChange={(e) => setNewChallenge({...newChallenge, bet_amount: parseFloat(e.target.value) || null})}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Convidar Amigos</Label>
                <div className="flex gap-2">
                  <Dialog open={friendsDialogOpen} onOpenChange={setFriendsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Users className="w-4 h-4 mr-2" />
                        Selecionar Amigos
                        {selectedFriends.length > 0 && ` (${selectedFriends.length})`}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Selecionar Amigos</DialogTitle>
                        <DialogDescription>
                          Escolha os amigos que deseja convidar para o desafio.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        {mockFriends.map(friend => (
                          <div 
                            key={friend.id} 
                            className={cn(
                              "flex items-center p-3 rounded-md border",
                              selectedFriends.includes(friend.id) 
                                ? "border-levelup-primary bg-levelup-primary/10" 
                                : "border-gray-200"
                            )}
                            onClick={() => toggleFriendSelection(friend.id)}
                          >
                            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                              <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="flex-1">{friend.name}</span>
                            <div className={cn(
                              "w-5 h-5 rounded-full border flex items-center justify-center",
                              selectedFriends.includes(friend.id) 
                                ? "border-levelup-primary bg-levelup-primary text-white" 
                                : "border-gray-300"
                            )}>
                              {selectedFriends.includes(friend.id) && <Check className="w-3 h-3" />}
                            </div>
                          </div>
                        ))}
                        <Button 
                          className="w-full mt-4" 
                          onClick={confirmFriendSelection}
                        >
                          Confirmar ({selectedFriends.length} selecionados)
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={handleCreateChallenge} 
                disabled={isCreatingChallenge || !newChallenge.name}
              >
                {isCreatingChallenge ? 'Criando...' : 'Criar Desafio'}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>
      
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Desafios Ativos</h2>
        <div className="space-y-4">
          {activeChallengesLoading ? (
            <div className="p-4 text-center text-muted-foreground">Carregando...</div>
          ) : activeChallenges && activeChallenges.length > 0 ? (
            activeChallenges.map(challenge => (
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
            ))
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center text-muted-foreground">
              Você não possui desafios ativos. Participe de um desafio ou crie um novo!
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Lista de Desafios</h2>
        <div className="space-y-3">
          {challengeInvitesLoading ? (
            <div className="p-4 text-center text-muted-foreground">Carregando...</div>
          ) : challengeInvites && challengeInvites.length > 0 ? (
            challengeInvites.map(challenge => (
              <div 
                key={challenge.id} 
                className="bg-card p-4 rounded-lg shadow-sm border border-levelup-secondary/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{challenge.name}</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                      onClick={() => acceptChallenge(challenge.id)}
                      disabled={isAcceptingChallenge}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Aceitar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => declineChallenge(challenge.id)}
                      disabled={isDecliningChallenge}
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
              </div>
            ))
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center text-muted-foreground">
              Você não possui convites de desafios pendentes.
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4">
        <h2 className="text-lg font-bold mb-3">Desafios Concluídos</h2>
        <div className="space-y-3">
          {completedChallengesLoading ? (
            <div className="p-4 text-center text-muted-foreground">Carregando...</div>
          ) : completedChallenges && completedChallenges.length > 0 ? (
            completedChallenges.map(challenge => (
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
            ))
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center text-muted-foreground">
              Você ainda não concluiu nenhum desafio.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;
