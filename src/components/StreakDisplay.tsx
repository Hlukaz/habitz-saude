
import React from 'react';
import { Flame, Calendar, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface StreakDisplayProps {
  streak: number;
  lastActivityDate: string | null;
  className?: string;
}

const StreakDisplay = ({ streak, lastActivityDate, className }: StreakDisplayProps) => {
  // Verificar se o streak está ativo (atividade registrada nos últimos 3 dias)
  const isStreakActive = () => {
    if (!lastActivityDate) return false;
    
    const today = new Date();
    const lastActivity = new Date(lastActivityDate);
    const diffTime = Math.abs(today.getTime() - lastActivity.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 3;
  };
  
  const active = isStreakActive();
  
  return (
    <div className={cn("p-4 rounded-xl bg-card text-card-foreground", className)}>
      <div className="flex items-center mb-3">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center mr-3",
          active ? "bg-levelup-accent" : "bg-muted"
        )}>
          <Flame className={cn(
            "w-5 h-5", 
            active ? "text-white animate-pulse" : "text-muted-foreground"
          )} />
        </div>
        <div>
          <h3 className="font-bold">Ofensiva Diária</h3>
          <p className="text-sm text-muted-foreground">
            {active 
              ? `Mantenha sua ofensiva de ${streak} ${streak === 1 ? 'dia' : 'dias'}!` 
              : 'Faça uma atividade para iniciar sua ofensiva!'}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-2">
        {[1, 2, 3].map((day) => (
          <div 
            key={day}
            className={cn(
              "p-2 rounded-md text-center",
              day <= streak % 3 || (day === 3 && streak % 3 === 0 && streak > 0)
                ? "bg-levelup-primary/20 border border-levelup-primary"
                : "bg-muted border border-transparent"
            )}
          >
            <span className="text-xs font-medium">Dia {day}</span>
          </div>
        ))}
      </div>
      
      {streak >= 3 && (
        <div className="flex items-center justify-between mt-3 text-sm">
          <div className="flex items-center">
            <Trophy className="w-4 h-4 text-levelup-accent mr-1" />
            <span>Sequência completa: {Math.floor(streak / 3)}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-levelup-accent mr-1" />
            <span>Ofensiva total: {streak} dias</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreakDisplay;
