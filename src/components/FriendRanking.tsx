
import React from 'react';
import { Trophy, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FriendData {
  id: string;
  name: string;
  avatarUrl: string;
  points: number;
  position: number;
  positionChange?: 'up' | 'down' | 'same';
}

interface FriendRankingProps {
  friends: FriendData[];
  currentUserId: string;
  className?: string;
}

const FriendRanking = ({ friends, currentUserId, className }: FriendRankingProps) => {
  const positionIcon = (change?: 'up' | 'down' | 'same') => {
    if (change === 'up') return <ArrowUp className="w-4 h-4 text-levelup-success" />;
    if (change === 'down') return <ArrowDown className="w-4 h-4 text-levelup-danger" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  // Sort friends by points
  const sortedFriends = [...friends].sort((a, b) => b.points - a.points);

  return (
    <div className={cn("bg-card rounded-xl p-4 shadow-sm", className)}>
      <div className="flex items-center mb-4">
        <Trophy className="w-5 h-5 text-levelup-accent mr-2" />
        <h3 className="font-bold text-lg">Ranking de Amigos</h3>
      </div>

      <div className="space-y-3">
        {sortedFriends.map((friend) => (
          <div 
            key={friend.id}
            className={cn(
              "flex items-center p-3 rounded-lg",
              friend.id === currentUserId ? "bg-levelup-light border border-levelup-primary" : "hover:bg-muted/50"
            )}
          >
            <div className="w-7 text-center font-bold text-muted-foreground">
              {friend.position}
            </div>
            
            <div className="w-10 h-10 rounded-full overflow-hidden mx-3">
              <img 
                src={friend.avatarUrl || "/placeholder.svg"} 
                alt={friend.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <p className={cn(
                "font-medium", 
                friend.id === currentUserId ? "text-levelup-primary" : ""
              )}>
                {friend.name} {friend.id === currentUserId && "(Você)"}
              </p>
            </div>
            
            <div className="flex items-center">
              <span className="font-bold mr-1">{friend.points}</span>
              <span className="text-sm text-muted-foreground mr-2">pts</span>
              {positionIcon(friend.positionChange)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendRanking;
