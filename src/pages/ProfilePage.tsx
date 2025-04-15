import React from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useProfileData, UserProfile } from '@/hooks/useProfileData';
import AchievementsList from '@/components/AchievementsList';
import StreakDisplay from '@/components/StreakDisplay';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileSettings from '@/components/ProfileSettings';
import ProfilePageHeader from '@/components/ProfilePageHeader';

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  
  const { 
    profile, 
    isLoading, 
    error, 
    achievements 
  } = useProfileData(user?.id);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Sessão encerrada com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao encerrar sessão');
    }
  };

  if (isLoading) {
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

  // Fallback para caso o perfil não esteja disponível
  const userData: UserProfile = profile || {
    id: user?.id || '',
    username: user?.email?.split('@')[0] || 'Usuário',
    full_name: user?.user_metadata?.full_name || 'Usuário',
    avatar_url: user?.user_metadata?.avatar_url || '',
    activity_points: 0,
    nutrition_points: 0,
    total_points: 0,
    streak: 0,
    streak_blocks: 2,
    last_activity_date: null,
    last_streak_update: null,
    last_block_reset: null,
    notification_token: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const level = Math.floor(userData.total_points / 50) + 1;
  const xpToNextLevel = (userData.total_points % 50) / 50 * 100;

  return (
    <div className="pb-20">
      {/* Header */}
      <ProfilePageHeader />
      
      {/* User Profile */}
      <div className="px-4 mb-6">
        <ProfileHeader 
          userData={userData} 
          userEmail={user?.email}
          level={level}
          xpToNextLevel={xpToNextLevel}
        />
      </div>
      
      {/* Streak Display */}
      <div className="px-4 mb-6">
        <StreakDisplay 
          streak={userData.streak || 0}
          lastActivityDate={userData.last_activity_date}
          streakBlocks={userData.streak_blocks || 2}
          lastBlockReset={userData.last_block_reset}
          className="shadow-sm"
        />
      </div>
      
      {/* Achievements */}
      <div className="px-4 mb-6">
        <AchievementsList 
          achievements={achievements} 
          totalPoints={userData.total_points}
        />
      </div>
      
      {/* Settings */}
      <div className="px-4">
        <ProfileSettings onLogout={handleLogout} />
      </div>
    </div>
  );
};

export default ProfilePage;
