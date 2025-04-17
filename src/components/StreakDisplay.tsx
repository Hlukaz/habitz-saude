import React from 'react';
import { Flame, Calendar, Trophy, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { WeeklyActivityDay } from '@/hooks/useUserData';
interface StreakDisplayProps {
  streak: number;
  lastActivityDate: string | null;
  streakBlocks: number;
  lastBlockReset: string | null;
  weeklyActivity?: WeeklyActivityDay[];
  className?: string;
}
const StreakDisplay = ({
  streak,
  lastActivityDate,
  streakBlocks = 2,
  lastBlockReset,
  weeklyActivity,
  className
}: StreakDisplayProps) => {
  // Verificar se o streak está ativo (atividade registrada nos últimos 2 dias)
  const isStreakActive = () => {
    if (!lastActivityDate) return false;
    const today = new Date();
    const lastActivity = new Date(lastActivityDate);
    const diffTime = Math.abs(today.getTime() - lastActivity.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2;
  };

  // Verificar quanto tempo falta para recuperar o bloqueio
  const getDaysUntilBlockRecovery = () => {
    if (!lastBlockReset) return 0;
    const today = new Date();
    const resetDate = new Date(lastBlockReset);
    const recoveryDate = new Date(resetDate);
    recoveryDate.setDate(recoveryDate.getDate() + 7); // 7 dias para recuperar

    const diffTime = Math.max(0, recoveryDate.getTime() - today.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  const active = isStreakActive();
  const daysToRecover = getDaysUntilBlockRecovery();

  // Use weeklyActivity from props if provided, otherwise use mock data
  const displayWeeklyActivity = weeklyActivity || [{
    day: 'D',
    date: '',
    completed: false,
    activityPoint: false,
    nutritionPoint: false
  }, {
    day: 'S',
    date: '',
    completed: false,
    activityPoint: false,
    nutritionPoint: false
  }, {
    day: 'T',
    date: '',
    completed: false,
    activityPoint: false,
    nutritionPoint: false
  }, {
    day: 'Q',
    date: '',
    completed: false,
    activityPoint: false,
    nutritionPoint: false
  }, {
    day: 'Q',
    date: '',
    completed: false,
    activityPoint: false,
    nutritionPoint: false
  }, {
    day: 'S',
    date: '',
    completed: false,
    activityPoint: false,
    nutritionPoint: false
  }, {
    day: 'S',
    date: '',
    completed: false,
    activityPoint: false,
    nutritionPoint: false
  }];
  return;
};
export default StreakDisplay;