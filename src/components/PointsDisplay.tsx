
import React from 'react';
import { StarIcon, TrophyIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PointsDisplayProps {
  activityPoints: number;
  nutritionPoints: number;
  totalPoints: number;
  maxWeeklyPoints?: number;
  className?: string;
}

const PointsDisplay = ({
  activityPoints,
  nutritionPoints,
  totalPoints,
  maxWeeklyPoints = 10,
  className
}: PointsDisplayProps) => {
  const progress = (totalPoints / maxWeeklyPoints) * 100;
  
  return (
    <div className={cn("p-4 rounded-xl bg-card text-card-foreground shadow-sm", className)}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold">Seus Pontos da Semana</h3>
        <div className="flex items-center">
          <TrophyIcon className="w-5 h-5 text-levelup-accent mr-1" />
          <span className="font-bold text-lg text-levelup-accent">{totalPoints}</span>
          <span className="text-muted-foreground">/{maxWeeklyPoints}</span>
        </div>
      </div>
      
      <div className="levelup-progress mb-4">
        <div 
          className="levelup-progress-bar" 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-levelup-light p-3 rounded-lg flex items-center">
          <div className="w-10 h-10 bg-levelup-primary rounded-full flex items-center justify-center mr-3">
            <StarIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Atividade Física</p>
            <p className="font-bold">{activityPoints} pontos</p>
          </div>
        </div>
        
        <div className="bg-levelup-light p-3 rounded-lg flex items-center">
          <div className="w-10 h-10 bg-levelup-secondary rounded-full flex items-center justify-center mr-3">
            <StarIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Alimentação</p>
            <p className="font-bold">{nutritionPoints} pontos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsDisplay;
