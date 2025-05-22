
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Friend {
  id: string;
  userId: string;
  name: string;
  weeklyPoints: number;
  avatarUrl: string | null;
}

interface FriendsListProps {
  friends: Friend[];
  isLoading: boolean;
  searchTerm: string;
  onRemoveFriend: (params: { friendshipId: string, friendId: string }) => void;
  removeFriendMutationIsPending: boolean;
}

const FriendsList = ({ 
  friends, 
  isLoading, 
  searchTerm, 
  onRemoveFriend,
  removeFriendMutationIsPending
}: FriendsListProps) => {
  // Filter friends by search term
  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-lg font-bold mb-3">Seus Amigos</h2>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Carregando amigos...</p>
        </div>
      ) : filteredFriends.length > 0 ? (
        <div className="space-y-3">
          {filteredFriends.map(friend => (
            <div 
              key={friend.id}
              className="bg-card p-3 rounded-lg shadow-sm flex items-center hover:shadow-md transition-shadow"
            >
              <img
                src={friend.avatarUrl || 'https://source.unsplash.com/random/100x100/?person'}
                alt={friend.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-3 flex-1">
                <p className="font-medium">{friend.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end mr-2">
                  <span className="font-bold text-levelup-primary">{friend.weeklyPoints}</span>
                  <span className="text-xs text-muted-foreground">pontos esta semana</span>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-levelup-danger">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover amigo</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja remover {friend.name} da sua lista de amigos?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onRemoveFriend({ 
                          friendshipId: friend.id, 
                          friendId: friend.userId 
                        })}
                        className="bg-levelup-danger hover:bg-levelup-danger/90"
                        disabled={removeFriendMutationIsPending}
                      >
                        Remover
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>Você ainda não tem amigos na sua lista.</p>
          <p className="mt-2">Convide alguém usando o botão acima!</p>
        </div>
      )}
    </div>
  );
};

export default FriendsList;
