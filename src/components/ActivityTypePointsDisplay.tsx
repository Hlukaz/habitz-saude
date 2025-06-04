
import React from 'react';
import { ActivityTypePoints } from '@/types/activityTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Trophy } from 'lucide-react';

interface ActivityTypePointsDisplayProps {
  activityPoints: ActivityTypePoints[];
  isLoading: boolean;
}

const ActivityTypePointsDisplay: React.FC<ActivityTypePointsDisplayProps> = ({ activityPoints, isLoading }) => {
  const totalPoints = activityPoints.reduce((sum, activity) => sum + activity.points, 0);

  if (isLoading) {
    return (
      <Card className="shadow-sm mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>Pontos por Atividade</span>
            <div className="flex items-center">
              <Trophy className="w-4 h-4 text-levelup-accent mr-1" />
              <span className="text-sm text-muted-foreground">Carregando...</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center text-muted-foreground">
            Carregando...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activityPoints || activityPoints.length === 0) {
    return (
      <Card className="shadow-sm mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>Pontos por Atividade</span>
            <div className="flex items-center">
              <Trophy className="w-4 h-4 text-levelup-accent mr-1" />
              <span className="text-sm font-medium">0 pontos</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 flex items-center justify-center text-muted-foreground">
            Realize check-ins de atividades para acumular pontos.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Pontos por Atividade</span>
          <div className="flex items-center">
            <Trophy className="w-4 h-4 text-levelup-accent mr-1" />
            <span className="text-sm font-medium">{totalPoints} pontos totais</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {activityPoints.map(activity => (
            <div 
              key={activity.activity_type_id} 
              className="bg-levelup-light p-3 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-levelup-primary rounded-full flex items-center justify-center mr-3">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">{activity.activity_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.points} {activity.points === 1 ? 'ponto' : 'pontos'}
                  </p>
                </div>
              </div>
              <div className="text-xl font-bold text-levelup-primary">
                {activity.points}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTypePointsDisplay;
