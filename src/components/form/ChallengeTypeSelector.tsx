
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChallengeTypeSelectorProps {
  isHabitForming: boolean;
  onChange: (isHabitForming: boolean) => void;
}

const ChallengeTypeSelector = ({ isHabitForming, onChange }: ChallengeTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Tipo de Desafio</Label>
      <ScrollArea className="h-40 w-full">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant={isHabitForming ? 'default' : 'outline'}
            onClick={() => onChange(true)}
          >
            Formação de Hábito
            {isHabitForming && <Check className="ml-2 w-4 h-4" />}
          </Button>
          <Button 
            variant={!isHabitForming ? 'default' : 'outline'}
            onClick={() => onChange(false)}
          >
            Desafio Pontual
            {!isHabitForming && <Check className="ml-2 w-4 h-4" />}
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChallengeTypeSelector;
