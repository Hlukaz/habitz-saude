
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { fetchFriends } from '@/api/friendsApi';
import { useAuth } from '@/context/AuthContext';

export const useFriendsList = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query to fetch friends
  const { data: friends = [], isLoading: isLoadingFriends } = useQuery({
    queryKey: ['friends', user?.id],
    queryFn: () => user?.id ? fetchFriends(user.id) : Promise.resolve([]),
    enabled: !!user?.id
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

  return {
    friends,
    isLoadingFriends,
    removeFriendMutation
  };
};
