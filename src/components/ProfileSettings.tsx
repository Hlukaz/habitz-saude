
import React from 'react';
import { Bell, Activity, Smartphone, LogOut } from 'lucide-react';

interface ProfileSettingsProps {
  onLogout: () => Promise<void>;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onLogout }) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-3">Configurações</h2>
      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <button className="w-full p-4 flex items-center border-b hover:bg-muted/20">
          <Bell className="w-5 h-5 text-levelup-primary mr-3" />
          <span>Notificações</span>
        </button>
        <button className="w-full p-4 flex items-center border-b hover:bg-muted/20">
          <Activity className="w-5 h-5 text-levelup-primary mr-3" />
          <span>Integração com Apps de Saúde</span>
        </button>
        <button className="w-full p-4 flex items-center border-b hover:bg-muted/20">
          <Smartphone className="w-5 h-5 text-levelup-primary mr-3" />
          <span>Dispositivos Conectados</span>
        </button>
        <button 
          className="w-full p-4 flex items-center text-levelup-danger hover:bg-muted/20"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
