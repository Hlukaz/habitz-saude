
import React, { useState, useEffect } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProgressPhoto {
  id: string;
  user_id: string;
  image_url: string;
  description: string;
  created_at: string;
  user_name: string;
  avatar_url: string;
}

interface ChallengeProgressPhotosProps {
  challengeId: string;
}

const ChallengeProgressPhotos = ({ challengeId }: ChallengeProgressPhotosProps) => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, [challengeId]);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('challenge_progress_photos')
        .select(`
          id,
          user_id,
          image_url,
          description,
          created_at,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('challenge_id', challengeId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPhotos = data?.map(photo => ({
        id: photo.id,
        user_id: photo.user_id,
        image_url: photo.image_url,
        description: photo.description,
        created_at: photo.created_at,
        user_name: photo.profiles?.full_name || 'Usuário',
        avatar_url: photo.profiles?.avatar_url || ''
      })) || [];

      setPhotos(formattedPhotos);
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      // Upload para o storage do Supabase
      const { error: uploadError } = await supabase.storage
        .from('challenge-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('challenge-photos')
        .getPublicUrl(fileName);

      // Salvar no banco de dados
      const { error: dbError } = await supabase
        .from('challenge_progress_photos')
        .insert({
          challenge_id: challengeId,
          user_id: user.id,
          image_url: publicUrl,
          description: 'Foto de progresso'
        });

      if (dbError) throw dbError;

      toast.success('Foto enviada com sucesso!');
      fetchPhotos();
    } catch (error) {
      console.error('Erro ao enviar foto:', error);
      toast.error('Erro ao enviar foto');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-levelup-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4" />
          <h3 className="font-semibold">Fotos de Progresso</h3>
        </div>
        
        <label htmlFor="photo-upload">
          <Button variant="outline" size="sm" className="cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Adicionar Foto
          </Button>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      </div>

      <ScrollArea className="h-[300px]">
        {photos.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma foto de progresso ainda</p>
            <p className="text-sm">Seja o primeiro a compartilhar!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo) => (
              <div key={photo.id} className="space-y-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative cursor-pointer group">
                      <img
                        src={photo.image_url}
                        alt={photo.description}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <img
                      src={photo.image_url}
                      alt={photo.description}
                      className="w-full h-auto max-h-[70vh] object-contain"
                    />
                    <div className="mt-4">
                      <p className="font-medium">{photo.user_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(photo.created_at)}
                      </p>
                      {photo.description && (
                        <p className="text-sm mt-2">{photo.description}</p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                
                <div>
                  <p className="text-xs font-medium">{photo.user_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(photo.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ChallengeProgressPhotos;
