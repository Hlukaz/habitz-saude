
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { fetchFriendRequests, sendFriendRequestEmail, searchUser } from '@/api/friendsApi';
import { SearchUserResult } from '@/types/friendTypes';
import { useAuth } from '@/context/AuthContext';

export const useFriendRequests = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchResults, setSearchResults] = useState<SearchUserResult[]>([]);

  // Query to fetch friend requests
  const { data: friendRequests = [], isLoading: isLoadingRequests } = useQuery({
    queryKey: ['friendRequests', user?.id],
    queryFn: () => user?.id ? fetchFriendRequests(user.id) : Promise.resolve([]),
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

  // Send friend request mutation
  const sendRequestMutation = useMutation({
    mutationFn: async (friendId: string) => {
      if (!user?.id) throw new Error('Usuário não autenticado');
      
      // Check for existing pending request
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
      
      // Check if already friends
      const { data: existingFriendship, error: friendshipError } = await supabase
        .from('friendships')
        .select('*')
        .eq('user_id', user.id)
        .eq('friend_id', friendId);
      
      if (friendshipError) throw friendshipError;
      
      if (existingFriendship && existingFriendship.length > 0) {
        throw new Error('Vocês já são amigos');
      }
      
      // Create friend request
      const { data: requestData, error } = await supabase
        .from('friend_requests')
        .insert({ sender_id: user.id, receiver_id: friendId })
        .select()
        .single();
      
      if (error) throw error;

      // Get profile data to send email
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, username')
        .eq('id', user.id)
        .single();
      
      const senderName = profile?.full_name || profile?.username || 'Um usuário';
      
      // Send invitation email
      try {
        await sendFriendRequestEmail(friendId, requestData.id, senderName);
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
        // Don't fail the process if email sending fails
      }
      
      return requestData;
    },
    onSuccess: (data) => {
      setSearchResults([]);
      return data;
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

  return {
    friendRequests,
    isLoadingRequests,
    acceptRequestMutation,
    rejectRequestMutation,
    sendRequestMutation,
    handleSearch,
    searchResults,
    setSearchResults
  };
};
