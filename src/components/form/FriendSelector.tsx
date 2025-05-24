
import React from 'react';
import { Users, Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { useFriendsList } from '@/hooks/friends/useFriendsList';

interface FriendSelectorProps {
  selectedFriends: string[];
  onFriendsChange: (friends: string[]) => void;
}

const FriendSelector = ({ selectedFriends, onFriendsChange }: FriendSelectorProps) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { friends, isLoadingFriends } = useFriendsList();

  const toggleFriendSelection = (friendId: string) => {
    if (selectedFriends.includes(friendId)) {
      onFriendsChange(selectedFriends.filter(id => id !== friendId));
    } else {
      onFriendsChange([...selectedFriends, friendId]);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Convidar Amigos</Label>
      <div className="flex gap-2">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1 text-sm px-3 py-2">
              <Users className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {selectedFriends.length > 0 ? `${selectedFriends.length} selecionados` : 'Selecionar'}
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg">Convidar Amigos</DialogTitle>
              <DialogDescription className="text-sm">
                Escolha os amigos para o desafio.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-4 max-h-60 overflow-y-auto">
              {isLoadingFriends ? (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  Carregando amigos...
                </div>
              ) : friends.length === 0 ? (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  Você ainda não tem amigos adicionados.
                </div>
              ) : (
                friends.map(friend => (
                  <div 
                    key={friend.userId} 
                    className={cn(
                      "flex items-center p-3 rounded-md border cursor-pointer transition-colors",
                      selectedFriends.includes(friend.userId) 
                        ? "border-levelup-primary bg-levelup-primary/10" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => toggleFriendSelection(friend.userId)}
                  >
                    <div className="w-8 h-8 rounded-full bg-levelup-primary/20 flex items-center justify-center mr-3 flex-shrink-0">
                      {friend.avatarUrl ? (
                        <img src={friend.avatarUrl} alt={friend.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <span className="text-xs font-medium text-levelup-primary">
                          {friend.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="flex-1 text-sm font-medium truncate">{friend.name}</span>
                    <div className={cn(
                      "w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0",
                      selectedFriends.includes(friend.userId) 
                        ? "border-levelup-primary bg-levelup-primary text-white" 
                        : "border-gray-300"
                    )}>
                      {selectedFriends.includes(friend.userId) && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={() => setDialogOpen(false)}
            >
              Confirmar ({selectedFriends.length} selecionados)
            </Button>
          </DialogContent>
        </Dialog>
        <Button variant="outline" size="icon" className="flex-shrink-0">
          <Share2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default FriendSelector;
