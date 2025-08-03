
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import HomePage from "./pages/HomePage";
import FriendsPage from "./pages/FriendsPage";
import ChallengesPage from "./pages/ChallengesPage";

import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import InvitePage from "./pages/InvitePage";
import ConfirmFriendPage from "./pages/ConfirmFriendPage";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/invite" element={<InvitePage />} />
                <Route path="/confirm-friend" element={<ConfirmFriendPage />} />
                <Route element={<RequireAuth />}>
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="friends" element={<FriendsPage />} />
                    <Route path="challenges" element={<ChallengesPage />} />
                    
                    <Route path="profile" element={<ProfilePage />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
