
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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-[50vh]">
      {achievements.length > 0 ? (
        achievements.map(achievement => (
          <AchievementItem 
            key={achievement.id} 
            achievement={achievement} 
            totalPoints={totalPoints} 
          />
        ))
      ) : (
        <div className="col-span-full text-center text-muted-foreground p-4">
          Nenhuma conquista nesta categoria
        </div>
      )}
    </div>
  );
};
