
import React, { useState } from 'react';
import { Camera, Trophy, Calendar } from 'lucide-react';
import { UserProfile } from '@/types/userProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useQueryClient } from '@tanstack/react-query';

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
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você precisa selecionar uma imagem para fazer upload');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userData.id}-${Math.random()}.${fileExt}`;

      // Upload da imagem para o Storage do Supabase
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Pega a URL pública da imagem
      const { data: publicURLData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!publicURLData.publicUrl) {
        throw new Error('Erro ao obter URL pública da imagem');
      }

      // Atualiza o perfil do usuário com a nova URL de avatar
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicURLData.publicUrl })
        .eq('id', userData.id);

      if (updateError) {
        throw updateError;
      }

      // Invalidar consultas para atualizar UI
      queryClient.invalidateQueries({ queryKey: ['userProfile', userData.id] });
      
      toast.success('Foto de perfil atualizada com sucesso');
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast.error(error.message || 'Erro ao atualizar foto de perfil');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-card rounded-xl p-5 shadow-sm">
      <div className="flex items-center mb-4">
        <div className="relative">
          <Avatar className="w-20 h-20">
            {userData.avatar_url ? (
              <AvatarImage src={userData.avatar_url} alt={userData.full_name} className="object-cover" />
            ) : (
              <AvatarFallback className="bg-levelup-light text-levelup-primary">
                {userData.full_name ? userData.full_name.substring(0, 2).toUpperCase() : 'US'}
              </AvatarFallback>
            )}
          </Avatar>
          <label 
            htmlFor="avatar-upload" 
            className="absolute bottom-0 right-0 w-8 h-8 bg-levelup-primary rounded-full flex items-center justify-center text-white shadow-sm cursor-pointer hover:bg-levelup-primary/90 transition-colors"
          >
            <Camera className="w-4 h-4" />
            <input 
              id="avatar-upload" 
              type="file" 
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-bold">{userData.full_name}</h2>
          <p className="text-muted-foreground">{userEmail}</p>
          <div className="flex items-center mt-1">
            <div className="bg-levelup-light text-levelup-dark text-xs font-medium px-2 py-1 rounded-full mr-2">
              Nível {level}
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
      
      <PointsSummary totalPoints={userData.total_points || 0} createdAt={userData.created_at} />
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
