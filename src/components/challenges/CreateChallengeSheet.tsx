import React from 'react';
import { Plus, Users, Share2, Check } from 'lucide-react'; // Added Check import
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
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area'; // Import ScrollArea

type Friend = {
  id: string;
  name: string;
  avatar: string;
};

type CreateChallengeSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newChallenge: {
    name: string;
    activity_type_id: string | null;
    start_date: string;
    end_date: string;
    has_bet: boolean;
    bet_amount: number | null;
    is_habit_forming: boolean;
    invitedFriends: string[];
  };
  onChallengeChange: (challenge: any) => void;
  onCreateChallenge: () => void;
  isCreatingChallenge: boolean;
};

const CreateChallengeSheet = ({
  open,
  onOpenChange,
  newChallenge,
  onChallengeChange,
  onCreateChallenge,
  isCreatingChallenge
}: CreateChallengeSheetProps) => {
  const [friendsDialogOpen, setFriendsDialogOpen] = React.useState(false);
  const [selectedFriends, setSelectedFriends] = React.useState<string[]>(newChallenge.invitedFriends);

  // Mock friends (you would fetch this from your backend in a real app)
  const mockFriends = [
    { id: 'friend-1', name: 'Ana Silva', avatar: 'https://source.unsplash.com/random/100x100/?woman' },
    { id: 'friend-2', name: 'Carlos Gomes', avatar: 'https://source.unsplash.com/random/100x100/?man' },
    { id: 'friend-3', name: 'Patricia Lima', avatar: 'https://source.unsplash.com/random/100x100/?woman,2' },
    { id: 'friend-4', name: 'Marcelo Costa', avatar: 'https://source.unsplash.com/random/100x100/?man,2' }
  ];

  const toggleFriendSelection = (friendId: string) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter(id => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };

  const confirmFriendSelection = () => {
    onChallengeChange({
      ...newChallenge,
      invitedFriends: selectedFriends
    });
    setFriendsDialogOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
              onChange={(e) => onChallengeChange({...newChallenge, name: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Tipo de Desafio</Label>
            <ScrollArea className="h-40 w-full">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={newChallenge.is_habit_forming ? 'default' : 'outline'}
                  onClick={() => onChallengeChange({...newChallenge, is_habit_forming: true})}
                >
                  Formação de Hábito
                  {newChallenge.is_habit_forming && <Check className="ml-2 w-4 h-4" />}
                </Button>
                <Button 
                  variant={!newChallenge.is_habit_forming ? 'default' : 'outline'}
                  onClick={() => onChallengeChange({...newChallenge, is_habit_forming: false})}
                >
                  Desafio Pontual
                  {!newChallenge.is_habit_forming && <Check className="ml-2 w-4 h-4" />}
                </Button>
              </div>
            </ScrollArea>
          </div>

          <ActivityTypeSelect
            onSelect={(type) => onChallengeChange({...newChallenge, activity_type_id: type})}
            selectedActivityType={newChallenge.activity_type_id}
            className="w-full"
            filterHabitForming={newChallenge.is_habit_forming}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date">Data Início</Label>
              <Input 
                id="start-date" 
                type="date" 
                value={newChallenge.start_date}
                onChange={(e) => onChallengeChange({...newChallenge, start_date: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="end-date">Data Fim</Label>
              <Input 
                id="end-date" 
                type="date" 
                value={newChallenge.end_date}
                onChange={(e) => onChallengeChange({...newChallenge, end_date: e.target.value})}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="has-bet" 
              className="h-4 w-4"
              checked={newChallenge.has_bet}
              onChange={(e) => onChallengeChange({...newChallenge, has_bet: e.target.checked})}
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
                onChange={(e) => onChallengeChange({
                  ...newChallenge, 
                  bet_amount: parseFloat(e.target.value) || null
                })}
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
                          "flex items-center p-3 rounded-md border cursor-pointer",
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
            onClick={onCreateChallenge} 
            disabled={isCreatingChallenge || !newChallenge.name}
          >
            {isCreatingChallenge ? 'Criando...' : 'Criar Desafio'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateChallengeSheet;
