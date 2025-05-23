
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Import newly created components
import InviteDetails from '@/components/invite/InviteDetails';
import AuthTabs from '@/components/invite/AuthTabs';

const InvitePage = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [inviterDetails, setInviterDetails] = useState<{
    name: string;
    avatarUrl: string | null;
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyFriends, setAlreadyFriends] = useState(false);
  const [alreadyRequested, setAlreadyRequested] = useState(false);
  
  // States for the auth forms
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedTab, setSelectedTab] = useState('login');

  const inviterId = searchParams.get('id');

  useEffect(() => {
    const checkInvitation = async () => {
      if (!inviterId) {
        setError("Convite inválido.");
        setLoading(false);
        return;
      }

      try {
        // Fetch inviter details
        const { data: inviterData, error: inviterError } = await supabase
          .from('profiles')
          .select('full_name, username, avatar_url')
          .eq('id', inviterId)
          .single();

        if (inviterError || !inviterData) {
          setError("Usuário não encontrado.");
          setLoading(false);
          return;
        }

        setInviterDetails({
          name: inviterData.full_name || inviterData.username,
          avatarUrl: inviterData.avatar_url
        });

        // Se o usuário já está logado, verifica se já são amigos
        if (user) {
          if (inviterId === user.id) {
            setError("Você não pode adicionar a si mesmo como amigo.");
            setLoading(false);
            return;
          }

          // Check if they are already friends
          const { data: existingFriendship, error: friendshipError } = await supabase
            .from('friendships')
            .select('id')
            .eq('user_id', user.id)
            .eq('friend_id', inviterId);

          if (!friendshipError && existingFriendship && existingFriendship.length > 0) {
            setAlreadyFriends(true);
          }

          // Check if there's already a pending request
          const { data: existingRequest, error: requestError } = await supabase
            .from('friend_requests')
            .select('id, status')
            .or(`(sender_id.eq.${user.id}.and.receiver_id.eq.${inviterId}),(sender_id.eq.${inviterId}.and.receiver_id.eq.${user.id})`)
            .eq('status', 'pending');

          if (!requestError && existingRequest && existingRequest.length > 0) {
            setAlreadyRequested(true);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Error checking invitation:', err);
        setError("Ocorreu um erro ao verificar o convite.");
        setLoading(false);
      }
    };

    checkInvitation();
  }, [inviterId, user]);

  const handleAcceptInvitation = async () => {
    if (!user || !inviterId) return;
    
    setAccepting(true);
    
    try {
      // Create a friend request
      const { error } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: user.id,
          receiver_id: inviterId,
          status: 'pending'
        });

      if (error) {
        throw error;
      }

      toast.success('Solicitação de amizade enviada!');
      setTimeout(() => {
        navigate('/friends');
      }, 2000);
    } catch (err) {
      console.error('Error accepting invitation:', err);
      toast.error('Erro ao enviar solicitação. Tente novamente.');
      setAccepting(false);
    }
  };

  const navigateToFriends = () => navigate('/friends');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 flex items-center border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)} 
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Convite de Amizade</h1>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="h-10 w-10 border-4 border-t-transparent border-primary rounded-full animate-spin mb-4"></div>
            <p>Verificando convite...</p>
          </div>
        ) : user ? (
          <InviteDetails 
            inviterName={inviterDetails?.name || ''}
            inviterAvatarUrl={inviterDetails?.avatarUrl}
            error={error}
            alreadyFriends={alreadyFriends}
            alreadyRequested={alreadyRequested}
            onActionClick={handleAcceptInvitation}
            accepting={accepting}
            navigateToFriends={navigateToFriends}
          />
        ) : (
          <div className="mt-6">
            <div className="text-center mb-4">
              <p className="font-medium">Entre na sua conta ou crie uma nova para aceitar o convite</p>
            </div>
            <AuthTabs 
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              username={username}
              setUsername={setUsername}
              inviterId={inviterId}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitePage;
