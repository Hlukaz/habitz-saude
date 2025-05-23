
import { useFriendsList } from './friends/useFriendsList';
import { useFriendRequests } from './friends/useFriendRequests';
import { useShareFriendInvite } from './friends/useShareFriendInvite';
import { useAuth } from '@/context/AuthContext';

export type { Friend, FriendRequest, SearchUserResult } from '@/types/friendTypes';

export const useFriends = () => {
  const { user } = useAuth();
  
  // Use smaller hooks
  const { friends, isLoadingFriends, removeFriendMutation } = useFriendsList();
  const { 
    friendRequests, 
    isLoadingRequests, 
    acceptRequestMutation,
    rejectRequestMutation,
    sendRequestMutation,
    handleSearch
  } = useFriendRequests();
  const { 
    shareUrl, 
    setShareUrl, 
    inviteDialogOpen, 
    setInviteDialogOpen,
    shareViaWhatsApp 
  } = useShareFriendInvite();
  
  // Modified sendRequest to update share dialog
  const sendRequest = async (friendId: string) => {
    try {
      const data = await sendRequestMutation.mutateAsync(friendId);
      
      // Generate URL to share
      const baseUrl = window.location.origin;
      const inviteLink = `${baseUrl}/confirm-friend?requestId=${data.id}`;
      setShareUrl(inviteLink);
      setInviteDialogOpen(true);
      
      return data;
    } catch (error) {
      // Error handling is done in the mutation
      throw error;
    }
  };

  return {
    friends,
    friendRequests,
    isLoadingFriends,
    isLoadingRequests,
    acceptRequestMutation,
    rejectRequestMutation,
    removeFriendMutation,
    sendRequestMutation: {
      ...sendRequestMutation,
      mutateAsync: sendRequest
    },
    handleSearch,
    shareViaWhatsApp: () => shareViaWhatsApp(user?.id),
    shareUrl,
    setShareUrl,
    inviteDialogOpen,
    setInviteDialogOpen,
  };
};
