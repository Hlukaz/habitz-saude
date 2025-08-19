
import React from 'react';
import { Achievement, ActivityTypePoints } from '@/types/activityTypes';
import { useIsMobile } from '@/hooks/use-mobile';
import { AchievementsDrawer } from '@/components/achievements/AchievementsDrawer';
import { AchievementsModalDialog } from '@/components/achievements/AchievementsModalDialog';

interface AchievementsDialogProps {
  achievements: Achievement[];
  totalPoints: number;
  activityTypePoints: ActivityTypePoints[];
  className?: string;
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
