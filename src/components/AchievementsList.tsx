
import React from 'react';
import { Trophy, Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import AchievementsDialog from '@/components/AchievementsDialog';
import { Achievement } from '@/types/activityTypes';
import { ActivityTypePoints } from '@/types/activityTypes';
import { getIconComponent } from '@/components/achievements/achievementUtils';

interface AchievementsListProps {
  achievements: Achievement[];
  totalPoints: number;
  activityTypePoints: ActivityTypePoints[];
  className?: string;
}

const AchievementsList = ({
  achievements,
  totalPoints,
  activityTypePoints,
  className
}: AchievementsListProps) => {
  // Função para calcular o progresso baseado nos pontos individuais
  const calculateAchievementProgress = (achievement: Achievement) => {
    // Usar pontos individuais da conquista se disponível
    const currentPoints = achievement.current_points ?? (() => {
      // Para conquistas genéricas ou de categoria geral/streak, usar total de pontos
      if (achievement.is_generic || achievement.category === 'general' || achievement.category === 'streak') {
        return totalPoints;
      }

      // Para conquistas específicas de atividade, usar apenas os pontos da atividade específica
      if (achievement.category === 'activity' && achievement.activity_type_ids && achievement.activity_type_ids.length > 0) {
        return activityTypePoints.filter(atp => achievement.activity_type_ids!.includes(atp.activity_type_id)).reduce((sum, atp) => sum + atp.points, 0);
      }

      // Para outras categorias, usar total de pontos
      return totalPoints;
    })();
    return {
      progress: Math.min(100, currentPoints / achievement.required_points * 100),
      currentPoints,
      maxPoints: achievement.required_points
    };
  };

  // Verificar se a conquista está desbloqueada baseado no progresso calculado
  const isAchievementUnlocked = (achievement: Achievement) => {
    if (achievement.unlocked) return true;
    const { progress } = calculateAchievementProgress(achievement);
    return progress >= 100;
  };

  // Agrupar conquistas por status (desbloqueadas/bloqueadas)
  const unlockedAchievements = achievements.filter(a => isAchievementUnlocked(a));
  const lockedAchievements = achievements.filter(a => !isAchievementUnlocked(a));

  return (
    <div className={cn("bg-card rounded-xl p-5 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Conquistas</h3>
        <div className="flex items-center">
          <Trophy className="w-5 h-5 text-levelup-accent mr-1" />
          <span className="font-bold text-lg text-levelup-accent">
            {unlockedAchievements.length}
          </span>
          <span className="text-muted-foreground">/{achievements.length}</span>
        </div>
      </div>

      {/* Mostrar algumas conquistas desbloqueadas */}
      {unlockedAchievements.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Desbloqueadas</h4>
          <div className="grid grid-cols-3 gap-2">
            {unlockedAchievements.slice(0, 6).map((achievement) => {
              const IconComponent = getIconComponent(achievement.icon);
              return (
                <div
                  key={achievement.id}
                  className={cn(
                    "bg-levelup-light p-2 rounded-lg flex flex-col items-center text-center",
                    achievement.tier === 'gold' && "border border-yellow-400",
                    achievement.tier === 'silver' && "border border-gray-400",
                    achievement.tier === 'bronze' && "border border-amber-700"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                    achievement.tier === 'gold' && "bg-yellow-400 text-white",
                    achievement.tier === 'silver' && "bg-gray-400 text-white",
                    achievement.tier === 'bronze' && "bg-amber-700 text-white",
                    !achievement.tier && "bg-levelup-accent text-white"
                  )}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium truncate w-full">{achievement.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mostrar algumas conquistas bloqueadas com progresso */}
      {lockedAchievements.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Em progresso</h4>
          <div className="grid grid-cols-2 gap-2">
            {lockedAchievements.slice(0, 4).map((achievement) => {
              const IconComponent = getIconComponent(achievement.icon);
              const { progress, currentPoints, maxPoints } = calculateAchievementProgress(achievement);
              
              return (
                <div
                  key={achievement.id}
                  className="bg-levelup-light p-2 rounded-lg"
                >
                  <div className="flex items-center mb-2">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center mr-2",
                      achievement.tier === 'gold' && "bg-yellow-100 text-yellow-400",
                      achievement.tier === 'silver' && "bg-gray-100 text-gray-400",
                      achievement.tier === 'bronze' && "bg-amber-100 text-amber-700",
                      !achievement.tier && "bg-muted text-muted-foreground"
                    )}>
                      <IconComponent className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-medium truncate flex-1">{achievement.name}</span>
                  </div>
                  <div className="w-full bg-muted h-1 rounded-full overflow-hidden mb-1">
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
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{currentPoints}/{maxPoints}</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Botão para ver todas as conquistas */}
      <AchievementsDialog 
        achievements={achievements}
        totalPoints={totalPoints}
        activityTypePoints={activityTypePoints}
      />
    </div>
  );
};

export default AchievementsList;
