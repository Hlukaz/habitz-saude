
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthTabsProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  username: string;
  setUsername: (username: string) => void;
  inviterId: string | null;
}

const AuthTabs = ({
  selectedTab,
  setSelectedTab,
  email,
  setEmail,
  password,
  setPassword,
  username,
  setUsername,
  inviterId
}: AuthTabsProps) => {
  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Criar Conta</TabsTrigger>
      </TabsList>
      <TabsContent value="login" className="mt-4">
        <LoginForm 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />
      </TabsContent>
      <TabsContent value="register" className="mt-4">
        <RegisterForm 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          username={username}
          setUsername={setUsername}
          inviterId={inviterId}
        />
      </TabsContent>
    </Tabs>
  );
};

export default AuthTabs;
