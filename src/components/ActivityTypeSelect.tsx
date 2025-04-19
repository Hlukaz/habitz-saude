
import React from 'react';
import { Activity, Bike, Dumbbell, Heart, Music, Trophy, Camera, PersonStanding, Waves, Footprints } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ActivityTypeSelectProps {
  onSelect: (activityTypeId: string) => void;
  selectedActivityType: string | null;
  className?: string;
  filterHabitForming?: boolean;
}

interface ActivityType {
  id: string;
  name: string;
  icon: string;
  is_habit_forming: boolean;
}

const ActivityTypeSelect: React.FC<ActivityTypeSelectProps> = ({ 
  onSelect, 
  selectedActivityType,
  className,
  filterHabitForming = false
}) => {
  const [activityTypes, setActivityTypes] = React.useState<ActivityType[]>([]);

  React.useEffect(() => {
    const fetchActivityTypes = async () => {
      let query = supabase
        .from('activity_types')
        .select('*')
        .order('name');
      
      if (filterHabitForming !== undefined) {
        query = query.eq('is_habit_forming', filterHabitForming);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching activity types:', error);
        return;
      }

      setActivityTypes(data || []);
    };

    fetchActivityTypes();
  }, [filterHabitForming]);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'walking':
        return <Activity className="w-4 h-4" />;
      case 'running':
        return <PersonStanding className="w-4 h-4" />; 
      case 'bicycle':
        return <Bike className="w-4 h-4" />;
      case 'swimming':
        return <Waves className="w-4 h-4" />; 
      case 'dumbbell':
        return <Dumbbell className="w-4 h-4" />;
      case 'yoga':
        return <Footprints className="w-4 h-4" />; 
      case 'activity':
        return <Activity className="w-4 h-4" />;
      case 'music':
        return <Music className="w-4 h-4" />;
      case 'trophy':
        return <Trophy className="w-4 h-4" />;
      case 'meditation':
        return <Heart className="w-4 h-4" />;
      default:
        return <Camera className="w-4 h-4" />;
    }
  };

  return (
    <div className={className}>
      <Label htmlFor="activity-type">Tipo de Atividade</Label>
      <Select 
        value={selectedActivityType || undefined}
        onValueChange={onSelect}
      >
        <SelectTrigger id="activity-type" className="w-full">
          <SelectValue placeholder="Selecione o tipo de atividade" />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-40 w-full">
            {activityTypes.map((type) => (
              <SelectItem 
                key={type.id} 
                value={type.id}
                className="flex items-center gap-2"
              >
                <span className="flex items-center gap-2">
                  {getIconComponent(type.icon)}
                  {type.name}
                </span>
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ActivityTypeSelect;
