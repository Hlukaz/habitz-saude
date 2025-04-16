import React from 'react';
import { Trophy, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Achievement } from '@/components/AchievementsList';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Progress } from '@/components/ui/progress';

interface AchievementsDialogProps {
  achievements: Achievement[];
  totalPoints: number;
  className?: string;
}

const allAchievements: Achievement[] = [
  {
    id: "1",
    name: "Primeira Atividade",
    description: "Complete sua primeira atividade física",
    icon: "trophy",
    required_points: 1,
    unlocked: false
  },
  {
    id: "2",
    name: "Atividade Constante",
    description: "Complete 10 atividades físicas",
    icon: "trophy",
    required_points: 10,
    unlocked: false
  },
  {
    id: "3",
    name: "Especialista em Fitness",
    description: "Acumule 100 pontos de atividade",
    icon: "trophy",
    required_points: 100,
    unlocked: false
  },
  {
    id: "4",
    name: "Mestre da Nutrição",
    description: "Registre 30 refeições saudáveis",
    icon: "award",
    required_points: 30,
    unlocked: false
  },
  {
    id: "5",
    name: "Ofensiva de 7 dias",
    description: "Mantenha uma ofensiva por 7 dias",
    icon: "award-star",
    required_points: 50,
    unlocked: false
  },
  {
    id: "6",
    name: "Ofensiva de 30 dias",
    description: "Mantenha uma ofensiva por 30 dias",
    icon: "award-star",
    required_points: 200,
    unlocked: false
  }
];

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'trophy': return Trophy;
    case 'award': return Trophy;
    case 'award-star': return Trophy;
    default: return Trophy;
  }
};

const AchievementItem = ({ achievement, totalPoints }: { achievement: Achievement; totalPoints: number }) => {
  const IconComponent = getIconComponent(achievement.icon);
  const isUnlocked = achievement.unlocked;
  const progress = Math.min(100, (totalPoints / achievement.required_points) * 100);
  
  return (
    <div className={cn(
      "flex flex-col p-3 rounded-xl border", 
      isUnlocked ? "bg-levelup-light border-levelup-accent" : "bg-card border-muted"
    )}>
      <div className="flex items-center gap-3 mb-2">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          isUnlocked ? "bg-levelup-accent text-white" : "bg-muted text-muted-foreground"
        )}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{achievement.name}</h3>
          <p className="text-xs text-muted-foreground">{achievement.description}</p>
        </div>
      </div>
      
      {!isUnlocked && (
        <div className="mt-1">
          <div className="flex items-center justify-between text-xs mb-1">
            <span>Progresso</span>
            <span>{totalPoints}/{achievement.required_points} pontos</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      )}
      
      {isUnlocked && achievement.unlocked_at && (
        <p className="text-xs text-levelup-accent mt-1">
          Desbloqueado em {new Date(achievement.unlocked_at).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

const AchievementsDrawer = ({ achievements, totalPoints }: AchievementsDialogProps) => {
  const existingIds = achievements.map(a => a.id);
  const combinedAchievements = [
    ...achievements,
    ...allAchievements.filter(a => !existingIds.includes(a.id))
  ];
  
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full flex justify-center items-center gap-2">
          <Trophy className="h-4 w-4" />
          <span>Ver Todas as Conquistas</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-6">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-center flex justify-center items-center gap-2">
            <Trophy className="h-5 w-5 text-levelup-accent" />
            <span>Todas as Conquistas</span>
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="text-sm text-center mb-4 flex items-center gap-1 justify-center text-muted-foreground">
          <Info className="h-4 w-4" />
          <span>Acumule pontos para desbloquear todas as conquistas!</span>
        </div>
        
        <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-[60vh] px-1 pb-2">
          {combinedAchievements.map(achievement => (
            <AchievementItem 
              key={achievement.id} 
              achievement={achievement} 
              totalPoints={totalPoints} 
            />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const AchievementsModalDialog = ({ achievements, totalPoints }: AchievementsDialogProps) => {
  const existingIds = achievements.map(a => a.id);
  const combinedAchievements = [
    ...achievements,
    ...allAchievements.filter(a => !existingIds.includes(a.id))
  ];
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex justify-center items-center gap-2">
          <Trophy className="h-4 w-4" />
          <span>Ver Todas as Conquistas</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center gap-2">
            <Trophy className="h-5 w-5 text-levelup-accent" />
            <span>Todas as Conquistas</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-sm text-center mb-4 flex items-center gap-1 justify-center text-muted-foreground">
          <Info className="h-4 w-4" />
          <span>Acumule pontos para desbloquear todas as conquistas!</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-[60vh]">
          {combinedAchievements.map(achievement => (
            <AchievementItem 
              key={achievement.id} 
              achievement={achievement} 
              totalPoints={totalPoints} 
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AchievementsDialog = (props: AchievementsDialogProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={props.className}>
      {isMobile ? (
        <AchievementsDrawer {...props} />
      ) : (
        <AchievementsModalDialog {...props} />
      )}
    </div>
  );
};

export default AchievementsDialog;
