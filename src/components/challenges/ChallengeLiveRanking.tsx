
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Medal, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface RankingUser {
  user_id: string;
  full_name: string;
  avatar_url: string;
  total_points: number;
  rank_position: number;
}

interface ChallengeLiveRankingProps {
  challengeId: string;
}

const ChallengeLiveRanking = ({ challengeId }: ChallengeLiveRankingProps) => {
  const { data: ranking, isLoading } = useQuery({
    queryKey: ['challengeRanking', challengeId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_challenge_live_ranking', {
        challenge_id_param: challengeId
      });

      if (error) throw error;
      return data as RankingUser[];
    },
    refetchInterval: 30000 // Atualiza a cada 30 segundos
  });

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{position}</span>;
    }
  };

  const getRankBadgeColor = (position: number) => {
    switch (position) {
      case 1: return 'bg-yellow-500';
      case 2: return 'bg-gray-400';
      case 3: return 'bg-amber-600';
      default: return 'bg-muted';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg animate-pulse">
            <div className="w-10 h-10 bg-muted-foreground/20 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="w-24 h-4 bg-muted-foreground/20 rounded" />
              <div className="w-16 h-3 bg-muted-foreground/20 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!ranking || ranking.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>Nenhum participante no ranking ainda</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Trophy className="w-4 h-4" />
        Ranking ao Vivo
      </h3>
      
      {ranking.map((user) => (
        <div 
          key={user.user_id} 
          className={`flex items-center gap-3 p-3 rounded-lg border ${
            user.rank_position <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 'bg-card'
          }`}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              {getRankIcon(user.rank_position)}
              <Badge className={`${getRankBadgeColor(user.rank_position)} text-white`}>
                {user.rank_position}°
              </Badge>
            </div>
            
            <Avatar className="w-10 h-10">
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={user.full_name} />
              ) : (
                <AvatarFallback>
                  {user.full_name?.substring(0, 2).toUpperCase() || 'US'}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex-1">
              <p className="font-medium">{user.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {user.total_points} pontos
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChallengeLiveRanking;
