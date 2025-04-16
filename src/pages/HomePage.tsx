
import React, { useState } from 'react';
import { toast } from 'sonner';
import PointsDisplay from '@/components/PointsDisplay';
import FriendRanking from '@/components/FriendRanking';
import StreakDisplay from '@/components/StreakDisplay';
import { useAuth } from '@/context/AuthContext';
import HomeHeader from '@/components/HomeHeader';
import CheckInSection from '@/components/CheckInSection';
import { useUserData } from '@/hooks/useUserData';
import { formatCurrentWeek } from '@/utils/dateUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    weeklyActivity,
    weeklyActivityLoading,
    weeklyActivityError,
    checkInType,
    setCheckInType,
    handleCheckInSubmit
  } = useUserData(user?.id);
  
  const currentWeek = formatCurrentWeek();
  
  if (profileLoading || weeklyActivityLoading) {
    return <div className="p-4 text-center">Carregando...</div>;
  }
  
  if (profileError || weeklyActivityError) {
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
  
  // Mock data for personal challenge rankings
  const personalChallengeRankings = [
    {
      id: 'challenge-1',
      name: 'Desafio de Verão',
      position: 3,
      totalParticipants: 45,
      pointsEarned: 125,
      endDate: '2025-06-15'
    },
    {
      id: 'challenge-2',
      name: 'Maratona Fitness',
      position: 7,
      totalParticipants: 32,
      pointsEarned: 78,
      endDate: '2025-05-22'
    }
  ];
  
  return <div className="pb-20">
      {/* Header */}
      <HomeHeader currentWeek={currentWeek} />
      
      {/* Points Display */}
      <div className="px-4 mb-5">
        <PointsDisplay activityPoints={userData.activity_points} nutritionPoints={userData.nutrition_points} totalPoints={userData.total_points} />
      </div>
      
      {/* Streak Display - agora com dados reais */}
      <div className="px-4 mb-5">
        <StreakDisplay 
          streak={userData.streak || 0} 
          lastActivityDate={userData.last_activity_date} 
          streakBlocks={userData.streak_blocks || 2} 
          lastBlockReset={userData.last_block_reset}
          weeklyActivity={weeklyActivity}
        />
      </div>
      
      {/* Aplicativo Intro */}
      <div className="px-4 mb-5">
        
      </div>
      
      {/* Check-in Section */}
      <CheckInSection checkInType={checkInType} setCheckInType={setCheckInType} onSubmit={handleCheckInSubmit} />
      
      {/* Ranking Tabs */}
      <div className="px-4 mb-6">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="personal" className="flex-1">Meus Rankings</TabsTrigger>
            <TabsTrigger value="friends" className="flex-1">Ranking de Amigos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="space-y-4">
            <h3 className="text-lg font-bold">Meus Desafios</h3>
            {personalChallengeRankings.length > 0 ? (
              personalChallengeRankings.map((challenge) => (
                <ChallengeRankCard key={challenge.id} challenge={challenge} />
              ))
            ) : (
              <div className="text-center p-6 bg-muted/30 rounded-xl">
                <p className="text-muted-foreground">Você ainda não está participando de nenhum desafio.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="friends">
            {rankingLoading ? (
              <div className="text-center p-4">Carregando ranking...</div>
            ) : rankingError ? (
              <div className="text-center p-4 text-red-500">Erro ao carregar ranking</div>
            ) : (
              <FriendRanking friends={friendRanking || []} currentUserId={userData.id} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};

// Challenge Rank Card Component
const ChallengeRankCard = ({ challenge }) => {
  const daysLeft = () => {
    const today = new Date();
    const endDate = new Date(challenge.endDate);
    const diffTime = Math.abs(endDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  return (
    <div className="bg-card rounded-xl p-4 shadow-sm">
      <h4 className="font-medium text-md">{challenge.name}</h4>
      <div className="mt-2 flex justify-between items-center">
        <div>
          <span className="text-sm text-muted-foreground">Posição: </span>
          <span className="font-bold text-levelup-primary">{challenge.position}</span>
          <span className="text-xs text-muted-foreground"> de {challenge.totalParticipants}</span>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Pontos: </span>
          <span className="font-bold">{challenge.pointsEarned}</span>
        </div>
      </div>
      <div className="mt-1 text-xs text-right text-muted-foreground">
        Termina em {daysLeft()} dias
      </div>
    </div>
  );
};

export default HomePage;
