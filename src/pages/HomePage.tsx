
import React, { useState } from 'react';
import { CalendarRange, Camera, Compass, Bell } from 'lucide-react';
import { toast } from 'sonner';
import PointsDisplay from '@/components/PointsDisplay';
import CheckInButton from '@/components/CheckInButton';
import FriendRanking from '@/components/FriendRanking';
import CheckInModal from '@/components/CheckInModal';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Tipos para o perfil do usuário
type UserProfile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  activity_points: number;
  nutrition_points: number;
  total_points: number;
};

// Tipos para o ranking de amigos
type FriendRank = {
  id: string;
  name: string;
  points: number;
  position: number;
  positionChange: 'up' | 'down' | 'same';
  avatarUrl: string;
};

// Buscar perfil do usuário
const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// Buscar ranking de amigos (mock por enquanto)
const fetchFriendRanking = async (userId: string): Promise<FriendRank[]> => {
  // Simulando busca de ranking - isso pode ser implementado no futuro com dados reais
  return [{
    id: 'user-2',
    name: 'Ana Silva',
    points: 7,
    position: 1,
    positionChange: 'up',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?woman'
  }, {
    id: userId,
    name: 'Você',
    points: 5,
    position: 2,
    positionChange: 'same',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?person'
  }, {
    id: 'user-3',
    name: 'Carlos Gomes',
    points: 4,
    position: 3,
    positionChange: 'down',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?man'
  }, {
    id: 'user-4',
    name: 'Patricia Lima',
    points: 3,
    position: 4,
    positionChange: 'up',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?woman,2'
  }, {
    id: 'user-5',
    name: 'Marcelo Costa',
    points: 2,
    position: 5,
    positionChange: 'down',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?man,2'
  }];
};

// Atualizar pontos do usuário
const updateUserPoints = async (
  userId: string, 
  type: 'activity' | 'nutrition', 
  currentProfile: UserProfile
): Promise<UserProfile> => {
  // Calcula os novos pontos
  const newActivityPoints = type === 'activity' 
    ? currentProfile.activity_points + 1 
    : currentProfile.activity_points;
  
  const newNutritionPoints = type === 'nutrition' 
    ? currentProfile.nutrition_points + 1 
    : currentProfile.nutrition_points;
  
  const newTotalPoints = newActivityPoints + newNutritionPoints;

  // Atualiza o perfil no Supabase
  const { data, error } = await supabase
    .from('profiles')
    .update({ 
      activity_points: newActivityPoints,
      nutrition_points: newNutritionPoints,
      total_points: newTotalPoints
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

const HomePage = () => {
  const [checkInType, setCheckInType] = useState<'activity' | 'nutrition' | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Formatador de data
  const formatCurrentWeek = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    
    const startDay = startOfWeek.getDate();
    const endDay = endOfWeek.getDate();
    
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const startMonth = monthNames[startOfWeek.getMonth()];
    const endMonth = monthNames[endOfWeek.getMonth()];
    
    return `${startDay} - ${endDay} ${startMonth}`;
  };

  // Buscar dados do perfil do usuário
  const { 
    data: userProfile, 
    isLoading: profileLoading, 
    error: profileError 
  } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => user ? fetchUserProfile(user.id) : Promise.reject('Usuário não autenticado'),
    enabled: !!user
  });

  // Buscar ranking de amigos
  const {
    data: friendRanking,
    isLoading: rankingLoading,
    error: rankingError
  } = useQuery({
    queryKey: ['friendRanking', user?.id],
    queryFn: () => user ? fetchFriendRanking(user.id) : Promise.reject('Usuário não autenticado'),
    enabled: !!user
  });

  // Mutação para atualizar pontos
  const updatePointsMutation = useMutation({
    mutationFn: (type: 'activity' | 'nutrition') => {
      if (!user || !userProfile) {
        throw new Error('Usuário não autenticado ou perfil não carregado');
      }
      return updateUserPoints(user.id, type, userProfile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', user?.id] });
      toast.success('Check-in realizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar pontos:', error);
      toast.error('Erro ao realizar check-in. Tente novamente.');
    }
  });

  const handleCheckInSubmit = (images: string[]) => {
    if (!checkInType) return;
    
    // Em uma implementação real, enviaríamos as imagens para um bucket de armazenamento
    // Aqui vamos apenas atualizar os pontos
    updatePointsMutation.mutate(checkInType);
    
    // Fechar o modal após submissão
    setCheckInType(null);
  };

  if (profileLoading) {
    return <div className="p-4 text-center">Carregando...</div>;
  }

  if (profileError) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Erro ao carregar dados do perfil</p>
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
  const userData = userProfile || {
    id: user?.id || '',
    username: user?.email?.split('@')[0] || 'Usuário',
    full_name: user?.user_metadata?.full_name || 'Usuário',
    avatar_url: null,
    activity_points: 0,
    nutrition_points: 0,
    total_points: 0
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-levelup-dark">Habitz</h1>
          <div className="flex items-center text-muted-foreground">
            <CalendarRange className="w-4 h-4 mr-1" />
            <span className="text-sm">Semana atual: {formatCurrentWeek()}</span>
          </div>
        </div>
        <div className="flex items-center">
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted">
            <Compass className="w-6 h-6 text-muted-foreground" />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted ml-1">
            <Bell className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>
      </header>
      
      {/* Points Display */}
      <div className="px-4 mb-5">
        <PointsDisplay 
          activityPoints={userData.activity_points} 
          nutritionPoints={userData.nutrition_points} 
          totalPoints={userData.total_points} 
        />
      </div>
      
      {/* Check-in Buttons */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Faça seu Check-in</h2>
        <div className="grid grid-cols-2 gap-3">
          <CheckInButton type="activity" onClick={() => setCheckInType('activity')} />
          <CheckInButton type="nutrition" onClick={() => setCheckInType('nutrition')} />
        </div>
      </div>
      
      {/* Friends Ranking */}
      <div className="px-4 mb-6">
        {rankingLoading ? (
          <div className="text-center p-4">Carregando ranking...</div>
        ) : rankingError ? (
          <div className="text-center p-4 text-red-500">Erro ao carregar ranking</div>
        ) : (
          <FriendRanking
            friends={friendRanking || []}
            currentUserId={userData.id}
          />
        )}
      </div>
      
      {/* Check-in Modal */}
      {checkInType && (
        <CheckInModal 
          type={checkInType} 
          isOpen={!!checkInType} 
          onClose={() => setCheckInType(null)} 
          onSubmit={handleCheckInSubmit} 
        />
      )}
    </div>
  );
};

export default HomePage;
