
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserPlus, ArrowLeft, Loader2, Mail, Key, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState as useTabState } from 'react';

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
  const [selectedTab, setSelectedTab] = useTabState('login');
  
  // Estados para o formulário de registro e login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

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

  // Função para login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast.success('Login realizado com sucesso!');
      // Após o login bem-sucedido, a página será recarregada e o useEffect
      // verificará a relação de amizade com o usuário do convite
    } catch (error: any) {
      console.error('Erro no login:', error);
      setAuthError(error.message || 'Falha no login. Verifique suas credenciais.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Função para registro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    if (!username.trim()) {
      setAuthError('Nome de usuário é obrigatório');
      setAuthLoading(false);
      return;
    }

    try {
      // Registrar usuário
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: username
          }
        }
      });

      if (authError) throw authError;
      
      // Se o registro foi bem-sucedido e temos o inviterId, criamos automaticamente a amizade
      if (authData.user && inviterId) {
        // Aguardar um momento para o usuário ser criado completamente no Supabase
        setTimeout(async () => {
          try {
            // Criar automaticamente a amizade entre o novo usuário e o convidador
            const { error: error1 } = await supabase
              .from('friendships')
              .insert({ 
                user_id: authData.user.id, 
                friend_id: inviterId 
              });
              
            const { error: error2 } = await supabase
              .from('friendships')
              .insert({ 
                user_id: inviterId, 
                friend_id: authData.user.id 
              });
            
            if (error1 || error2) {
              console.error('Erro ao criar amizade:', error1 || error2);
            }
            
            toast.success('Conta criada e amizade estabelecida!');
            navigate('/friends');
          } catch (err) {
            console.error('Erro ao criar amizade após registro:', err);
          }
        }, 1000); // Aguardar 1 segundo
      } else {
        toast.success('Conta criada com sucesso!');
      }
    } catch (error: any) {
      console.error('Erro no registro:', error);
      setAuthError(error.message || 'Falha ao criar conta.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Se o usuário não está logado, mostra opções de login/registro
  const renderAuthOptions = () => {
    return (
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Criar Conta</TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="mt-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com" 
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********" 
                  className="pl-10"
                  required
                />
              </div>
            </div>
            {authError && <p className="text-destructive text-sm">{authError}</p>}
            <Button 
              type="submit" 
              className="w-full bg-levelup-primary"
              disabled={authLoading}
            >
              {authLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Entrar
            </Button>
          </form>
        </TabsContent>
        <TabsContent value="register" className="mt-4">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-username">Nome de Usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  id="register-username" 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Seu Nome" 
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  id="register-email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com" 
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-password">Senha</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  id="register-password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********" 
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>
            {authError && <p className="text-destructive text-sm">{authError}</p>}
            <Button 
              type="submit" 
              className="w-full bg-levelup-primary"
              disabled={authLoading}
            >
              {authLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Criar Conta
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    );
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
          <div className="text-center w-full max-w-md">
            <div className="mb-6 flex flex-col items-center">
              <img
                src={inviterDetails?.avatarUrl || 'https://source.unsplash.com/random/100x100/?person'}
                alt={inviterDetails?.name || 'User'}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <h2 className="text-xl font-bold mb-2">{inviterDetails?.name}</h2>
              <p className="text-muted-foreground">Quer se conectar com você no Habitz</p>
            </div>
            
            {user ? (
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
            ) : (
              <div className="mt-6">
                <div className="text-center mb-4">
                  <p className="font-medium">Entre na sua conta ou crie uma nova para aceitar o convite</p>
                </div>
                {renderAuthOptions()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitePage;
