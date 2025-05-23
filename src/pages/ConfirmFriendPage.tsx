
import React from 'react';
import { useConfirmFriendRequest } from '@/hooks/friends/useConfirmFriendRequest';
import ConfirmFriendStatus from '@/components/friends/ConfirmFriendStatus';

const ConfirmFriendPage = () => {
  const { isLoading, error, success, senderName, navigateToFriends } = useConfirmFriendRequest();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-levelup-dark text-center mb-6">Pedido de Amizade</h1>
        <ConfirmFriendStatus
          isLoading={isLoading}
          error={error}
          success={success}
          senderName={senderName}
          onNavigateToFriends={navigateToFriends}
        />
      </div>
    </div>
  );
};

export default ConfirmFriendPage;
