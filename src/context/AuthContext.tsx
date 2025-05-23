
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserProfile } from '@/types/userProfile';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  registerNotifications: (token: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          navigate('/auth');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;
      
      if (data.user) {
        toast.success('Conta criada com sucesso! Verifique seu email para confirmar.');
      } else {
        toast.error('Erro ao criar conta. Tente novamente.');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      let errorMessage = 'Erro ao criar conta';
      
      if (error.message) {
        if (error.message.includes('already exists')) {
          errorMessage = 'Este e-mail já está em uso. Tente fazer login.';
        } else if (error.message.includes('password')) {
          errorMessage = 'A senha não atende aos requisitos mínimos.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      if (data.user) {
        navigate('/');
        toast.success('Login realizado com sucesso!');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Erro ao fazer login';
      
      if (error.message) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Erro ao sair');
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      
      if (error) throw error;
      
      toast.success('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error: any) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      let errorMessage = 'Erro ao solicitar redefinição de senha';
      
      if (error.message) {
        if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Este e-mail não foi confirmado ainda. Verifique sua caixa de entrada.';
        } else if (error.message.includes('User not found')) {
          errorMessage = 'E-mail não encontrado.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const registerNotifications = async (token: string) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');
      
      // Update the profiles table with the notification token
      const { error } = await supabase
        .from('profiles')
        .update({
          notification_token: token
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success('Notificações ativadas com sucesso!');
    } catch (error: any) {
      console.error('Erro ao registrar notificações:', error);
      toast.error(error.message || 'Erro ao ativar notificações');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      signUp, 
      signIn, 
      signOut,
      resetPassword,
      registerNotifications
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
