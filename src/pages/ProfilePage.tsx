
import React from 'react';
import { 
  Camera, 
  Settings, 
  Trophy, 
  Calendar, 
  Bell, 
  Activity, 
  Smartphone,
  LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

// Tipos para o perfil do usuário
type UserProfile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  activity_points: number;
  nutrition_points: number;
  total_points: number;
  created_at: string;
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

// Formatar a data para exibição
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const mockAchievements = [
  {
    id: 'achievement-1',
    name: 'Primeira Semana',
    description: 'Completou todos os objetivos por uma semana',
    icon: Trophy,
    unlocked: true
  },
  {
    id: 'achievement-2',
    name: 'Mestre da Alimentação',
    description: 'Registrou 20 refeições saudáveis',
    icon: Trophy,
    unlocked: true
  },
  {
    id: 'achievement-3',
    name: 'Desafio Vencedor',
    description: 'Ganhou seu primeiro desafio',
    icon: Trophy,
    unlocked: true
  },
  {
    id: 'achievement-4',
    name: 'Maratonista',
    description: 'Completou 30 dias de exercícios',
    icon: Trophy,
    unlocked: false
  }
];

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => user ? fetchUserProfile(user.id) : Promise.reject('Usuário não autenticado'),
    enabled: !!user
  });

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
  const userData = profile || {
    id: user?.id || '',
    username: user?.email?.split('@')[0] || 'Usuário',
    full_name: user?.user_metadata?.full_name || 'Usuário',
    avatar_url: null,
    activity_points: 0,
    nutrition_points: 0,
    total_points: 0,
    created_at: new Date().toISOString()
  };

  const level = Math.floor(userData.total_points / 50) + 1;
  const xpToNextLevel = (userData.total_points % 50) / 50 * 100;
  const streak = 12; // Placeholder até implementarmos rastreamento de streak

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-levelup-dark">Perfil</h1>
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>
      
      {/* User Profile */}
      <div className="px-4 mb-6">
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="relative">
              <img
                src={userData.avatar_url || "https://source.unsplash.com/random/100x100/?person"}
                alt={userData.full_name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-levelup-primary rounded-full flex items-center justify-center text-white shadow-sm">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold">{userData.full_name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="flex items-center mt-1">
                <div className="bg-levelup-light text-levelup-dark text-xs font-medium px-2 py-1 rounded-full mr-2">
                  Nível {level}
                </div>
                <div className="bg-levelup-light text-levelup-primary text-xs font-medium px-2 py-1 rounded-full flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {streak} dias seguidos
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">XP para o próximo nível</span>
            <span className="text-sm font-medium">{xpToNextLevel.toFixed(0)}%</span>
          </div>
          <div className="levelup-progress mb-4">
            <div 
              className="levelup-progress-bar" 
              style={{ width: `${xpToNextLevel}%` }}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-levelup-light p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <Trophy className="w-4 h-4 text-levelup-accent mr-1" />
                <span className="font-medium">Total de Pontos</span>
              </div>
              <p className="text-lg font-bold">{userData.total_points}</p>
            </div>
            <div className="bg-levelup-light p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="w-4 h-4 text-levelup-accent mr-1" />
                <span className="font-medium">Membro desde</span>
              </div>
              <p className="text-lg font-bold">{formatDate(userData.created_at)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Achievements */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Conquistas</h2>
        <div className="grid grid-cols-2 gap-3">
          {mockAchievements.map(achievement => (
            <div 
              key={achievement.id}
              className={cn(
                "bg-card p-3 rounded-lg shadow-sm flex flex-col items-center text-center",
                !achievement.unlocked && "opacity-50"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                achievement.unlocked ? "bg-levelup-accent text-white" : "bg-muted text-muted-foreground"
              )}>
                <achievement.icon className="w-6 h-6" />
              </div>
              <h3 className="font-medium text-sm mb-1">{achievement.name}</h3>
              <p className="text-xs text-muted-foreground">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Settings */}
      <div className="px-4">
        <h2 className="text-lg font-bold mb-3">Configurações</h2>
        <div className="bg-card rounded-lg shadow-sm overflow-hidden">
          <button className="w-full p-4 flex items-center border-b hover:bg-muted/20">
            <Bell className="w-5 h-5 text-levelup-primary mr-3" />
            <span>Notificações</span>
          </button>
          <button className="w-full p-4 flex items-center border-b hover:bg-muted/20">
            <Activity className="w-5 h-5 text-levelup-primary mr-3" />
            <span>Integração com Apps de Saúde</span>
          </button>
          <button className="w-full p-4 flex items-center border-b hover:bg-muted/20">
            <Smartphone className="w-5 h-5 text-levelup-primary mr-3" />
            <span>Dispositivos Conectados</span>
          </button>
          <button 
            className="w-full p-4 flex items-center text-levelup-danger hover:bg-muted/20"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
