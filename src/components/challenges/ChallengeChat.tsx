
import React, { useState } from 'react';
import { MessageCircle, Send, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ChallengeChatProps {
  challengeId: string;
}

const ChallengeChat = ({ challengeId }: ChallengeChatProps) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    console.log('Sending message:', newMessage, 'to challenge:', challengeId);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-96">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-4 h-4" />
        <h3 className="font-semibold">Chat do Desafio</h3>
      </div>
      
      <ScrollArea className="flex-1 p-3 border rounded-lg mb-4">
        <div className="space-y-3">
          <div className="text-center text-sm text-muted-foreground py-8">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Chat em desenvolvimento</p>
            <p className="text-xs">Em breve você poderá conversar com outros participantes!</p>
          </div>
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled
        />
        <Button onClick={handleSendMessage} size="sm" disabled>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChallengeChat;
