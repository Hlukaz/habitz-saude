
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Type definitions for friend requests and friends
export interface FriendRequest {
  id: string;
  name: string;
  userId: string;
  avatarUrl: string | null;
}

export interface Friend {
  id: string;
  userId: string;
  name: string;
  weeklyPoints: number;
  avatarUrl: string | null;
}

export interface SearchUserResult {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
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
      .select('id, username, full_name, avatar_url')
      .eq('id', friendship.friend_id)
      .single();
      
    if (friendError) continue;
    
    // Buscar pontos semanais da atividade
    const { data: activityPoints, error: activityError } = await supabase
      .from('user_activity_points')
      .select('points')
      .eq('user_id', friendship.friend_id);
    
    // Calcular pontos totais da semana
    let weeklyPoints = 0;
    if (!activityError && activityPoints) {
      weeklyPoints = activityPoints.reduce((total, item) => total + (item.points || 0), 0);
    }
    
    friends.push({
      id: friendship.id,
      userId: friendData.id,
      name: friendData.full_name || friendData.username,
      weeklyPoints,
      avatarUrl: friendData.avatar_url
    });
  }
  
  return friends;
};

// Função para buscar um usuário por email ou username
const searchUser = async (query: string, currentUserId: string): Promise<SearchUserResult[]> => {
  if (!query || query.length < 3) return [];
  
  // Buscar por email ou username
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, email')
    .or(`username.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(5);
    
  if (error) throw error;
  // Remover o usuário atual da lista
  return data?.filter(result => result.id !== currentUserId) || [];
};

// Função para enviar email de convite
const sendFriendRequestEmail = async (receiverId: string, requestId: string, senderName: string) => {
  const appUrl = window.location.origin;
  
  const { data: tokenData } = await supabase.auth.getSession();

  const response = await fetch(`${window.location.origin}/functions/v1/send-friend-request-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenData.session?.access_token}`
    },
    body: JSON.stringify({
      receiverId,
      requestId,
      senderName,
      appUrl
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro ao enviar e-mail de convite');
  }
  
  return await response.json();
};

export const useFriends = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [shareUrl, setShareUrl] = useState('');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchUserResult[]>([]);

  // Queries para buscar solicitações e amigos
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
      if (!user?.id) throw new Error('Usuário não autenticado');

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
        .eq('friend_id', user.id)
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

  // Send friend request mutation
  const sendRequestMutation = useMutation({
    mutationFn: async (friendId: string) => {
      if (!user?.id) throw new Error('Usuário não autenticado');
      
      // Verificar se já existe um pedido pendente
      const { data: existingRequest, error: checkError } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('sender_id', user.id)
        .eq('receiver_id', friendId)
        .eq('status', 'pending');
      
      if (checkError) throw checkError;
      
      if (existingRequest && existingRequest.length > 0) {
        throw new Error('Você já enviou uma solicitação para este usuário');
      }
      
      // Verificar se já são amigos
      const { data: existingFriendship, error: friendshipError } = await supabase
        .from('friendships')
        .select('*')
        .eq('user_id', user.id)
        .eq('friend_id', friendId);
      
      if (friendshipError) throw friendshipError;
      
      if (existingFriendship && existingFriendship.length > 0) {
        throw new Error('Vocês já são amigos');
      }
      
      // Criar pedido de amizade
      const { data: requestData, error } = await supabase
        .from('friend_requests')
        .insert({ sender_id: user.id, receiver_id: friendId })
        .select()
        .single();
      
      if (error) throw error;

      // Buscar dados do perfil para enviar email
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, username')
        .eq('id', user.id)
        .single();
      
      const senderName = profile?.full_name || profile?.username || 'Um usuário';
      
      // Enviar email de convite
      try {
        await sendFriendRequestEmail(friendId, requestData.id, senderName);
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
        // Não falha o processo se o email falhar
      }
      
      return requestData;
    },
    onSuccess: (data) => {
      // Gerar URL para compartilhar
      const baseUrl = window.location.origin;
      const inviteLink = `${baseUrl}/confirm-friend?requestId=${data.id}`;
      setShareUrl(inviteLink);
      setInviteDialogOpen(true);
      
      toast.success('Solicitação de amizade enviada!');
      setSearchResults([]);
    },
    onError: (error: any) => {
      console.error('Erro ao enviar solicitação:', error);
      toast.error(error.message || 'Erro ao enviar solicitação de amizade');
    }
  });

  // Handle user search
  const handleSearch = async (query: string): Promise<SearchUserResult[]> => {
    if (!user?.id) return [];
    
    try {
      const results = await searchUser(query, user.id);
      return results;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast.error('Erro ao buscar usuários');
      return [];
    }
  };

  // Generate invite link
  const generateInviteLink = () => {
    if (!user?.id) return '';
    
    const baseUrl = window.location.origin;
    const inviteLink = `${baseUrl}/invite?id=${user.id}`;
    setShareUrl(inviteLink);
    return inviteLink;
  };

  // Share invite link via WhatsApp
  const shareViaWhatsApp = () => {
    const inviteLink = generateInviteLink();
    if (!inviteLink) return;
    
    const whatsappUrl = `https://wa.me/?text=Olá! Estou te convidando para ser meu amigo no Habitz. Clique no link para aceitar: ${encodeURIComponent(inviteLink)}`;
    window.open(whatsappUrl, '_blank');
  };

  return {
    friends,
    friendRequests,
    isLoadingFriends,
    isLoadingRequests,
    acceptRequestMutation,
    rejectRequestMutation,
    removeFriendMutation,
    sendRequestMutation,
    handleSearch,
    shareViaWhatsApp,
    shareUrl,
    setShareUrl,
    inviteDialogOpen,
    setInviteDialogOpen,
  };
};
