import React from 'react';
import { toast } from 'sonner';
import PointsDisplay from '@/components/PointsDisplay';
import FriendRanking from '@/components/FriendRanking';
import StreakDisplay from '@/components/StreakDisplay';
import { useAuth } from '@/context/AuthContext';
import HomeHeader from '@/components/HomeHeader';
import CheckInSection from '@/components/CheckInSection';
import { useUserData } from '@/hooks/useUserData';
import { formatCurrentWeek } from '@/utils/dateUtils';
const HomePage = () => {
  const {
    user
  } = useAuth();
  const {
    userProfile,
    profileLoading,
    profileError,
    friendRanking,
    rankingLoading,
    rankingError,
    checkInType,
    setCheckInType,
    handleCheckInSubmit
  } = useUserData(user?.id);
  const currentWeek = formatCurrentWeek();
  if (profileLoading) {
    return <div className="p-4 text-center">Carregando...</div>;
  }
  if (profileError) {
    return <div className="p-4 text-center">
        <p className="text-red-500">Erro ao carregar dados do perfil</p>
        <button onClick={() => window.location.reload()} className="mt-2 text-levelup-primary">
          Tentar novamente
        </button>
      </div>;
  }

  // Fallback para caso o perfil não esteja disponível
  const userData = userProfile || {
    id: user?.id || '',
    username: user?.email?.split('@')[0] || 'Usuário',
    full_name: user?.user_metadata?.full_name || 'Usuário',
    avatar_url: null,
    activity_points: 0,
    nutrition_points: 0,
    total_points: 0,
    streak: 0,
    streak_blocks: 2,
    last_activity_date: null,
    last_streak_update: null,
    last_block_reset: null,
    notification_token: null
  };
  return <div className="pb-20">
      {/* Header */}
      <HomeHeader currentWeek={currentWeek} />
      
      {/* Points Display */}
      <div className="px-4 mb-5">
        <PointsDisplay activityPoints={userData.activity_points} nutritionPoints={userData.nutrition_points} totalPoints={userData.total_points} />
      </div>
      
      {/* Streak Display */}
      <div className="px-4 mb-5">
        <StreakDisplay streak={userData.streak || 0} lastActivityDate={userData.last_activity_date} streakBlocks={userData.streak_blocks || 2} lastBlockReset={userData.last_block_reset} />
      </div>
      
      {/* Aplicativo Intro */}
      <div className="px-4 mb-5">
        
      </div>
      
      {/* Check-in Section */}
      <CheckInSection checkInType={checkInType} setCheckInType={setCheckInType} onSubmit={handleCheckInSubmit} />
      
      {/* Friends Ranking */}
      <div className="px-4 mb-6">
        {rankingLoading ? <div className="text-center p-4">Carregando ranking...</div> : rankingError ? <div className="text-center p-4 text-red-500">Erro ao carregar ranking</div> : <FriendRanking friends={friendRanking || []} currentUserId={userData.id} />}
      </div>
    </div>;
};
export default HomePage;