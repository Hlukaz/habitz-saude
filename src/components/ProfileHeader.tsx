
import React from 'react';
import { Camera } from 'lucide-react';
import { Flame } from 'lucide-react';
import { UserProfile } from '@/hooks/useProfileData';

interface ProfileHeaderProps {
  userData: UserProfile;
  userEmail: string | undefined;
  level: number;
  xpToNextLevel: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  userData, 
  userEmail, 
  level, 
  xpToNextLevel 
}) => {
  return (
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
          <p className="text-muted-foreground">{userEmail}</p>
          <div className="flex items-center mt-1">
            <div className="bg-levelup-light text-levelup-dark text-xs font-medium px-2 py-1 rounded-full mr-2">
              Nível {level}
            </div>
            <div className="bg-levelup-light text-levelup-primary text-xs font-medium px-2 py-1 rounded-full flex items-center">
              <Flame className="w-3 h-3 mr-1" />
              {userData.streak} dias seguidos
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
      
      <PointsSummary totalPoints={userData.total_points} createdAt={userData.created_at} />
    </div>
  );
};

interface PointsSummaryProps {
  totalPoints: number;
  createdAt: string;
}

const PointsSummary: React.FC<PointsSummaryProps> = ({ totalPoints, createdAt }) => {
  // Formatar a data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-levelup-light p-3 rounded-lg">
        <div className="flex items-center mb-2">
          <Trophy className="w-4 h-4 text-levelup-accent mr-1" />
          <span className="font-medium">Total de Pontos</span>
        </div>
        <p className="text-lg font-bold">{totalPoints}</p>
      </div>
      <div className="bg-levelup-light p-3 rounded-lg">
        <div className="flex items-center mb-2">
          <Calendar className="w-4 h-4 text-levelup-accent mr-1" />
          <span className="font-medium">Membro desde</span>
        </div>
        <p className="text-lg font-bold">{formatDate(createdAt)}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;

import { Trophy, Calendar } from 'lucide-react';
