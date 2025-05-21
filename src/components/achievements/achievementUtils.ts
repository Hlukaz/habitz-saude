
import React from 'react';
import { Trophy, Medal, Activity, Apple, Flame } from 'lucide-react';
import { Achievement } from '@/types/activityTypes';

export type AchievementCategoryType = 'physical' | 'nutrition' | 'streak';

export const CATEGORY_LABELS: Record<AchievementCategoryType, string> = {
  physical: 'Atividade Física',
  nutrition: 'Alimentação',
  streak: 'Ofensiva'
};

export const CATEGORY_ICONS: Record<AchievementCategoryType, React.ReactNode> = {
  physical: <Activity className="h-5 w-5" />,
  nutrition: <Apple className="h-5 w-5" />,
  streak: <Flame className="h-5 w-5" />
};

export const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'trophy': return Trophy;
    case 'award': 
    case 'award-star': return Medal;
    case 'activity': return Activity;
    case 'dumbbell': return Activity;
    case 'run': return Activity;
    case 'apple': return Apple;
    case 'carrot': return Apple;
    case 'utensils': return Apple;
    case 'cup': return Apple;
    case 'salad': return Apple;
    case 'flame': return Flame;
    case 'refresh-ccw': return Flame;
    case 'sword': return Flame;
    default: return Trophy;
  }
};

// Função para determinar a categoria com base no nome ou descrição
export function getCategoryFromAchievement(achievement: Achievement): AchievementCategoryType {
  if (achievement.category) {
    // Se já tiver categoria definida no banco
    if (achievement.category === 'activity') return 'physical';
    if (achievement.category === 'nutrition') return 'nutrition';
    if (achievement.category === 'streak') return 'streak';
  }
  
  const name = achievement.name.toLowerCase();
  const description = achievement.description.toLowerCase();
  
  if (
    name.includes('atividade') || 
    name.includes('fitness') || 
    name.includes('exercício') ||
    description.includes('atividade física') ||
    description.includes('exercício')
  ) {
    return 'physical';
  }
  
  if (
    name.includes('refeição') || 
    name.includes('nutrição') || 
    name.includes('dieta') ||
    description.includes('refeição') ||
    description.includes('alimentação') ||
    description.includes('nutrição')
  ) {
    return 'nutrition';
  }
  
  if (
    name.includes('ofensiva') || 
    name.includes('dias') ||
    description.includes('ofensiva') ||
    description.includes('dias consecutivos')
  ) {
    return 'streak';
  }
  
  // Default para physical se não conseguir determinar
  return 'physical';
}
