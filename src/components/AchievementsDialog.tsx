
import React from 'react';
import { Trophy, Medal, Activity, Apple, Flame, Info } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AchievementsDialogProps {
  achievements: Achievement[];
  totalPoints: number;
  className?: string;
}

// Categories de conquistas
type AchievementCategory = 'physical' | 'nutrition' | 'streak';

const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  physical: 'Atividade Física',
  nutrition: 'Alimentação',
  streak: 'Ofensiva'
};

const CATEGORY_ICONS: Record<AchievementCategory, React.ReactNode> = {
  physical: <Activity className="h-5 w-5" />,
  nutrition: <Apple className="h-5 w-5" />,
  streak: <Flame className="h-5 w-5" />
};

// Lista completa de conquistas possíveis
const allAchievements: (Achievement & { category: AchievementCategory })[] = [
  // Conquistas de Atividade Física
  {
    id: "physical-1",
    name: "Primeira Atividade",
    description: "Complete sua primeira atividade física",
    icon: "activity",
    required_points: 1,
    unlocked: false,
    category: "physical"
  },
  {
    id: "physical-2",
    name: "Atividade Constante",
    description: "Complete 10 atividades físicas",
    icon: "activity",
    required_points: 10,
    unlocked: false,
    category: "physical"
  },
  {
    id: "physical-3",
    name: "Especialista em Fitness",
    description: "Acumule 100 pontos de atividade",
    icon: "dumbbell",
    required_points: 100,
    unlocked: false,
    category: "physical"
  },
  {
    id: "physical-4",
    name: "Maratonista",
    description: "Registre 20 corridas ou caminhadas",
    icon: "run",
    required_points: 50,
    unlocked: false,
    category: "physical"
  },
  {
    id: "physical-5",
    name: "Atleta Completo",
    description: "Pratique 5 tipos diferentes de exercícios",
    icon: "trophy",
    required_points: 150,
    unlocked: false,
    category: "physical"
  },
  
  // Conquistas de Alimentação
  {
    id: "nutrition-1",
    name: "Primeira Refeição Saudável",
    description: "Registre sua primeira refeição saudável",
    icon: "apple",
    required_points: 1,
    unlocked: false,
    category: "nutrition"
  },
  {
    id: "nutrition-2",
    name: "Mestre da Nutrição",
    description: "Registre 30 refeições saudáveis",
    icon: "carrot",
    required_points: 30,
    unlocked: false,
    category: "nutrition"
  },
  {
    id: "nutrition-3",
    name: "Equilíbrio Perfeito",
    description: "Mantenha uma dieta equilibrada por 7 dias",
    icon: "utensils",
    required_points: 50,
    unlocked: false,
    category: "nutrition"
  },
  {
    id: "nutrition-4",
    name: "Hidratação Constante",
    description: "Registre o consumo de água por 14 dias consecutivos",
    icon: "cup",
    required_points: 70,
    unlocked: false,
    category: "nutrition"
  },
  {
    id: "nutrition-5",
    name: "Nutricionista Especialista",
    description: "Acumule 200 pontos de nutrição",
    icon: "salad",
    required_points: 200,
    unlocked: false,
    category: "nutrition"
  },
  
  // Conquistas de Ofensiva (Streak)
  {
    id: "streak-1",
    name: "Primeiro Dia",
    description: "Inicie sua primeira ofensiva",
    icon: "flame",
    required_points: 1,
    unlocked: false,
    category: "streak"
  },
  {
    id: "streak-2",
    name: "Ofensiva de 7 dias",
    description: "Mantenha uma ofensiva por 7 dias",
    icon: "flame",
    required_points: 50,
    unlocked: false,
    category: "streak"
  },
  {
    id: "streak-3",
    name: "Ofensiva de 30 dias",
    description: "Mantenha uma ofensiva por 30 dias",
    icon: "award-star",
    required_points: 200,
    unlocked: false,
    category: "streak"
  },
  {
    id: "streak-4",
    name: "Recuperação Rápida",
    description: "Recupere sua ofensiva após uma quebra",
    icon: "refresh-ccw",
    required_points: 75,
    unlocked: false,
    category: "streak"
  },
  {
    id: "streak-5",
    name: "Ofensiva Lendária",
    description: "Mantenha uma ofensiva por 100 dias",
    icon: "sword",
    required_points: 500,
    unlocked: false,
    category: "streak"
  }
];

const getIconComponent = (iconName: string) => {
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

const AchievementCategoryTab = ({ 
  achievements, 
  totalPoints, 
  category 
}: { 
  achievements: (Achievement & { category?: AchievementCategory })[], 
  totalPoints: number, 
  category: AchievementCategory 
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

// Drawer version (mobile)
const AchievementsDrawer = ({ achievements, totalPoints }: AchievementsDialogProps) => {
  // Combinar conquistas existentes com as pré-definidas
  const existingIds = achievements.map(a => a.id);
  const combinedAchievements = [
    ...achievements.map(a => ({ ...a, category: getCategoryFromAchievement(a) })),
    ...allAchievements.filter(a => !existingIds.includes(a.id))
  ];
  
  // Separar por categoria
  const achievementsByCategory = {
    physical: combinedAchievements.filter(a => a.category === 'physical'),
    nutrition: combinedAchievements.filter(a => a.category === 'nutrition'),
    streak: combinedAchievements.filter(a => a.category === 'streak'),
  };
  
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
        
        <Tabs defaultValue="physical" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <TabsTrigger 
                key={key} 
                value={key}
                className="flex items-center gap-1"
              >
                {CATEGORY_ICONS[key as AchievementCategory]}
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.entries(achievementsByCategory).map(([key, categoryAchievements]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <AchievementCategoryTab 
                achievements={categoryAchievements}
                totalPoints={totalPoints}
                category={key as AchievementCategory}
              />
            </TabsContent>
          ))}
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
};

// Dialog version (desktop)
const AchievementsModalDialog = ({ achievements, totalPoints }: AchievementsDialogProps) => {
  // Combinar conquistas existentes com as pré-definidas
  const existingIds = achievements.map(a => a.id);
  const combinedAchievements = [
    ...achievements.map(a => ({ ...a, category: getCategoryFromAchievement(a) })),
    ...allAchievements.filter(a => !existingIds.includes(a.id))
  ];
  
  // Separar por categoria
  const achievementsByCategory = {
    physical: combinedAchievements.filter(a => a.category === 'physical'),
    nutrition: combinedAchievements.filter(a => a.category === 'nutrition'),
    streak: combinedAchievements.filter(a => a.category === 'streak'),
  };
  
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
        
        <Tabs defaultValue="physical" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <TabsTrigger 
                key={key} 
                value={key}
                className="flex items-center gap-1"
              >
                {CATEGORY_ICONS[key as AchievementCategory]}
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.entries(achievementsByCategory).map(([key, categoryAchievements]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <AchievementCategoryTab 
                achievements={categoryAchievements}
                totalPoints={totalPoints}
                category={key as AchievementCategory}
              />
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Função para determinar a categoria com base no nome ou descrição
function getCategoryFromAchievement(achievement: Achievement): AchievementCategory {
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
