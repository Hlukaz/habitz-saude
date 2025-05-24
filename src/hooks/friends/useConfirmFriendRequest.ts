
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useConfirmFriendRequest = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [senderName, setSenderName] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const confirmFriendRequest = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams(location.search);
        const requestId = params.get('requestId');
        
        if (!requestId) {
          setError('Link de convite inválido');
          return;
        }
        
        if (!user) {
          setError('Você precisa estar logado para aceitar pedidos de amizade');
          return;
        }
        
        // Buscar o pedido de amizade
        const { data: requestData, error: requestError } = await supabase
          .from('friend_requests')
          .select('id, sender_id, receiver_id, status')
          .eq('id', requestId)
          .single();
        
        if (requestError || !requestData) {
          console.error('Erro ao buscar pedido de amizade:', requestError);
          setError('Pedido de amizade não encontrado');
          return;
        }
        
        if (requestData.status !== 'pending') {
          setError('Este pedido de amizade já foi processado');
          return;
        }
        
        if (requestData.receiver_id !== user.id) {
          setError('Este pedido de amizade não foi enviado para você');
          return;
        }
        
        // Buscar nome do remetente
        const { data: senderData } = await supabase
          .from('profiles')
          .select('full_name, username')
          .eq('id', requestData.sender_id)
          .single();
          
        if (senderData) {
          setSenderName(senderData.full_name || senderData.username);
        }
        
        // Check if friendship already exists
        const { data: existingFriendship } = await supabase
          .from('friendships')
          .select('id')
          .or(`and(user_id.eq.${requestData.receiver_id},friend_id.eq.${requestData.sender_id}),and(user_id.eq.${requestData.sender_id},friend_id.eq.${requestData.receiver_id})`)
          .limit(1);
        
        // Atualizar status do pedido
        const { error: updateError } = await supabase
          .from('friend_requests')
          .update({ status: 'accepted' })
          .eq('id', requestId);
        
        if (updateError) {
          console.error('Erro ao aceitar pedido:', updateError);
          setError('Erro ao aceitar pedido de amizade');
          return;
        }
        
        // Only create friendships if they don't already exist
        if (!existingFriendship || existingFriendship.length === 0) {
          // Criar relações de amizade para ambos os usuários
          const { error: error1 } = await supabase
            .from('friendships')
            .insert({ user_id: requestData.receiver_id, friend_id: requestData.sender_id });
          
          const { error: error2 } = await supabase
            .from('friendships')
            .insert({ user_id: requestData.sender_id, friend_id: requestData.receiver_id });
          
          if (error1 || error2) {
            console.error('Erro ao criar amizade:', error1 || error2);
            setError('Erro ao adicionar amigo');
            return;
          }
        }
        
        setSuccess(true);
        toast.success('Pedido de amizade aceito com sucesso!');
      } catch (err) {
        console.error('Erro ao processar pedido:', err);
        setError('Ocorreu um erro ao processar o pedido de amizade');
      } finally {
        setIsLoading(false);
      }
    };
    
    confirmFriendRequest();
  }, [location, user]);

  const navigateToFriends = () => navigate('/friends');

  return {
    isLoading,
    error,
    success,
    senderName,
    navigateToFriends
  };
};
