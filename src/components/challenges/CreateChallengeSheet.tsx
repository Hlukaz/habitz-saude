
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
import ActivityTypeSelect from '@/components/ActivityTypeSelect';
import ChallengeTypeSelector from './form/ChallengeTypeSelector';
import DateRangeSelector from './form/DateRangeSelector';
import BetInput from './form/BetInput';
import FriendSelector from './form/FriendSelector';

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
          
          <ChallengeTypeSelector
            isHabitForming={newChallenge.is_habit_forming}
            onChange={(isHabitForming) => onChallengeChange({...newChallenge, is_habit_forming})}
          />

          <ActivityTypeSelect
            onSelect={(type) => onChallengeChange({...newChallenge, activity_type_id: type})}
            selectedActivityType={newChallenge.activity_type_id}
            className="w-full"
            filterHabitForming={newChallenge.is_habit_forming}
          />

          <DateRangeSelector
            startDate={newChallenge.start_date}
            endDate={newChallenge.end_date}
            onStartDateChange={(date) => onChallengeChange({...newChallenge, start_date: date})}
            onEndDateChange={(date) => onChallengeChange({...newChallenge, end_date: date})}
          />

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
