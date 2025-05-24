
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface CompetitiveChallengeConfigProps {
  targetPoints: number | null;
  onTargetPointsChange: (points: number | null) => void;
}

const CompetitiveChallengeConfig = ({ 
  targetPoints, 
  onTargetPointsChange 
}: CompetitiveChallengeConfigProps) => {
  const handleSliderChange = (value: number[]) => {
    onTargetPointsChange(value[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onTargetPointsChange(isNaN(value) ? null : value);
  };

  return (
    <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
        <Label className="text-sm font-medium text-orange-800">Configuração Competitiva</Label>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="target-points" className="text-sm font-medium">
          Meta de Pontos
        </Label>
        <div className="space-y-3">
          <Slider
            value={[targetPoints || 50]}
            onValueChange={handleSliderChange}
            max={500}
            min={10}
            step={10}
            className="w-full"
          />
          <div className="flex items-center space-x-2">
            <Input
              id="target-points"
              type="number"
              placeholder="Ex: 100"
              value={targetPoints || ''}
              onChange={handleInputChange}
              min="10"
              max="500"
              className="w-24 text-center"
            />
            <span className="text-sm text-muted-foreground">pontos</span>
          </div>
        </div>
        <p className="text-xs text-orange-700">
          Os participantes competirão para alcançar esta meta de pontos primeiro.
        </p>
      </div>
    </div>
  );
};

export default CompetitiveChallengeConfig;
