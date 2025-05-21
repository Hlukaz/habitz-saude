
import React from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useProfileData } from '@/hooks/useProfileData';
import { useUserData } from '@/hooks/useUserData';
import { UserProfile } from '@/types/userProfile';
import AchievementsList from '@/components/AchievementsList';
import StreakDisplay from '@/components/StreakDisplay';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileSettings from '@/components/ProfileSettings';
import ProfilePageHeader from '@/components/ProfilePageHeader';
import { Trophy } from 'lucide-react';

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  
  const { 
    profile, 
    isLoading, 
    error, 
    achievements 
  } = useProfileData(user?.id);

  const {
    activityTypePoints,
    activityTypePointsLoading
  } = useUserData(user?.id);

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
    xp: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const level = Math.floor(userData.total_points / 50) + 1;
  const xpToNextLevel = (userData.total_points % 50) / 50 * 100;
  
  // Calcular conquistas desbloqueadas
  const unlockedAchievements = achievements.filter(a => a.unlocked);

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
        <StreakDisplay 
          streak={userData.streak || 0}
          lastActivityDate={userData.last_activity_date}
          streakBlocks={userData.streak_blocks || 2}
          lastBlockReset={userData.last_block_reset}
          className="shadow-sm"
        />
      </div>
      
      <div className="px-4 mb-6">
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Conquistas Desbloqueadas</h3>
            <div className="flex items-center">
              <Trophy className="w-5 h-5 text-levelup-accent mr-1" />
              <span className="font-bold text-lg text-levelup-accent">
                {unlockedAchievements.length}
              </span>
              <span className="text-muted-foreground">/{achievements.length}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-levelup-light p-3 rounded-lg flex items-center">
              <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center mr-3">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bronze</p>
                <p className="font-bold">
                  {unlockedAchievements.filter(a => a.tier === 'bronze').length} conquistas
                </p>
              </div>
            </div>
            
            <div className="bg-levelup-light p-3 rounded-lg flex items-center">
              <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center mr-3">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prata</p>
                <p className="font-bold">
                  {unlockedAchievements.filter(a => a.tier === 'silver').length} conquistas
                </p>
              </div>
            </div>
            
            <div className="bg-levelup-light p-3 rounded-lg flex items-center">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ouro</p>
                <p className="font-bold">
                  {unlockedAchievements.filter(a => a.tier === 'gold').length} conquistas
                </p>
              </div>
            </div>
            
            <div className="bg-levelup-light p-3 rounded-lg flex items-center">
              <div className="w-10 h-10 bg-levelup-primary rounded-full flex items-center justify-center mr-3">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Outras</p>
                <p className="font-bold">
                  {unlockedAchievements.filter(a => !a.tier).length} conquistas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 mb-6">
        <AchievementsList 
          achievements={achievements} 
          totalPoints={userData.total_points}
        />
      </div>
      
      <div className="px-4">
        <ProfileSettings onLogout={handleLogout} />
      </div>
    </div>
  );
};

export default ProfilePage;
