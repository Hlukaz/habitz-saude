
import React from 'react';
import { cn } from '@/lib/utils';
import { Achievement, ActivityTypePoints } from '@/types/activityTypes';
import { getIconComponent } from './achievementUtils';

interface AchievementItemProps {
  achievement: Achievement;
  totalPoints: number;
  activityTypePoints: ActivityTypePoints[];
}

export const AchievementItem: React.FC<AchievementItemProps> = ({ 
  achievement, 
  totalPoints,
  activityTypePoints = []
}) => {
  const IconComponent = getIconComponent(achievement.icon);
  
  // Usar pontos individuais da conquista se disponível, senão calcular baseado no tipo
  const currentPoints = achievement.current_points ?? (() => {
    // Para conquistas genéricas ou de categoria geral/streak, usar total de pontos
    if (achievement.is_generic || achievement.category === 'general' || achievement.category === 'streak') {
      return totalPoints;
    }

    // Para conquistas específicas de atividade, usar apenas os pontos da atividade específica
    if (achievement.category === 'activity' && achievement.activity_type_ids && achievement.activity_type_ids.length > 0) {
      return activityTypePoints
        .filter(atp => achievement.activity_type_ids!.includes(atp.activity_type_id))
        .reduce((sum, atp) => sum + atp.points, 0);
    }

    // Para outras categorias, usar total de pontos
    return totalPoints;
  })();

  const progress = Math.min(100, (currentPoints / achievement.required_points) * 100);
  const isUnlocked = achievement.unlocked || progress >= 100;

  return (
    <div
      className={cn(
        "bg-card p-3 rounded-lg shadow-sm flex flex-col items-center text-center transition-all",
        !isUnlocked && "opacity-70",
        achievement.tier === 'gold' && isUnlocked && "border-2 border-yellow-400",
        achievement.tier === 'silver' && isUnlocked && "border-2 border-gray-400",
        achievement.tier === 'bronze' && isUnlocked && "border-2 border-amber-700",
        achievement.tier === 'gold' && !isUnlocked && "border border-yellow-400",
        achievement.tier === 'silver' && !isUnlocked && "border border-gray-400",
        achievement.tier === 'bronze' && !isUnlocked && "border border-amber-700"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center mb-2",
        isUnlocked && achievement.tier === 'gold' && "bg-yellow-400 text-white",
        isUnlocked && achievement.tier === 'silver' && "bg-gray-400 text-white",
        isUnlocked && achievement.tier === 'bronze' && "bg-amber-700 text-white",
        isUnlocked && !achievement.tier && "bg-levelup-accent text-white",
        !isUnlocked && achievement.tier === 'gold' && "bg-yellow-100 text-yellow-400",
        !isUnlocked && achievement.tier === 'silver' && "bg-gray-100 text-gray-400",
        !isUnlocked && achievement.tier === 'bronze' && "bg-amber-100 text-amber-700",
        !isUnlocked && !achievement.tier && "bg-muted text-muted-foreground"
      )}>
        <IconComponent className="w-6 h-6" />
      </div>
      
      <h3 className="font-medium text-sm mb-1">{achievement.name}</h3>
      <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
      
      {isUnlocked && achievement.unlocked_at && (
        <span className="text-xs text-levelup-accent">
          Desbloqueado em {new Date(achievement.unlocked_at).toLocaleDateString()}
        </span>
      )}
      
      {!isUnlocked && (
        <div className="w-full mt-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span>Progresso</span>
            <span>{currentPoints}/{achievement.required_points} pontos</span>
          </div>
          <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all",
                achievement.tier === 'gold' && "bg-yellow-400",
                achievement.tier === 'silver' && "bg-gray-400",
                achievement.tier === 'bronze' && "bg-amber-700",
                !achievement.tier && "bg-levelup-accent"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
