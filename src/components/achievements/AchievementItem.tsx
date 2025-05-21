
import React from 'react';
import { cn } from '@/lib/utils';
import { Achievement } from '@/types/activityTypes';
import { Progress } from '@/components/ui/progress';
import { getIconComponent } from './achievementUtils';

interface AchievementItemProps {
  achievement: Achievement;
  totalPoints: number;
}

export const AchievementItem: React.FC<AchievementItemProps> = ({ achievement, totalPoints }) => {
  const IconComponent = getIconComponent(achievement.icon);
  const isUnlocked = achievement.unlocked;
  
  // Limitar o progresso para exibir no máximo os pontos necessários
  const effectivePoints = Math.min(totalPoints, achievement.required_points);
  const progress = Math.min(100, (effectivePoints / achievement.required_points) * 100);
  
  return (
    <div className={cn(
      "flex flex-col p-3 rounded-xl border", 
      isUnlocked ? "bg-levelup-light border-levelup-accent" : "bg-card border-muted"
    )}>
      <div className="flex items-center gap-3 mb-2">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          isUnlocked ? "bg-levelup-accent text-white" : "bg-muted text-muted-foreground",
          achievement.tier === 'gold' && isUnlocked && "bg-yellow-400",
          achievement.tier === 'silver' && isUnlocked && "bg-gray-400",
          achievement.tier === 'bronze' && isUnlocked && "bg-amber-700"
        )}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{achievement.name}</h3>
          <p className="text-xs text-muted-foreground">{achievement.description}</p>
        </div>
      </div>
      
      {!isUnlocked && (
        <div className="mt-1">
          <div className="flex items-center justify-between text-xs mb-1">
            <span>Progresso</span>
            <span>{effectivePoints}/{achievement.required_points} pontos</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      )}
      
      {isUnlocked && achievement.unlocked_at && (
        <p className="text-xs text-levelup-accent mt-1">
          Desbloqueado em {new Date(achievement.unlocked_at).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};
