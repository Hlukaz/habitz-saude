
import React from 'react';
import { Plus } from 'lucide-react';
import { useChallenges } from '@/hooks/useChallenges';
import CreateChallengeSheet from '@/components/challenges/CreateChallengeSheet';
import ChallengeCard from '@/components/challenges/ChallengeCard';

const ChallengesPage = () => {
  const {
    activeChallenges,
    activeChallengesLoading,
    challengeInvites,
    challengeInvitesLoading,
    completedChallenges,
    completedChallengesLoading,
    challengeFormOpen,
    setChallengeFormOpen,
    newChallenge,
    setNewChallenge,
    handleCreateChallenge,
    acceptChallenge,
    declineChallenge,
    isCreatingChallenge,
    isAcceptingChallenge,
    isDecliningChallenge
  } = useChallenges();

  return (
    <div className="pb-20">
      <header className="p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-levelup-dark">Desafios</h1>
        <CreateChallengeSheet
          open={challengeFormOpen}
          onOpenChange={setChallengeFormOpen}
          newChallenge={newChallenge}
          onChallengeChange={setNewChallenge}
          onCreateChallenge={handleCreateChallenge}
          isCreatingChallenge={isCreatingChallenge}
        />
      </header>
      
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Desafios Ativos</h2>
        <div className="space-y-4">
          {activeChallengesLoading ? (
            <div className="p-4 text-center text-muted-foreground">Carregando...</div>
          ) : activeChallenges && activeChallenges.length > 0 ? (
            activeChallenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                variant="active"
              />
            ))
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center text-muted-foreground">
              Você não possui desafios ativos. Participe de um desafio ou crie um novo!
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Lista de Desafios</h2>
        <div className="space-y-3">
          {challengeInvitesLoading ? (
            <div className="p-4 text-center text-muted-foreground">Carregando...</div>
          ) : challengeInvites && challengeInvites.length > 0 ? (
            challengeInvites.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                variant="invite"
                onAccept={acceptChallenge}
                onDecline={declineChallenge}
                isAccepting={isAcceptingChallenge}
                isDeclining={isDecliningChallenge}
              />
            ))
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center text-muted-foreground">
              Você não possui convites de desafios pendentes.
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4">
        <h2 className="text-lg font-bold mb-3">Desafios Concluídos</h2>
        <div className="space-y-3">
          {completedChallengesLoading ? (
            <div className="p-4 text-center text-muted-foreground">Carregando...</div>
          ) : completedChallenges && completedChallenges.length > 0 ? (
            completedChallenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                variant="completed"
              />
            ))
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center text-muted-foreground">
              Você ainda não concluiu nenhum desafio.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;
