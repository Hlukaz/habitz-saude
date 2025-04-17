
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserPlus, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const inviterId = searchParams.get('id');

  useEffect(() => {
    const checkInvitation = async () => {
      if (!inviterId || !user) {
        setLoading(false);
        return;
      }

      if (inviterId === user.id) {
        setError("Você não pode adicionar a si mesmo como amigo.");
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
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p>Verificando convite...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => navigate('/friends')}>
              Voltar para a lista de amigos
            </Button>
          </div>
        ) : alreadyFriends ? (
          <div className="text-center">
            <p className="text-lg mb-4">Você e {inviterDetails?.name} já são amigos!</p>
            <Button onClick={() => navigate('/friends')}>
              Ver lista de amigos
            </Button>
          </div>
        ) : alreadyRequested ? (
          <div className="text-center">
            <p className="text-lg mb-4">Já existe uma solicitação de amizade pendente.</p>
            <Button onClick={() => navigate('/friends')}>
              Ver solicitações
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-6 flex flex-col items-center">
              <img
                src={inviterDetails?.avatarUrl || 'https://source.unsplash.com/random/100x100/?person'}
                alt={inviterDetails?.name || 'User'}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <h2 className="text-xl font-bold mb-2">{inviterDetails?.name}</h2>
              <p className="text-muted-foreground">Quer se conectar com você no LevelUp</p>
            </div>
            
            <div className="flex justify-center">
              <Button
                onClick={handleAcceptInvitation}
                disabled={accepting}
                className="bg-levelup-primary hover:bg-levelup-primary/90"
              >
                {accepting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <UserPlus className="h-5 w-5 mr-2" />
                )}
                Enviar solicitação de amizade
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitePage;
