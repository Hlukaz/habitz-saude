
import React from 'react';
import { Flame, Calendar, Trophy, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface StreakDisplayProps {
  streak: number;
  lastActivityDate: string | null;
  streakBlocks: number;
  lastBlockReset: string | null;
  className?: string;
}

const StreakDisplay = ({
  streak,
  lastActivityDate,
  streakBlocks = 2,
  lastBlockReset,
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
  
  return <div className={cn("p-4 rounded-xl bg-card text-card-foreground", className)}>
      <div className="flex items-center mb-3">
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mr-3 relative", active ? "bg-levelup-accent" : "bg-muted")}>
          <Flame className={cn("w-5 h-5", active ? "text-white animate-pulse" : "text-muted-foreground")} />
          {active && <div className="absolute -inset-1 rounded-full bg-levelup-accent/20 animate-[ping_2s_ease-in-out_infinite]" />}
        </div>
        <div className="flex-1">
          <h3 className="font-bold">Ofensiva Diária</h3>
          <p className="text-sm text-muted-foreground">
            {active ? `Mantenha sua ofensiva de ${streak} ${streak === 1 ? 'dia' : 'dias'}!` : 'Faça uma atividade para iniciar sua ofensiva!'}
          </p>
        </div>
        <div className="flex">
          {[...Array(2)].map((_, i) => <Heart key={i} fill={i < streakBlocks ? "red" : "none"} className={cn("w-6 h-6 mx-0.5", i < streakBlocks ? "text-red-500" : "text-muted")} />)}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-2">
        {[1, 2, 3].map(day => (
          <div key={day} className="bg-muted/50 p-2 rounded-lg text-center text-sm">
            Dia {day}
          </div>
        ))}
      </div>
      
      {streakBlocks < 2 && daysToRecover > 0 && <div className="mt-2 text-xs text-muted-foreground text-center">
          Recuperação do bloqueio em {daysToRecover} {daysToRecover === 1 ? 'dia' : 'dias'}
        </div>}
      
      {streak >= 3 && <div className="flex items-center justify-between mt-3 text-sm">
          <div className="flex items-center">
            <Trophy className="w-4 h-4 text-levelup-accent mr-1" />
            <span>Sequência completa: {Math.floor(streak / 3)}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-levelup-accent mr-1" />
            <span>Ofensiva total: {streak} dias</span>
          </div>
        </div>}
    </div>;
};

export default StreakDisplay;
