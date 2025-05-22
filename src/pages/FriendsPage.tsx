
import React, { useState } from 'react';
import { Search, Share2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddFriendDialog from '@/components/friends/AddFriendDialog';
import FriendsList from '@/components/friends/FriendsList';
import FriendRequestsList from '@/components/friends/FriendRequestsList';
import ShareInviteDialog from '@/components/friends/ShareInviteDialog';
import { useFriends } from '@/hooks/useFriends';

const FriendsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const {
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
    inviteDialogOpen,
    setInviteDialogOpen,
  } = useFriends();

  const handleSendRequest = async (userId: string) => {
    await sendRequestMutation.mutateAsync(userId);
  };

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
      <div className="px-4">
        <FriendRequestsList 
          requests={friendRequests} 
          onAccept={(requestId) => acceptRequestMutation.mutate(requestId)}
          onReject={(requestId) => rejectRequestMutation.mutate(requestId)}
          acceptPending={acceptRequestMutation.isPending}
          rejectPending={rejectRequestMutation.isPending}
        />
      </div>
      
      {/* Add Friends */}
      <div className="px-4 mb-5">
        <div className="mb-3">
          <AddFriendDialog
            onSendRequest={handleSendRequest}
            onSearch={handleSearch}
            isPending={sendRequestMutation.isPending}
          />
        </div>
        
        <button 
          className="w-full py-3 bg-levelup-secondary text-white rounded-lg flex items-center justify-center font-medium mb-3"
          onClick={shareViaWhatsApp}
        >
          <Share2 className="w-5 h-5 mr-2" />
          Convidar Amigos via WhatsApp
        </button>
      </div>
      
      {/* Link de convite dialog */}
      <ShareInviteDialog 
        shareUrl={shareUrl}
        isOpen={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
      />
      
      {/* Friends List */}
      <div className="px-4">
        <FriendsList 
          friends={friends} 
          isLoading={isLoadingFriends}
          searchTerm={searchTerm}
          onRemoveFriend={(params) => removeFriendMutation.mutate(params)}
          removeFriendMutationIsPending={removeFriendMutation.isPending}
        />
      </div>
    </div>
  );
};

export default FriendsPage;
