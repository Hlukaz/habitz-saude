
import React from 'react';
import { Settings } from 'lucide-react';

const ProfilePageHeader: React.FC = () => {
  return (
    <header className="p-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-levelup-dark">Perfil</h1>
      <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted">
        <Settings className="w-5 h-5 text-muted-foreground" />
      </button>
    </header>
  );
};

export default ProfilePageHeader;
