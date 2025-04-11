
import React from 'react';
import { Camera, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckInButtonProps {
  type: 'activity' | 'nutrition';
  onClick: () => void;
  className?: string;
}

const CheckInButton = ({ type, onClick, className }: CheckInButtonProps) => {
  const isActivity = type === 'activity';
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-full p-5 rounded-xl transition-all",
        "animate-pulse-scale shadow-md hover:shadow-lg",
        isActivity ? "bg-levelup-primary text-white" : "bg-levelup-secondary text-white",
        className
      )}
    >
      <div className="bg-white/20 rounded-full p-3 mb-2">
        {isActivity ? (
          <Camera className="w-8 h-8" />
        ) : (
          <Utensils className="w-8 h-8" />
        )}
      </div>
      <span className="font-medium text-lg">
        {isActivity ? 'Check-in de Atividade' : 'Check-in de Alimentação'}
      </span>
      <span className="text-sm opacity-80 mt-1">
        {isActivity ? 'Envie 1 foto da sua atividade física' : 'Envie 3 fotos de refeições saudáveis'}
      </span>
    </button>
  );
};

export default CheckInButton;
