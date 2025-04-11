
import React, { useState } from 'react';
import { Search, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for demonstration
const mockChats = [
  {
    id: 'chat-1',
    name: 'Desafio de Abril',
    isGroup: true,
    lastMessage: 'Carlos: Estou quase alcançando a meta!',
    time: '10:30',
    unread: 2,
    avatarUrl: 'https://source.unsplash.com/random/100x100/?group'
  },
  {
    id: 'chat-2',
    name: 'Ana Silva',
    isGroup: false,
    lastMessage: 'Como está indo seu treino hoje?',
    time: '09:15',
    unread: 0,
    avatarUrl: 'https://source.unsplash.com/random/100x100/?woman'
  },
  {
    id: 'chat-3',
    name: 'Carlos Gomes',
    isGroup: false,
    lastMessage: 'Vamos fazer um desafio?',
    time: 'Ontem',
    unread: 1,
    avatarUrl: 'https://source.unsplash.com/random/100x100/?man'
  },
  {
    id: 'chat-4',
    name: 'Fim de Semana Saudável',
    isGroup: true,
    lastMessage: 'Patricia: Alguém vai correr amanhã?',
    time: 'Ontem',
    unread: 0,
    avatarUrl: 'https://source.unsplash.com/random/100x100/?exercise'
  }
];

const mockMessages = [
  {
    id: 'msg-1',
    senderId: 'user-2',
    senderName: 'Ana Silva',
    message: 'Oi! Como está indo seu treino hoje?',
    time: '09:15',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?woman'
  },
  {
    id: 'msg-2',
    senderId: 'user-1',
    senderName: 'Você',
    message: 'Olá Ana! Estou fazendo cardio hoje, já completei 20 minutos.',
    time: '09:17',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?person'
  },
  {
    id: 'msg-3',
    senderId: 'user-2',
    senderName: 'Ana Silva',
    message: 'Ótimo! Vai fazer o check-in depois?',
    time: '09:20',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?woman'
  },
  {
    id: 'msg-4',
    senderId: 'user-1',
    senderName: 'Você',
    message: 'Sim, assim que terminar vou tirar uma foto e registrar no app.',
    time: '09:25',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?person'
  },
  {
    id: 'msg-5',
    senderId: 'user-2',
    senderName: 'Ana Silva',
    message: 'Perfeito! Estamos quase empatados no ranking, preciso fazer meu check-in também hoje 😊',
    time: '09:30',
    avatarUrl: 'https://source.unsplash.com/random/100x100/?woman'
  }
];

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      // In a real app, we'd send the message to a server
      // For now, we'll just clear the input
      setMessageText('');
    }
  };
  
  const selectedChatData = mockChats.find(chat => chat.id === selectedChat);
  
  return (
    <div className="pb-20">
      {!selectedChat ? (
        <>
          {/* Chat List Header */}
          <header className="p-4">
            <h1 className="text-2xl font-bold text-levelup-dark mb-2">Chat</h1>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar conversas..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </header>
          
          {/* Chat List */}
          <div className="px-4">
            <div className="space-y-3">
              {mockChats.map(chat => (
                <div 
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className="bg-card p-3 rounded-lg shadow-sm flex items-center hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={chat.avatarUrl}
                      alt={chat.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {chat.unread > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-levelup-accent rounded-full text-white text-xs flex items-center justify-center">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{chat.name}</p>
                      <p className="text-xs text-muted-foreground">{chat.time}</p>
                    </div>
                    <p className={cn(
                      "text-sm truncate", 
                      chat.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                    )}>
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Chat Detail Header */}
          <header className="p-4 border-b flex items-center">
            <button 
              onClick={() => setSelectedChat(null)}
              className="mr-3 text-muted-foreground"
            >
              &larr;
            </button>
            <img
              src={selectedChatData?.avatarUrl}
              alt={selectedChatData?.name}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div>
              <h2 className="font-bold">{selectedChatData?.name}</h2>
              <p className="text-xs text-muted-foreground">
                {selectedChatData?.isGroup ? '5 participantes' : 'Online'}
              </p>
            </div>
          </header>
          
          {/* Chat Messages */}
          <div className="px-4 py-3 space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto">
            {mockMessages.map(message => (
              <div 
                key={message.id}
                className={cn(
                  "flex",
                  message.senderId === 'user-1' ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[75%] rounded-2xl p-3",
                  message.senderId === 'user-1' 
                    ? "bg-levelup-primary text-white rounded-br-none" 
                    : "bg-muted rounded-bl-none"
                )}>
                  {selectedChatData?.isGroup && message.senderId !== 'user-1' && (
                    <p className="text-xs font-medium mb-1 text-levelup-accent">
                      {message.senderName}
                    </p>
                  )}
                  <p>{message.message}</p>
                  <p className={cn(
                    "text-xs text-right mt-1",
                    message.senderId === 'user-1' ? "text-white/70" : "text-muted-foreground"
                  )}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Chat Input */}
          <div className="px-4 py-2 border-t fixed bottom-16 left-0 right-0 bg-background">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 py-2 px-4 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button 
                type="submit"
                className={cn(
                  "ml-2 w-10 h-10 rounded-full flex items-center justify-center",
                  messageText.trim() 
                    ? "bg-levelup-primary text-white" 
                    : "bg-muted text-muted-foreground"
                )}
                disabled={!messageText.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPage;
