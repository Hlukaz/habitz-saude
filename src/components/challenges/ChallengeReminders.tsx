
import React, { useState } from 'react';
import { Bell, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface ChallengeRemindersProps {
  challengeId: string;
}

const ChallengeReminders = ({ challengeId }: ChallengeRemindersProps) => {
  const { user } = useAuth();
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [reminderFrequency, setReminderFrequency] = useState('daily');

  const saveReminderSettings = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('challenge_reminders')
        .upsert({
          challenge_id: challengeId,
          user_id: user.id,
          enabled: reminderEnabled,
          reminder_time: reminderTime,
          frequency: reminderFrequency
        });

      if (error) throw error;

      toast.success('Configurações de lembrete salvas!');
    } catch (error) {
      console.error('Erro ao salvar lembretes:', error);
      toast.error('Erro ao salvar configurações');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Lembretes do Desafio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="reminder-enabled">Ativar Lembretes</Label>
            <p className="text-sm text-muted-foreground">
              Receba notificações para participar do desafio
            </p>
          </div>
          <Switch
            id="reminder-enabled"
            checked={reminderEnabled}
            onCheckedChange={setReminderEnabled}
          />
        </div>

        {reminderEnabled && (
          <>
            <div className="space-y-2">
              <Label>Horário do Lembrete</Label>
              <Select value={reminderTime} onValueChange={setReminderTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="07:00">07:00</SelectItem>
                  <SelectItem value="08:00">08:00</SelectItem>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="18:00">18:00</SelectItem>
                  <SelectItem value="19:00">19:00</SelectItem>
                  <SelectItem value="20:00">20:00</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Frequência</Label>
              <Select value={reminderFrequency} onValueChange={setReminderFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diariamente</SelectItem>
                  <SelectItem value="twice_daily">2x por dia</SelectItem>
                  <SelectItem value="weekly">Semanalmente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={saveReminderSettings} className="w-full">
              Salvar Configurações
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ChallengeReminders;
