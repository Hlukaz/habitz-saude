
import React from 'react';
import { Trophy, Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  required_points: number;
  unlocked: boolean;
  unlocked_at?: string;
};

interface AchievementsListProps {
  achievements: Achievement[];
  totalPoints: number;
  className?: string;
}

const getIconComponent = (iconName: string) => {
  // Podemos adicionar mais ícones conforme necessário
  switch (iconName) {
    case 'trophy': return Trophy;
    case 'award': return Trophy;
    case 'award-star': return Trophy;
    default: return Trophy;
  }
};

const AchievementsList = ({ achievements, totalPoints, className }: AchievementsListProps) => {
  // Agrupar conquistas por status (desbloqueadas/bloqueadas)
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold">Conquistas</h2>
        <Badge variant="outline" className="bg-levelup-light">
          {unlockedAchievements.length}/{achievements.length}
        </Badge>
      </div>
      
      {unlockedAchievements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-levelup-accent flex items-center">
            <Check className="w-4 h-4 mr-1" /> Desbloqueadas
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {unlockedAchievements.map(achievement => {
              const IconComponent = getIconComponent(achievement.icon);
              return (
                <div
                  key={achievement.id}
                  className="bg-card p-3 rounded-lg shadow-sm flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-levelup-accent text-white flex items-center justify-center mb-2">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-medium text-sm mb-1">{achievement.name}</h3>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  {achievement.unlocked_at && (
                    <span className="mt-2 text-xs text-levelup-accent">
                      Desbloqueado em {new Date(achievement.unlocked_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {lockedAchievements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center">
            <Lock className="w-4 h-4 mr-1" /> A desbloquear
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {lockedAchievements.map(achievement => {
              const IconComponent = getIconComponent(achievement.icon);
              const progress = Math.min(100, (totalPoints / achievement.required_points) * 100);
              
              return (
                <div
                  key={achievement.id}
                  className="bg-card p-3 rounded-lg shadow-sm flex flex-col items-center text-center opacity-70"
                >
                  <div className="w-12 h-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center mb-2">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-medium text-sm mb-1">{achievement.name}</h3>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  <div className="w-full mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Progresso</span>
                      <span>{totalPoints}/{achievement.required_points} pontos</span>
                    </div>
                    <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-levelup-accent h-full rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsList;
