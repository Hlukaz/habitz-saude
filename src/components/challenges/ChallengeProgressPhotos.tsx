
import React from 'react';
import { Camera, Upload, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChallengeProgressPhotosProps {
  challengeId: string;
}

const ChallengeProgressPhotos = ({ challengeId }: ChallengeProgressPhotosProps) => {
  console.log('Challenge photos for:', challengeId);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Camera className="w-4 h-4" />
        <h3 className="font-semibold">Fotos de Progresso</h3>
      </div>
      
      <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
        <Image className="w-12 h-12 mx-auto mb-2 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground mb-2">Compartilhe seu progresso</p>
        <p className="text-sm text-muted-foreground mb-4">
          Em breve você poderá enviar fotos do seu progresso no desafio!
        </p>
        <Button variant="outline" disabled>
          <Upload className="w-4 h-4 mr-2" />
          Enviar Foto
        </Button>
      </div>
    </div>
  );
};

export default ChallengeProgressPhotos;
