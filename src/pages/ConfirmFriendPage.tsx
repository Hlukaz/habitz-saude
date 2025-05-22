
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ConfirmFriendPage = () => {
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
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-levelup-dark text-center mb-6">Pedido de Amizade</h1>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 text-levelup-primary animate-spin mb-4" />
            <p className="text-lg text-center">Processando pedido de amizade...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="rounded-full bg-red-100 p-3 mb-4">
              <X className="h-10 w-10 text-levelup-danger" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Não foi possível aceitar o pedido</h2>
            <p className="text-center text-gray-600 mb-6">{error}</p>
            <Button 
              onClick={() => navigate('/friends')} 
              className="w-full bg-levelup-primary"
            >
              Ir para página de amigos
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <Check className="h-10 w-10 text-levelup-success" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Amizade aceita!</h2>
            <p className="text-center text-gray-600 mb-6">
              {senderName ? `Você e ${senderName} agora são amigos.` : 'Pedido de amizade aceito com sucesso.'}
            </p>
            <Button 
              onClick={() => navigate('/friends')} 
              className="w-full bg-levelup-primary"
            >
              Ver meus amigos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmFriendPage;
