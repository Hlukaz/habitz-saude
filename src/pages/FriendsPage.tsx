
import React, { useState } from 'react';
import { Search, UserPlus, Check, X, Share2, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
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
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Type definitions for friend requests and friends
interface FriendRequest {
  id: string;
  name: string;
  userId: string;
  avatarUrl: string | null;
}

interface Friend {
  id: string;
  userId: string;
  name: string;
  totalPoints: number;
  weeklyPoints: number;
  avatarUrl: string | null;
}

// Function to fetch friend requests
const fetchFriendRequests = async (userId: string): Promise<FriendRequest[]> => {
  const { data, error } = await supabase
    .from('friend_requests')
    .select(`
      id,
      sender_id,
      receiver_id
    `)
    .eq('receiver_id', userId)
    .eq('status', 'pending');
    
  if (error) throw error;
  
  // Now fetch the sender details for each request
  const requests: FriendRequest[] = [];
  
  for (const request of data) {
    const { data: senderData, error: senderError } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .eq('id', request.sender_id)
      .single();
      
    if (senderError) continue;
    
    requests.push({
      id: request.id,
      name: senderData.full_name || senderData.username,
      userId: senderData.id,
      avatarUrl: senderData.avatar_url
    });
  }
  
  return requests;
};

// Function to fetch friends
const fetchFriends = async (userId: string): Promise<Friend[]> => {
  const { data, error } = await supabase
    .from('friendships')
    .select(`
      id,
      friend_id
    `)
    .eq('user_id', userId);
    
  if (error) throw error;
  
  // Now fetch the friend details for each friendship
  const friends: Friend[] = [];
  
  for (const friendship of data) {
    const { data: friendData, error: friendError } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, total_points, activity_points, nutrition_points')
      .eq('id', friendship.friend_id)
      .single();
      
    if (friendError) continue;
    
    friends.push({
      id: friendship.id,
      userId: friendData.id,
      name: friendData.full_name || friendData.username,
      totalPoints: friendData.total_points || 0,
      weeklyPoints: (friendData.activity_points || 0) + (friendData.nutrition_points || 0),
      avatarUrl: friendData.avatar_url
    });
  }
  
  return friends;
};

const FriendsPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  const [shareUrl, setShareUrl] = useState('');

  const { data: friendRequests = [], isLoading: isLoadingRequests } = useQuery({
    queryKey: ['friendRequests', user?.id],
    queryFn: () => user?.id ? fetchFriendRequests(user.id) : Promise.resolve([]),
    enabled: !!user?.id
  });

  const { data: friends = [], isLoading: isLoadingFriends } = useQuery({
    queryKey: ['friends', user?.id],
    queryFn: () => user?.id ? fetchFriends(user.id) : Promise.resolve([]),
    enabled: !!user?.id
  });

  // Accept friend request mutation
  const acceptRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      // First, update the request status to 'accepted'
      const { data: requestData, error: requestUpdateError } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId)
        .select('sender_id, receiver_id')
        .single();
      
      if (requestUpdateError) throw requestUpdateError;
      
      if (!requestData) throw new Error('Request not found');
      
      // Create friendship entries for both users
      const { error: error1 } = await supabase
        .from('friendships')
        .insert({ user_id: requestData.receiver_id, friend_id: requestData.sender_id });
      
      if (error1) throw error1;
      
      const { error: error2 } = await supabase
        .from('friendships')
        .insert({ user_id: requestData.sender_id, friend_id: requestData.receiver_id });
      
      if (error2) throw error2;
      
      return requestId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['friends', user?.id] });
      toast.success('Solicitação de amizade aceita!');
    },
    onError: (error) => {
      console.error('Error accepting friend request:', error);
      toast.error('Erro ao aceitar solicitação. Tente novamente.');
    }
  });

  // Reject friend request mutation
  const rejectRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);
      
      if (error) throw error;
      return requestId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests', user?.id] });
      toast.success('Solicitação rejeitada');
    },
    onError: (error) => {
      console.error('Error rejecting friend request:', error);
      toast.error('Erro ao rejeitar solicitação. Tente novamente.');
    }
  });

  // Remove friend mutation
  const removeFriendMutation = useMutation({
    mutationFn: async (params: { friendshipId: string, friendId: string }) => {
      // Delete the friendship entry
      const { error: error1 } = await supabase
        .from('friendships')
        .delete()
        .eq('id', params.friendshipId);
      
      if (error1) throw error1;
      
      // Find and delete the reverse friendship entry
      const { data: reverseFriendship, error: findError } = await supabase
        .from('friendships')
        .select('id')
        .eq('user_id', params.friendId)
        .eq('friend_id', user?.id)
        .single();
      
      if (!findError && reverseFriendship) {
        const { error: error2 } = await supabase
          .from('friendships')
          .delete()
          .eq('id', reverseFriendship.id);
        
        if (error2) throw error2;
      }
      
      return params.friendshipId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends', user?.id] });
      toast.success('Amigo removido da lista');
    },
    onError: (error) => {
      console.error('Error removing friend:', error);
      toast.error('Erro ao remover amigo. Tente novamente.');
    }
  });

  // Generate invite link
  const generateInviteLink = () => {
    if (!user?.id) return;
    
    const baseUrl = window.location.origin;
    const inviteLink = `${baseUrl}/invite?id=${user.id}`;
    setShareUrl(inviteLink);
    return inviteLink;
  };

  // Share invite link via WhatsApp
  const shareViaWhatsApp = () => {
    const inviteLink = generateInviteLink();
    if (!inviteLink) return;
    
    const whatsappUrl = `https://wa.me/?text=Olá! Estou te convidando para ser meu amigo no LevelUp. Clique no link para aceitar: ${encodeURIComponent(inviteLink)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Filter friends by search term
  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="p-4">
        <h1 className="text-2xl font-bold text-levelup-dark mb-2">Amigos</h1>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar amigos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </header>
      
      {/* Friend Requests */}
      {friendRequests.length > 0 && (
        <div className="px-4 mb-5">
          <h2 className="text-lg font-bold mb-3">Solicitações de Amizade</h2>
          <div className="space-y-3">
            {friendRequests.map(request => (
              <div key={request.id} className="bg-card p-3 rounded-lg shadow-sm flex items-center">
                <img
                  src={request.avatarUrl || 'https://source.unsplash.com/random/100x100/?person'}
                  alt={request.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3 flex-1">
                  <p className="font-medium">{request.name}</p>
                  <p className="text-sm text-muted-foreground">Quer ser seu amigo</p>
                </div>
                <div className="flex">
                  <button 
                    className="w-10 h-10 rounded-full bg-levelup-success text-white flex items-center justify-center mr-2"
                    onClick={() => acceptRequestMutation.mutate(request.id)}
                    disabled={acceptRequestMutation.isPending}
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button 
                    className="w-10 h-10 rounded-full bg-levelup-danger text-white flex items-center justify-center"
                    onClick={() => rejectRequestMutation.mutate(request.id)}
                    disabled={rejectRequestMutation.isPending}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Add Friends */}
      <div className="px-4 mb-5">
        <button 
          className="w-full py-3 bg-levelup-secondary text-white rounded-lg flex items-center justify-center font-medium mb-3"
          onClick={shareViaWhatsApp}
        >
          <Share2 className="w-5 h-5 mr-2" />
          Convidar Amigos via WhatsApp
        </button>
      </div>
      
      {/* Friends List */}
      <div className="px-4">
        <h2 className="text-lg font-bold mb-3">Seus Amigos</h2>
        {isLoadingFriends ? (
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
                  <p className="text-sm text-muted-foreground">
                    {friend.totalPoints} pontos no total
                  </p>
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
                          onClick={() => removeFriendMutation.mutate({ 
                            friendshipId: friend.id, 
                            friendId: friend.userId 
                          })}
                          className="bg-levelup-danger hover:bg-levelup-danger/90"
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
    </div>
  );
};

export default FriendsPage;
