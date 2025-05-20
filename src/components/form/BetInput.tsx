
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
    <>
      <div className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          id="has-bet" 
          className="h-4 w-4"
          checked={hasBet}
          onChange={(e) => onHasBetChange(e.target.checked)}
        />
        <Label htmlFor="has-bet">Incluir aposta</Label>
      </div>

      {hasBet && (
        <div>
          <Label htmlFor="bet-amount">Valor da Aposta</Label>
          <Input 
            id="bet-amount" 
            type="number" 
            placeholder="R$ 0,00" 
            min="0" 
            step="0.01"
            value={betAmount || ''}
            onChange={(e) => onBetAmountChange(parseFloat(e.target.value) || null)}
          />
        </div>
      )}
    </>
  );
};

export default BetInput;
