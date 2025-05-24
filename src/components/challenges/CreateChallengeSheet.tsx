
import React from 'react';
import { Plus } from 'lucide-react';
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
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <button className="w-10 h-10 bg-levelup-primary rounded-full flex items-center justify-center text-white shadow-md hover:bg-levelup-primary/90 transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-lg font-bold">Criar Novo Desafio</SheetTitle>
          <SheetDescription className="text-sm">
            Configure as regras do seu desafio e convide amigos para participar.
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-140px)] pr-4">
          <div className="space-y-5">
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

        <div className="pt-4 border-t mt-4">
          <Button 
            className="w-full text-sm py-2" 
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
