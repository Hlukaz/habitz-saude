
import { useState } from 'react';

export const useShareFriendInvite = () => {
  const [shareUrl, setShareUrl] = useState('');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  // Generate invite link
  const generateInviteLink = (userId: string | undefined) => {
    if (!userId) return '';
    
    const baseUrl = window.location.origin;
    const inviteLink = `${baseUrl}/invite?id=${userId}`;
    setShareUrl(inviteLink);
    return inviteLink;
  };

  // Share invite link via WhatsApp
  const shareViaWhatsApp = (userId: string | undefined) => {
    const inviteLink = generateInviteLink(userId);
    if (!inviteLink) return;
    
    const whatsappUrl = `https://wa.me/?text=Olá! Estou te convidando para ser meu amigo no Habitz. Clique no link para aceitar: ${encodeURIComponent(inviteLink)}`;
    window.open(whatsappUrl, '_blank');
  };

  return {
    shareUrl,
    setShareUrl,
    inviteDialogOpen,
    setInviteDialogOpen,
    generateInviteLink,
    shareViaWhatsApp
  };
};
