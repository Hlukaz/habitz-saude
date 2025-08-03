
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, BarChart2, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/friends', icon: Users, label: 'Amigos' },
    { path: '/challenges', icon: BarChart2, label: 'Desafios' },
    { path: '/profile', icon: User, label: 'Perfil' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg z-10">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center py-3 px-2 w-full",
                isActive
                  ? "text-levelup-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "animate-pulse-scale")} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
