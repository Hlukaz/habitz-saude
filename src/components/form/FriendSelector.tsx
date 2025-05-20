
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

interface Friend {
  id: string;
  name: string;
  avatar: string;
}

interface FriendSelectorProps {
  selectedFriends: string[];
  onFriendsChange: (friends: string[]) => void;
}

const FriendSelector = ({ selectedFriends, onFriendsChange }: FriendSelectorProps) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // Mock friends (you would fetch this from your backend in a real app)
  const mockFriends = [
    { id: 'friend-1', name: 'Ana Silva', avatar: 'https://source.unsplash.com/random/100x100/?woman' },
    { id: 'friend-2', name: 'Carlos Gomes', avatar: 'https://source.unsplash.com/random/100x100/?man' },
    { id: 'friend-3', name: 'Patricia Lima', avatar: 'https://source.unsplash.com/random/100x100/?woman,2' },
    { id: 'friend-4', name: 'Marcelo Costa', avatar: 'https://source.unsplash.com/random/100x100/?man,2' }
  ];

  const toggleFriendSelection = (friendId: string) => {
    if (selectedFriends.includes(friendId)) {
      onFriendsChange(selectedFriends.filter(id => id !== friendId));
    } else {
      onFriendsChange([...selectedFriends, friendId]);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Convidar Amigos</Label>
      <div className="flex gap-2">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Users className="w-4 h-4 mr-2" />
              Selecionar Amigos
              {selectedFriends.length > 0 && ` (${selectedFriends.length})`}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Selecionar Amigos</DialogTitle>
              <DialogDescription>
                Escolha os amigos que deseja convidar para o desafio.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {mockFriends.map(friend => (
                <div 
                  key={friend.id} 
                  className={cn(
                    "flex items-center p-3 rounded-md border cursor-pointer",
                    selectedFriends.includes(friend.id) 
                      ? "border-levelup-primary bg-levelup-primary/10" 
                      : "border-gray-200"
                  )}
                  onClick={() => toggleFriendSelection(friend.id)}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="flex-1">{friend.name}</span>
                  <div className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center",
                    selectedFriends.includes(friend.id) 
                      ? "border-levelup-primary bg-levelup-primary text-white" 
                      : "border-gray-300"
                  )}>
                    {selectedFriends.includes(friend.id) && <Check className="w-3 h-3" />}
                  </div>
                </div>
              ))}
              <Button 
                className="w-full mt-4" 
                onClick={() => setDialogOpen(false)}
              >
                Confirmar ({selectedFriends.length} selecionados)
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Button variant="outline">
          <Share2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default FriendSelector;
