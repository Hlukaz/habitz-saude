
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface BetInputProps {
  hasBet: boolean;
  betAmount: number | null;
  onHasBetChange: (hasBet: boolean) => void;
  onBetAmountChange: (amount: number | null) => void;
}

const BetInput = ({ hasBet, betAmount, onHasBetChange, onBetAmountChange }: BetInputProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          id="has-bet" 
          className="h-4 w-4 rounded border-gray-300 text-levelup-primary focus:ring-levelup-primary"
          checked={hasBet}
          onChange={(e) => onHasBetChange(e.target.checked)}
        />
        <Label htmlFor="has-bet" className="text-sm font-medium">Incluir aposta</Label>
      </div>

      {hasBet && (
        <div className="mt-3">
          <Label htmlFor="bet-amount" className="text-sm font-medium">Valor da Aposta (R$)</Label>
          <Input 
            id="bet-amount" 
            type="number" 
            placeholder="Digite o valor da aposta" 
            min="0" 
            step="0.01"
            value={betAmount || ''}
            onChange={(e) => onBetAmountChange(e.target.value ? parseFloat(e.target.value) : null)}
            className="mt-1"
          />
        </div>
      )}
    </div>
  );
};

export default BetInput;
