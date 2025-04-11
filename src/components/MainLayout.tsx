
import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from '@/components/BottomNavigation';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-16">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default MainLayout;
