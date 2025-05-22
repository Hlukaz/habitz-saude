
import React from 'react';
import { Check, X } from 'lucide-react';

interface FriendRequest {
  id: string;
  name: string;
  userId: string;
  avatarUrl: string | null;
}

interface FriendRequestsListProps {
  requests: FriendRequest[];
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  acceptPending: boolean;
  rejectPending: boolean;
}

const FriendRequestsList = ({ 
  requests, 
  onAccept, 
  onReject,
  acceptPending,
  rejectPending
}: FriendRequestsListProps) => {
  if (requests.length === 0) return null;
  
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold mb-3">Solicitações de Amizade</h2>
      <div className="space-y-3">
        {requests.map(request => (
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
                onClick={() => onAccept(request.id)}
                disabled={acceptPending}
              >
                <Check className="w-5 h-5" />
              </button>
              <button 
                className="w-10 h-10 rounded-full bg-levelup-danger text-white flex items-center justify-center"
                onClick={() => onReject(request.id)}
                disabled={rejectPending}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendRequestsList;
