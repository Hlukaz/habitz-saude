
import React from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useProfileData } from '@/hooks/useProfileData';
import { useUserData } from '@/hooks/useUserData';
import { UserProfile } from '@/types/userProfile';

import ProfileHeader from '@/components/ProfileHeader';
import ProfileSettings from '@/components/ProfileSettings';
import ProfilePageHeader from '@/components/ProfilePageHeader';
import ActivityTypePointsDisplay from '@/components/ActivityTypePointsDisplay';


const ProfilePage = () => {
  const { user, signOut } = useAuth();
  
  const { 
    profile, 
    isLoading, 
    error
  } = useProfileData(user?.id);

  const {
    activityTypePoints,
    activityTypePointsLoading
  } = useUserData(user?.id);

  // Calculate total points from activity points
  const totalPoints = React.useMemo(() => {
    if (!activityTypePoints) return 0;
    return activityTypePoints.reduce((sum, item) => sum + item.points, 0);
  }, [activityTypePoints]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Sessão encerrada com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao encerrar sessão');
    }
  };

  if (isLoading || activityTypePointsLoading) {
    return <div className="p-4 text-center">Carregando perfil...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Erro ao carregar perfil</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-levelup-primary"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const userData: UserProfile = {
    ...profile,
    id: user?.id || '',
    username: user?.email?.split('@')[0] || 'Usuário',
    full_name: user?.user_metadata?.full_name || profile?.full_name || 'Usuário',
    avatar_url: profile?.avatar_url || user?.user_metadata?.avatar_url || '',
    streak: profile?.streak || 0,
    streak_blocks: profile?.streak_blocks || 2,
    last_activity_date: profile?.last_activity_date || null,
    last_streak_update: profile?.last_streak_update || null,
    last_block_reset: profile?.last_block_reset || null,
    notification_token: profile?.notification_token || null,
    xp: profile?.xp || 0,
    created_at: profile?.created_at || new Date().toISOString(),
    updated_at: profile?.updated_at || new Date().toISOString(),
    total_points: totalPoints
  };

  const level = Math.floor((totalPoints || 0) / 50) + 1;
  const xpToNextLevel = (totalPoints % 50) / 50 * 100;

  return (
    <div className="pb-20">
      <ProfilePageHeader />
      
      <div className="px-4 mb-6">
        <ProfileHeader 
          userData={userData} 
          userEmail={user?.email}
          level={level}
          xpToNextLevel={xpToNextLevel}
        />
      </div>
      
      <div className="px-4 mb-6">
        <ActivityTypePointsDisplay 
          activityPoints={activityTypePoints || []}
          isLoading={activityTypePointsLoading}
        />
      </div>
      
      <div className="px-4">
        <ProfileSettings onLogout={handleLogout} />
      </div>
    </div>
  );
};

export default ProfilePage;
