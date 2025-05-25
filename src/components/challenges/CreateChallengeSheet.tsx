
import React from 'react';
import { Plus, Play } from 'lucide-react';
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
import { ScrollArea } from "@/components/ui/scroll-area";
import ActivityTypeSelect from '@/components/ActivityTypeSelect';
import ChallengeTypeSelector from '@/components/form/ChallengeTypeSelector';
import DateRangeSelector from '@/components/form/DateRangeSelector';
import BetInput from '@/components/form/BetInput';
import FriendSelector from '@/components/form/FriendSelector';
import CompetitiveChallengeConfig from '@/components/form/CompetitiveChallengeConfig';

interface CreateChallengeSheetProps {
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
    target_points?: number | null;
  };
  onChallengeChange: (challenge: any) => void;
  onCreateChallenge: () => void;
  isCreatingChallenge: boolean;
}

const CreateChallengeSheet = ({
  open,
  onOpenChange,
  newChallenge,
  onChallengeChange,
  onCreateChallenge,
  isCreatingChallenge
}: CreateChallengeSheetProps) => {
  const isFormValid = newChallenge.name.trim() !== '' && 
                     newChallenge.activity_type_id !== null &&
                     (!newChallenge.has_bet || newChallenge.bet_amount !== null) &&
                     (!newChallenge.is_habit_forming || newChallenge.target_points !== null);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <button className="w-10 h-10 bg-levelup-primary rounded-full flex items-center justify-center text-white shadow-md hover:bg-levelup-primary/90 transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="pb-4 flex-shrink-0">
          <SheetTitle className="text-lg font-bold">Criar Novo Desafio</SheetTitle>
          <SheetDescription className="text-sm">
            Configure as regras do seu desafio e convide amigos para participar.
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-5 pb-4">
              <div>
                <Label htmlFor="challenge-name" className="text-sm font-medium">Nome do Desafio</Label>
                <Input 
                  id="challenge-name" 
                  placeholder="Digite o nome do desafio" 
                  value={newChallenge.name}
                  onChange={(e) => onChallengeChange({...newChallenge, name: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <ChallengeTypeSelector
                isHabitForming={newChallenge.is_habit_forming}
                onChange={(isHabitForming) => onChallengeChange({...newChallenge, is_habit_forming: isHabitForming})}
              />

              <div>
                <Label className="text-sm font-medium">Tipo de Atividade</Label>
                <ActivityTypeSelect
                  onSelect={(type) => onChallengeChange({...newChallenge, activity_type_id: type})}
                  selectedActivityType={newChallenge.activity_type_id}
                  className="w-full mt-1"
                  filterHabitForming={newChallenge.is_habit_forming}
                />
              </div>

              <DateRangeSelector
                startDate={newChallenge.start_date}
                endDate={newChallenge.end_date}
                onStartDateChange={(date) => onChallengeChange({...newChallenge, start_date: date})}
                onEndDateChange={(date) => onChallengeChange({...newChallenge, end_date: date})}
              />

              {!newChallenge.is_habit_forming && (
                <CompetitiveChallengeConfig
                  targetPoints={newChallenge.target_points || null}
                  onTargetPointsChange={(points) => onChallengeChange({...newChallenge, target_points: points})}
                />
              )}

              <BetInput
                hasBet={newChallenge.has_bet}
                betAmount={newChallenge.bet_amount}
                onHasBetChange={(hasBet) => onChallengeChange({...newChallenge, has_bet: hasBet})}
                onBetAmountChange={(amount) => onChallengeChange({...newChallenge, bet_amount: amount})}
              />

              <FriendSelector
                selectedFriends={newChallenge.invitedFriends}
                onFriendsChange={(friends) => onChallengeChange({...newChallenge, invitedFriends: friends})}
              />
            </div>
          </ScrollArea>
        </div>

        <div className="pt-4 border-t space-y-3 flex-shrink-0">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Resumo do Desafio</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p><span className="font-medium">Nome:</span> {newChallenge.name || 'Não definido'}</p>
              <p><span className="font-medium">Tipo:</span> {newChallenge.is_habit_forming ? 'Formação de Hábito' : 'Competitivo'}</p>
              <p><span className="font-medium">Período:</span> {newChallenge.start_date} até {newChallenge.end_date}</p>
              {newChallenge.has_bet && newChallenge.bet_amount && (
                <p><span className="font-medium">Aposta:</span> R$ {newChallenge.bet_amount}</p>
              )}
              {newChallenge.invitedFriends.length > 0 && (
                <p><span className="font-medium">Convidados:</span> {newChallenge.invitedFriends.length} amigo(s)</p>
              )}
            </div>
          </div>
          
          <Button 
            className="w-full text-sm py-3 bg-levelup-primary hover:bg-levelup-primary/90" 
            onClick={onCreateChallenge} 
            disabled={isCreatingChallenge || !isFormValid}
          >
            <Play className="w-4 h-4 mr-2" />
            {isCreatingChallenge ? 'Criando Desafio...' : 'Iniciar Desafio'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateChallengeSheet;
