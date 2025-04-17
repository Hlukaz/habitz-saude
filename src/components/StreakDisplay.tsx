
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
  
  return (
    <div className={cn("bg-card rounded-xl p-4", className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Flame 
            className={cn(
              "w-5 h-5 mr-2", 
              active ? "text-levelup-primary" : "text-muted-foreground"
            )} 
          />
          <h3 className="font-semibold text-lg">Sequência</h3>
        </div>
        <div className="flex items-center">
          <span className="mr-1 font-bold text-xl">
            {streak}
          </span>
          <span className="text-sm text-muted-foreground">dias</span>
        </div>
      </div>
      
      {/* Sequência semanal */}
      <div className="mt-3">
        <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
          <span>Essa semana</span>
          <span className="text-xs">Atividade + Alimentação</span>
        </div>
        <div className="flex justify-between gap-1 mt-1">
          {displayWeeklyActivity.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={cn(
                "w-10 h-10 rounded-full border-2 flex items-center justify-center mb-1",
                day.completed 
                  ? "bg-levelup-primary border-levelup-primary text-white" 
                  : "border-muted-foreground text-muted-foreground"
              )}>
                {day.completed ? (
                  <Trophy className="w-5 h-5" />
                ) : (
                  <div className="flex">
                    {day.activityPoint && <div className="w-2 h-2 bg-levelup-primary rounded-full mr-0.5" />}
                    {day.nutritionPoint && <div className="w-2 h-2 bg-levelup-primary rounded-full" />}
                  </div>
                )}
              </div>
              <span className="text-xs">{day.day}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bloqueios de streaks (bônus para dias perdidos) */}
      <div className="mt-3">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center">
            <Heart className="w-4 h-4 mr-1 text-rose-500" />
            <span className="text-sm">Bloqueios</span>
          </div>
          <span className="text-sm font-semibold">{streakBlocks}/2</span>
        </div>
        <Progress value={(streakBlocks / 2) * 100} className="h-2" />
        {streakBlocks < 2 && daysToRecover > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            Recupera em {daysToRecover} dias
          </p>
        )}
      </div>
    </div>
  );
};

export default StreakDisplay;
