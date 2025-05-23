import React, { useState } from 'react';
import { UserPlus, Search, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { SearchUserResult } from '@/types/friendTypes';

interface AddFriendDialogProps {
  onSendRequest: (userId: string) => Promise<void>;
  onSearch: (query: string) => Promise<SearchUserResult[]>;
  isPending: boolean;
}

const AddFriendDialog = ({ onSendRequest, onSearch, isPending }: AddFriendDialogProps) => {
  const [addUserQuery, setAddUserQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUserResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SearchUserResult | null>(null);

  // Handle user search
  const handleSearch = async (query: string) => {
    setAddUserQuery(query);
    
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    
    try {
      setIsSearching(true);
      const results = await onSearch(query);
      setSearchResults(results || []);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast.error('Erro ao buscar usuários');
    } finally {
      setIsSearching(false);
    }
  };

  // Selecionar usuário para enviar solicitação
  const handleSelectUser = (userResult: SearchUserResult) => {
    setSelectedUser(userResult);
    setAddUserQuery(userResult.username || userResult.email || '');
    setSearchResults([]);
  };

  // Criar pedido de amizade
  const handleSendRequest = async () => {
    if (!selectedUser) return;
    try {
      await onSendRequest(selectedUser.id);
      setAddUserQuery('');
      setSelectedUser(null);
    } catch (error: any) {
      console.error('Erro ao enviar solicitação:', error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full py-3 bg-levelup-primary text-white rounded-lg flex items-center justify-center font-medium">
          <UserPlus className="w-5 h-5 mr-2" />
          Adicionar Amigo
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Amigo</DialogTitle>
          <DialogDescription>
            Busque por um amigo pelo nome de usuário ou e-mail.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar por usuário ou email..."
              value={addUserQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-4 pr-8 py-2"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
          
          {searchResults.length > 0 && (
            <div className="border rounded-md overflow-hidden">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="p-3 hover:bg-muted cursor-pointer flex items-center"
                  onClick={() => handleSelectUser(result)}
                >
                  <img
                    src={result.avatar_url || 'https://source.unsplash.com/random/100x100/?person'}
                    alt={result.username || result.email || ''}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <div>
                    <p className="font-medium">{result.full_name || result.username}</p>
                    <p className="text-sm text-muted-foreground">{result.username || result.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {searchResults.length === 0 && addUserQuery.length >= 3 && !isSearching && (
            <div className="text-center p-4 text-muted-foreground">
              Nenhum usuário encontrado
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button 
              onClick={handleSendRequest}
              disabled={!selectedUser || isPending}
            >
              {isPending ? (
                <Loader className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              Enviar Solicitação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendDialog;
