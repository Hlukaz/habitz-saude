
import React from 'react';

interface InviteDetailsProps {
  inviterName: string;
  inviterAvatarUrl: string | null;
  error: string | null;
  alreadyFriends: boolean;
  alreadyRequested: boolean;
  onActionClick: () => void;
  accepting: boolean;
  navigateToFriends: () => void;
}

const InviteDetails = ({
  inviterName,
  inviterAvatarUrl,
  error,
  alreadyFriends,
  alreadyRequested,
  onActionClick,
  accepting,
  navigateToFriends
}: InviteDetailsProps) => {
  if (error) {
    return (
      <div className="text-center">
        <p className="text-destructive mb-4">{error}</p>
        <button 
          onClick={navigateToFriends} 
          className="bg-levelup-primary text-white px-4 py-2 rounded-lg"
        >
          Voltar para a lista de amigos
        </button>
      </div>
    );
  }

  if (alreadyFriends) {
    return (
      <div className="text-center">
        <p className="text-lg mb-4">Você e {inviterName} já são amigos!</p>
        <button 
          onClick={navigateToFriends}
          className="bg-levelup-primary text-white px-4 py-2 rounded-lg"
        >
          Ver lista de amigos
        </button>
      </div>
    );
  }

  if (alreadyRequested) {
    return (
      <div className="text-center">
        <p className="text-lg mb-4">Já existe uma solicitação de amizade pendente.</p>
        <button 
          onClick={navigateToFriends}
          className="bg-levelup-primary text-white px-4 py-2 rounded-lg"
        >
          Ver solicitações
        </button>
      </div>
    );
  }

  return (
    <div className="text-center w-full max-w-md">
      <div className="mb-6 flex flex-col items-center">
        <img
          src={inviterAvatarUrl || 'https://source.unsplash.com/random/100x100/?person'}
          alt={inviterName || 'User'}
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
        <h2 className="text-xl font-bold mb-2">{inviterName}</h2>
        <p className="text-muted-foreground">Quer se conectar com você no Habitz</p>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={onActionClick}
          disabled={accepting}
          className="bg-levelup-primary hover:bg-levelup-primary/90 text-white px-4 py-2 rounded-lg flex items-center"
        >
          {accepting ? (
            <div className="h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          )}
          Enviar solicitação de amizade
        </button>
      </div>
    </div>
  );
};

export default InviteDetails;
