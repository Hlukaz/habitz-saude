
import React from 'react';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface ShareInviteDialogProps {
  shareUrl: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ShareInviteDialog = ({ shareUrl, isOpen, onOpenChange }: ShareInviteDialogProps) => {
  // Copiar link de convite
  const handleCopyLink = () => {
    if (!shareUrl) return;
    
    navigator.clipboard.writeText(shareUrl)
      .then(() => toast.success('Link copiado para a área de transferência!'))
      .catch(() => toast.error('Falha ao copiar link'));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitação Enviada!</DialogTitle>
          <DialogDescription>
            Sua solicitação de amizade foi enviada com sucesso. Você também pode compartilhar o link direto para aceitar a solicitação.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1"
            />
            <Button size="icon" variant="outline" onClick={handleCopyLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button>Fechar</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareInviteDialog;
