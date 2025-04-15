import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  fullName: z.string().min(3, 'Nome completo deve ter pelo menos 3 caracteres'),
});

const resetPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

const AuthPage = () => {
  const { signIn, signUp, resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [authError, setAuthError] = useState<string | null>(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const [searchParams] = useSearchParams();
  const resetRequested = searchParams.get('reset') === 'true';

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
    },
  });

  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await signIn(values.email, values.password);
    } catch (error) {
      console.error('Login error:', error);
      // Error is already handled by the toast in context
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await signUp(values.email, values.password, values.fullName);
      // If signup is successful, show success message and reset form
      registerForm.reset();
      // Switch to login tab after successful registration
      setActiveTab("login");
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.message) {
        setAuthError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (values: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await resetPassword(values.email);
      resetPasswordForm.reset();
      toast.success('E-mail de recuperação enviado! Verifique sua caixa de entrada (incluindo spam).');
    } catch (error: any) {
      console.error('Password reset error:', error);
      if (error.message) {
        setAuthError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setAuthError(null); // Clear errors when switching tabs
    setShowResetForm(false); // Hide reset form when switching tabs
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img 
            src="/logo.png" 
            alt="Habitz Logo" 
            className="w-24 h-24 mb-4" 
          />
          <h1 className="text-2xl font-bold text-levelup-dark mb-2">Habitz</h1>
          <p className="text-muted-foreground text-center">
            Uma vida mais saudável
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            {showResetForm ? (
              <div className="space-y-2">
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mr-2 p-0 h-8 w-8" 
                    onClick={() => setShowResetForm(false)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle>Recuperar Senha</CardTitle>
                </div>
                <CardDescription>
                  Digite seu e-mail para receber instruções de recuperação de senha
                </CardDescription>
              </div>
            ) : resetRequested ? (
              <div className="space-y-2">
                <CardTitle>E-mail Enviado</CardTitle>
                <CardDescription>
                  Verifique seu e-mail para redefinir sua senha e faça login após concluir.
                </CardDescription>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Cadastro</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-4">
                  <CardTitle>Entrar</CardTitle>
                  <CardDescription>
                    Faça login na sua conta para continuar
                  </CardDescription>
                </TabsContent>

                <TabsContent value="register" className="mt-4">
                  <CardTitle>Criar Conta</CardTitle>
                  <CardDescription>
                    Crie uma nova conta para começar a usar o app
                  </CardDescription>
                </TabsContent>
              </Tabs>
            )}
          </CardHeader>

          <CardContent>
            {authError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            
            {showResetForm ? (
              <Form {...resetPasswordForm}>
                <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-4">
                  <FormField
                    control={resetPasswordForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="seu@email.com" 
                            {...field} 
                            type="email"
                            autoComplete="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Enviando..." : "Enviar e-mail de recuperação"}
                  </Button>
                </form>
              </Form>
            ) : resetRequested ? (
              <Button 
                className="w-full" 
                onClick={() => setActiveTab("login")}
              >
                Voltar para o Login
              </Button>
            ) : (
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="seu@email.com" 
                                {...field} 
                                type="email"
                                autoComplete="email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="******" 
                                type="password" 
                                {...field}
                                autoComplete="current-password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Entrando..." : "Entrar"}
                      </Button>
                      
                      <div className="text-center">
                        <Button 
                          variant="link" 
                          type="button" 
                          onClick={() => setShowResetForm(true)}
                          className="text-sm text-muted-foreground mt-2"
                        >
                          Esqueceu sua senha?
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="seu@email.com" 
                                {...field} 
                                type="email"
                                autoComplete="email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="******" 
                                type="password" 
                                {...field}
                                autoComplete="new-password" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Criando conta..." : "Criar conta"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
