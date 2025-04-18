
import React from 'react';
import { Activity, Walking, Running, Bike, Swimming, Dumbbell, Yoga, Music, Trophy, Heart } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';

interface ActivityTypeSelectProps {
  onSelect: (activityTypeId: string) => void;
  selectedActivityType: string | null;
  className?: string;
}

interface ActivityType {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const activityIcons: Record<string, React.FC> = {
  walking: Walking,
  running: Running,
  bicycle: Bike,
  swimming: Swimming,
  dumbbell: Dumbbell,
  yoga: Yoga,
  activity: Activity,
  music: Music,
  trophy: Trophy,
  meditation: Heart
};

const ActivityTypeSelect: React.FC<ActivityTypeSelectProps> = ({ 
  onSelect, 
  selectedActivityType,
  className 
}) => {
  const [activityTypes, setActivityTypes] = React.useState<ActivityType[]>([]);

  React.useEffect(() => {
    const fetchActivityTypes = async () => {
      const { data, error } = await supabase
        .from('activity_types')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching activity types:', error);
        return;
      }

      const typesWithIcons = data.map(type => ({
        ...type,
        icon: activityIcons[type.icon] || Activity
      }));

      setActivityTypes(typesWithIcons);
    };

    fetchActivityTypes();
  }, []);

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
          {activityTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <SelectItem 
                key={type.id} 
                value={type.id}
                className="flex items-center gap-2"
              >
                <span className="flex items-center gap-2">
                  <IconComponent className="w-4 h-4" />
                  {type.name}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ActivityTypeSelect;
