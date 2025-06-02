
import React, { useState } from 'react';
import { Trophy, Users, Calendar, Target, Star, Clock, MessageCircle, Camera, BarChart3 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChallengeWithDetails } from '@/hooks/useChallenges';
import ChallengeLiveRanking from './ChallengeLiveRanking';
import ChallengeChat from './ChallengeChat';
import ChallengeProgressPhotos from './ChallengeProgressPhotos';

interface ChallengeDetailsSheetProps {
  challenge: ChallengeWithDetails;
  children: React.ReactNode;
}

const ChallengeDetailsSheet = ({ challenge, children }: ChallengeDetailsSheetProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const getDaysRemaining = () => {
    const endDate = new Date(challenge.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getProgressPercentage = () => {
    const startDate = new Date(challenge.start_date);
    const endDate = new Date(challenge.end_date);
    const today = new Date();
    
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = today.getTime() - startDate.getTime();
    
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-levelup-primary" />
            {challenge.name}
          </SheetTitle>
          <SheetDescription>
            Detalhes completos do desafio e acompanhamento de progresso
          </SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="ranking">Ranking</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="photos">Fotos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="bg-card p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Progresso do Desafio</span>
                <span className="text-sm text-muted-foreground">
                  {getDaysRemaining()} dias restantes
                </span>
              </div>
              <Progress value={getProgressPercentage()} className="mb-2" />
              <div className="text-xs text-muted-foreground">
                {challenge.start_date} - {challenge.end_date}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-levelup-primary" />
                  <span className="text-sm font-medium">Participantes</span>
                </div>
                <p className="text-lg font-bold">{challenge.participants}</p>
              </div>

              <div className="bg-card p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-levelup-accent" />
                  <span className="text-sm font-medium">Meta</span>
                </div>
                <p className="text-lg font-bold">
                  {challenge.target_points || 'Sem limite'}
                </p>
              </div>
            </div>

            {challenge.rewards && (
              <div className="bg-card p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Recompensas
                </h4>
                <div className="space-y-2">
                  {challenge.rewards.split(',').map((reward, index) => (
                    <Badge key={index} variant="secondary" className="mr-2">
                      {reward.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {challenge.educational_tips && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium mb-2 text-blue-800">💡 Dica Educacional</h4>
                <p className="text-sm text-blue-700">{challenge.educational_tips}</p>
              </div>
            )}

            {challenge.point_multiplier && challenge.point_multiplier > 1 && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-lg text-white">
                <h4 className="font-bold mb-1">🔥 Multiplicador Ativo!</h4>
                <p className="text-sm">Pontos multiplicados por {challenge.point_multiplier}x</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ranking">
            <ChallengeLiveRanking challengeId={challenge.id} />
          </TabsContent>

          <TabsContent value="chat">
            <ChallengeChat challengeId={challenge.id} />
          </TabsContent>

          <TabsContent value="photos">
            <ChallengeProgressPhotos challengeId={challenge.id} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default ChallengeDetailsSheet;
