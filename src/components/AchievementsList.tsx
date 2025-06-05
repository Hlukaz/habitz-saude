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
    const {
      progress
    } = calculateAchievementProgress(achievement);
    return progress >= 100;
  };

  // Agrupar conquistas por status (desbloqueadas/bloqueadas)
  const unlockedAchievements = achievements.filter(a => isAchievementUnlocked(a));
  const lockedAchievements = achievements.filter(a => !isAchievementUnlocked(a));
  return;
};
export default AchievementsList;