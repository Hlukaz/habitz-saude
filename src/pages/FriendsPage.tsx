
import React from 'react';
import { Search, UserPlus, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for demonstration
const mockFriendRequests = [
  {
    id: 'user-7',
    name: 'Lucas Mendes',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?man,3'
  },
  {
    id: 'user-8',
    name: 'Marina Santos',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?woman,3'
  }
];

const mockFriends = [
  {
    id: 'user-2',
    name: 'Ana Silva',
    totalPoints: 7,
    weeklyPoints: 7,
    avatarUrl: 'https://source.unsplash.com/random/100x100/?woman'
  },
  {
    id: 'user-3',
    name: 'Carlos Gomes',
    totalPoints: 126,
    weeklyPoints: 4,
    avatarUrl: 'https://source.unsplash.com/random/100x100/?man'
  },
  {
    id: 'user-4',
    name: 'Patricia Lima',
    totalPoints: 98,
    weeklyPoints: 3,
    avatarUrl: 'https://source.unsplash.com/random/100x100/?woman,2'
  },
  {
    id: 'user-5',
    name: 'Marcelo Costa',
    totalPoints: 113,
    weeklyPoints: 2,
    avatarUrl: 'https://source.unsplash.com/random/100x100/?man,2'
  }
];

const FriendsPage = () => {
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
            className="w-full pl-10 pr-4 py-2 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </header>
      
      {/* Friend Requests */}
      {mockFriendRequests.length > 0 && (
        <div className="px-4 mb-5">
          <h2 className="text-lg font-bold mb-3">Solicitações de Amizade</h2>
          <div className="space-y-3">
            {mockFriendRequests.map(request => (
              <div key={request.id} className="bg-card p-3 rounded-lg shadow-sm flex items-center">
                <img
                  src={request.avatarUrl}
                  alt={request.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3 flex-1">
                  <p className="font-medium">{request.name}</p>
                  <p className="text-sm text-muted-foreground">Quer ser seu amigo</p>
                </div>
                <div className="flex">
                  <button className="w-10 h-10 rounded-full bg-levelup-success text-white flex items-center justify-center mr-2">
                    <Check className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-levelup-danger text-white flex items-center justify-center">
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
        <button className="w-full py-3 bg-levelup-secondary text-white rounded-lg flex items-center justify-center font-medium">
          <UserPlus className="w-5 h-5 mr-2" />
          Adicionar Novos Amigos
        </button>
      </div>
      
      {/* Friends List */}
      <div className="px-4">
        <h2 className="text-lg font-bold mb-3">Seus Amigos</h2>
        <div className="space-y-3">
          {mockFriends.map(friend => (
            <div 
              key={friend.id}
              className="bg-card p-3 rounded-lg shadow-sm flex items-center hover:shadow-md transition-shadow"
            >
              <img
                src={friend.avatarUrl}
                alt={friend.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-3 flex-1">
                <p className="font-medium">{friend.name}</p>
                <p className="text-sm text-muted-foreground">
                  {friend.totalPoints} pontos no total
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-bold text-levelup-primary">{friend.weeklyPoints}</span>
                <span className="text-xs text-muted-foreground">pontos esta semana</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
