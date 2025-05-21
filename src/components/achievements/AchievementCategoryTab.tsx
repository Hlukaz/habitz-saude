
import React from 'react';
import { Achievement } from '@/types/activityTypes';
import { AchievementItem } from './AchievementItem';
import { AchievementCategoryType } from './achievementUtils';

interface AchievementCategoryTabProps {
  achievements: Achievement[];
  totalPoints: number;
  category: AchievementCategoryType;
}

export const AchievementCategoryTab: React.FC<AchievementCategoryTabProps> = ({ 
  achievements,
  totalPoints,
  category
}) => {
  // Separar as conquistas por níveis
  const bronzeAchievements = achievements.filter(a => a.tier === 'bronze');
  const silverAchievements = achievements.filter(a => a.tier === 'silver');
  const goldAchievements = achievements.filter(a => a.tier === 'gold');
  const otherAchievements = achievements.filter(a => !a.tier);
  
  return (
    <div className="space-y-6 overflow-y-auto max-h-[50vh]">
      {/* Conquistas Ouro */}
      {goldAchievements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-yellow-400">Nível Ouro</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {goldAchievements.map(achievement => (
              <AchievementItem 
                key={achievement.id} 
                achievement={achievement} 
                totalPoints={totalPoints} 
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Conquistas Prata */}
      {silverAchievements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400">Nível Prata</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {silverAchievements.map(achievement => (
              <AchievementItem 
                key={achievement.id} 
                achievement={achievement} 
                totalPoints={totalPoints} 
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Conquistas Bronze */}
      {bronzeAchievements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-amber-700">Nível Bronze</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bronzeAchievements.map(achievement => (
              <AchievementItem 
                key={achievement.id} 
                achievement={achievement} 
                totalPoints={totalPoints} 
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Outras conquistas sem tier definido */}
      {otherAchievements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-levelup-accent">Outras conquistas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherAchievements.map(achievement => (
              <AchievementItem 
                key={achievement.id} 
                achievement={achievement} 
                totalPoints={totalPoints} 
              />
            ))}
          </div>
        </div>
      )}
      
      {achievements.length === 0 && (
        <div className="col-span-full text-center text-muted-foreground p-4">
          Nenhuma conquista nesta categoria
        </div>
      )}
    </div>
  );
};
