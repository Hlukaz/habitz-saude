
import React, { useState } from 'react';
import { X, Upload, Camera, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CheckInModalProps {
  type: 'activity' | 'nutrition';
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (images: string[]) => void;
}

const CheckInModal = ({ type, isOpen, onClose, onSubmit }: CheckInModalProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'success' | 'failure' | null>(null);
  
  const requiredImages = type === 'activity' ? 1 : 3;
  const title = type === 'activity' ? 'Check-in de Atividade Física' : 'Check-in de Alimentação';
  const description = type === 'activity' 
    ? 'Envie uma foto da sua atividade física para ganhar 1 ponto.'
    : 'Envie 3 fotos das suas refeições saudáveis para ganhar 1 ponto.';
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // In a real app, we'd upload these to a server
      // For now, we'll create object URLs as placeholders
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      
      if (images.length + newImages.length > requiredImages) {
        toast.error(`Você só pode enviar ${requiredImages} ${requiredImages === 1 ? 'imagem' : 'imagens'}.`);
        return;
      }
      
      setImages([...images, ...newImages]);
    }
  };
  
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const handleSubmit = () => {
    if (images.length !== requiredImages) {
      toast.error(`Você precisa enviar ${requiredImages} ${requiredImages === 1 ? 'imagem' : 'imagens'}.`);
      return;
    }
    
    // Simulate AI verification
    setIsVerifying(true);
    
    setTimeout(() => {
      // In a real app, we'd send the images to an AI model for verification
      // Here we'll just simulate success
      const success = Math.random() > 0.2; // 80% chance of success
      setVerificationResult(success ? 'success' : 'failure');
      
      setTimeout(() => {
        if (success) {
          onSubmit(images);
          toast.success('Check-in realizado com sucesso!');
        } else {
          toast.error('As imagens não foram validadas. Tente novamente com outras fotos.');
        }
        setIsVerifying(false);
        setVerificationResult(null);
        if (success) {
          onClose();
        }
      }, 1500);
    }, 2000);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl w-full max-w-md max-h-[90vh] overflow-auto animate-slide-in">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg">{title}</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-muted-foreground mb-4">{description}</p>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            {Array.from({ length: requiredImages }).map((_, index) => (
              <div 
                key={index}
                className={cn(
                  "aspect-square rounded-lg overflow-hidden relative border-2 border-dashed",
                  images[index] ? "border-levelup-success" : "border-muted"
                )}
              >
                {images[index] ? (
                  <>
                    <img 
                      src={images[index]} 
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-levelup-danger w-6 h-6 rounded-full flex items-center justify-center text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">Imagem {index + 1}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
          
          {isVerifying && (
            <div className="py-3 flex flex-col items-center text-center animate-pulse">
              <Camera className="w-8 h-8 text-levelup-primary mb-2" />
              <p className="font-medium">Verificando imagens com IA...</p>
              <p className="text-sm text-muted-foreground">Estamos analisando suas imagens, aguarde um momento.</p>
            </div>
          )}
          
          {verificationResult === 'success' && (
            <div className="py-3 flex flex-col items-center text-center text-levelup-success animate-slide-in">
              <Check className="w-8 h-8 mb-2" />
              <p className="font-medium">Imagens validadas com sucesso!</p>
              <p className="text-sm">Parabéns! Você ganhou 1 ponto.</p>
            </div>
          )}
          
          {verificationResult === 'failure' && (
            <div className="py-3 flex flex-col items-center text-center text-levelup-danger animate-slide-in">
              <AlertCircle className="w-8 h-8 mb-2" />
              <p className="font-medium">Não conseguimos validar suas imagens</p>
              <p className="text-sm">Por favor, tente novamente com outras fotos.</p>
            </div>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={images.length !== requiredImages || isVerifying}
            className={cn(
              "w-full py-3 rounded-lg font-medium mt-2",
              images.length === requiredImages && !isVerifying
                ? "bg-levelup-primary text-white"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {isVerifying ? 'Verificando...' : 'Enviar Check-in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckInModal;
