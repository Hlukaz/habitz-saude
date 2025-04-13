
import React from 'react';
import { CalendarRange, Compass, Bell } from 'lucide-react';

interface HomeHeaderProps {
  currentWeek: string;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ currentWeek }) => {
  return (
    <header className="p-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-levelup-dark">Habitz</h1>
        <div className="flex items-center text-muted-foreground">
          <CalendarRange className="w-4 h-4 mr-1" />
          <span className="text-sm">Semana atual: {currentWeek}</span>
        </div>
      </div>
      <div className="flex items-center">
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted">
          <Compass className="w-6 h-6 text-muted-foreground" />
        </button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted ml-1">
          <Bell className="w-6 h-6 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
};

export default HomeHeader;
