
import React, { useState } from 'react';
import { User, Mail, Key, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RegisterFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  username: string;
  setUsername: (username: string) => void;
  inviterId: string | null;
}

const RegisterForm = ({ 
  email, 
  setEmail, 
  password, 
  setPassword, 
  username, 
  setUsername,
  inviterId 
}: RegisterFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!username.trim()) {
      setError('Nome de usuário é obrigatório');
      setLoading(false);
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
          } catch (err) {
            console.error('Erro ao criar amizade após registro:', err);
          }
        }, 1000); // Aguardar 1 segundo
      } else {
        toast.success('Conta criada com sucesso!');
      }
    } catch (error: any) {
      console.error('Erro no registro:', error);
      setError(error.message || 'Falha ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button 
        type="submit" 
        className="w-full bg-levelup-primary"
        disabled={loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Criar Conta
      </Button>
    </form>
  );
};

export default RegisterForm;
