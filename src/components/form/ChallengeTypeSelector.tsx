
import React from 'react';
import { Check, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type ChallengeType = 'habit' | 'competitive';

interface ChallengeTypeSelectorProps {
  isHabitForming: boolean;
  onChange: (isHabitForming: boolean) => void;
}

const ChallengeTypeSelector = ({ isHabitForming, onChange }: ChallengeTypeSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Tipo de Desafio</Label>
      <div className="grid grid-cols-1 gap-3">
        <Button 
          variant={isHabitForming ? 'default' : 'outline'}
          onClick={() => onChange(true)}
          className="h-auto p-4 justify-start text-left"
        >
          <div className="flex items-center w-full">
            <Zap className="w-5 h-5 mr-3 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">Formação de Hábito</div>
              <div className="text-xs opacity-80 mt-1">
                Ideal para iniciantes. Foco em criar hábitos saudáveis de exercício e alimentação.
              </div>
            </div>
            {isHabitForming && <Check className="ml-2 w-4 h-4 flex-shrink-0" />}
          </div>
        </Button>
        
        <Button 
          variant={!isHabitForming ? 'default' : 'outline'}
          onClick={() => onChange(false)}
          className="h-auto p-4 justify-start text-left"
        >
          <div className="flex items-center w-full">
            <Target className="w-5 h-5 mr-3 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">Desafio Competitivo</div>
              <div className="text-xs opacity-80 mt-1">
                Para usuários experientes. Competição por pontos em prazo determinado.
              </div>
            </div>
            {!isHabitForming && <Check className="ml-2 w-4 h-4 flex-shrink-0" />}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default ChallengeTypeSelector;
