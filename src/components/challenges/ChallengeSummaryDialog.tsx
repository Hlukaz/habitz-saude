
import React from 'react';
import { Trophy, Users, DollarSign, Calendar, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ChallengeSummary {
  id: string;
  challenge_id: string;
  winner_user_id: string | null;
  total_participants: number;
  completion_type: string;
  summary_text: string | null;
  winner_points: number | null;
  total_bet_pool: number | null;
  created_at: string;
}

interface ChallengeSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  challengeName: string;
  summary: ChallengeSummary | null;
  isWinner: boolean;
  userPoints: number;
}

const ChallengeSummaryDialog = ({ 
  isOpen, 
  onClose, 
  challengeName, 
  summary, 
  isWinner,
  userPoints 
}: ChallengeSummaryDialogProps) => {
  if (!summary) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-levelup-primary" />
            Desafio Concluído!
          </DialogTitle>
          <DialogDescription>
            Resumo do desafio "{challengeName}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isWinner && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-lg text-white text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-bold text-lg">🎉 Parabéns, você venceu!</h3>
              <p className="text-sm opacity-90">
                Você foi o grande campeão deste desafio!
              </p>
            </div>
          )}

          <div className="bg-card p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Participantes</span>
              </div>
              <Badge variant="secondary">{summary.total_participants}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Seus pontos</span>
              </div>
              <Badge variant="outline">{userPoints} pontos</Badge>
            </div>

            {summary.winner_points && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">Pontuação vencedora</span>
                </div>
                <Badge className="bg-yellow-500 text-white">
                  {summary.winner_points} pontos
                </Badge>
              </div>
            )}

            {summary.total_bet_pool && summary.total_bet_pool > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-levelup-accent" />
                  <span className="text-sm">Pool de apostas</span>
                </div>
                <Badge className="bg-levelup-accent text-white">
                  R$ {summary.total_bet_pool.toFixed(2)}
                </Badge>
              </div>
            )}
          </div>

          {summary.summary_text && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">{summary.summary_text}</p>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Concluído em {new Date(summary.created_at).toLocaleDateString('pt-BR')}</span>
          </div>

          <Button onClick={onClose} className="w-full">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChallengeSummaryDialog;
