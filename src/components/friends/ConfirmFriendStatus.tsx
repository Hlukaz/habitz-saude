
import React from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConfirmFriendStatusProps {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  senderName: string | null;
  onNavigateToFriends: () => void;
}

const ConfirmFriendStatus = ({
  isLoading,
  error,
  success,
  senderName,
  onNavigateToFriends
}: ConfirmFriendStatusProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-12 w-12 text-levelup-primary animate-spin mb-4" />
        <p className="text-lg text-center">Processando pedido de amizade...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <div className="rounded-full bg-red-100 p-3 mb-4">
          <X className="h-10 w-10 text-levelup-danger" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Não foi possível aceitar o pedido</h2>
        <p className="text-center text-gray-600 mb-6">{error}</p>
        <Button 
          onClick={onNavigateToFriends} 
          className="w-full bg-levelup-primary"
        >
          Ir para página de amigos
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="rounded-full bg-green-100 p-3 mb-4">
        <Check className="h-10 w-10 text-levelup-success" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Amizade aceita!</h2>
      <p className="text-center text-gray-600 mb-6">
        {senderName ? `Você e ${senderName} agora são amigos.` : 'Pedido de amizade aceito com sucesso.'}
      </p>
      <Button 
        onClick={onNavigateToFriends} 
        className="w-full bg-levelup-primary"
      >
        Ver meus amigos
      </Button>
    </div>
  );
};

export default ConfirmFriendStatus;
