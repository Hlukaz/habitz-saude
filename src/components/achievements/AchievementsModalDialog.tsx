
import React from 'react';
import { Trophy, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Achievement, ActivityTypePoints } from '@/types/activityTypes';
import { AchievementCategoryTab } from './AchievementCategoryTab';
import { AchievementCategoryType, CATEGORY_LABELS, CATEGORY_ICONS, getCategoryFromAchievement } from './achievementUtils';

interface AchievementsModalDialogProps {
  achievements: Achievement[];
  totalPoints: number;
  activityTypePoints: ActivityTypePoints[];
  className?: string;
}

// Helper function to map from our UI category to database category
const mapCategoryToDbCategory = (category: AchievementCategoryType): "activity" | "nutrition" | "general" | "streak" => {
  switch(category) {
    case "physical":
      return "activity";
    default:
      return category as "nutrition" | "general" | "streak";
  }
};

export const AchievementsModalDialog: React.FC<AchievementsModalDialogProps> = ({ 
  achievements, 
  totalPoints, 
  activityTypePoints 
}) => {
  // Combinar conquistas existentes com as pré-definidas
  const existingIds = achievements.map(a => a.id);
  const combinedAchievements = [
    ...achievements.map(a => {
      const uiCategory = getCategoryFromAchievement(a);
      return { 
        ...a, 
        category: mapCategoryToDbCategory(uiCategory)
      };
    }),
  ];
  
  // Separar por categoria
  const achievementsByCategory = {
    physical: combinedAchievements.filter(a => a.category === "activity"),
    nutrition: combinedAchievements.filter(a => a.category === "nutrition"),
    streak: combinedAchievements.filter(a => a.category === "streak"),
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
                activityTypePoints={activityTypePoints}
                category={key as AchievementCategoryType}
              />
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
