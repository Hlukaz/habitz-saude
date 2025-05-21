
import React from 'react';
import { Trophy, Medal, Activity, Apple, Flame, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Achievement } from '@/types/activityTypes';
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
import { AchievementItem } from '@/components/achievements/AchievementItem';
import { AchievementCategoryTab } from '@/components/achievements/AchievementCategoryTab';
import { AchievementCategoryType, CATEGORY_LABELS, CATEGORY_ICONS, getCategoryFromAchievement } from '@/components/achievements/achievementUtils';

interface AchievementsDialogProps {
  achievements: Achievement[];
  totalPoints: number;
  className?: string;
}

// Drawer version (mobile)
const AchievementsDrawer = ({ achievements, totalPoints }: AchievementsDialogProps) => {
  // Combinar conquistas existentes com as pré-definidas
  const existingIds = achievements.map(a => a.id);
  const combinedAchievements = [
    ...achievements.map(a => ({ ...a, category: getCategoryFromAchievement(a) })),
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
                {CATEGORY_ICONS[key as AchievementCategoryType]}
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.entries(achievementsByCategory).map(([key, categoryAchievements]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <AchievementCategoryTab 
                achievements={categoryAchievements}
                totalPoints={totalPoints}
                category={key as AchievementCategoryType}
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
                {CATEGORY_ICONS[key as AchievementCategoryType]}
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.entries(achievementsByCategory).map(([key, categoryAchievements]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <AchievementCategoryTab 
                achievements={categoryAchievements}
                totalPoints={totalPoints}
                category={key as AchievementCategoryType}
              />
            </TabsContent>
          ))}
        </Tabs>
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
