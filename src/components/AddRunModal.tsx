import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

interface AddRunModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddRunModal = ({ isOpen, onClose }: AddRunModalProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !distance || !duration) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse duration from string (HH:MM) to minutes
      const [hours, minutes] = duration.split(':').map(Number);
      const durationMinutes = hours * 60 + minutes;
      
      // Calculate pace (minutes per km)
      const distanceKm = parseFloat(distance);
      const paceMinPerKm = durationMinutes / distanceKm;

      const { error } = await supabase
        .from('runs')
        .insert([
          {
            user_id: user.id,
            run_date: date.toISOString(),
            distance_km: distanceKm,
            duration_minutes: durationMinutes,
            pace_min_per_km: paceMinPerKm,
            notes: notes || null,
          },
        ]);

      if (error) throw error;

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['runs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });

      toast({
        title: (
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/40ad6510-de2a-4e91-b092-e75e0c586e7c.png" 
              alt="Mascote Kai dando parabéns" 
              className="h-10 w-10 rounded-full object-cover"
            />
            <span>Corrida registrada!</span>
          </div>
        ),
        description: "Kai está orgulhoso do seu progresso! Continue assim! 🏃‍♂️",
      });

      // Reset form
      setDistance('');
      setDuration('10:00');
      setNotes('');
      setDate(new Date());
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar corrida:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a corrida. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>
        {`
          .react-time-picker__wrapper {
            background-color: #2B2B2B !important;
            border: 1px solid rgba(136, 136, 136, 0.2) !important;
            border-radius: 6px !important;
            padding: 8px 12px !important;
            color: #E0E0E0 !important;
            width: 100% !important;
          }
          .react-time-picker__inputGroup {
            color: #E0E0E0 !important;
          }
          .react-time-picker__inputGroup__input {
            background: transparent !important;
            color: #E0E0E0 !important;
            border: none !important;
          }
          .react-time-picker__inputGroup__divider {
            color: #888888 !important;
          }
          .react-time-picker__button {
            background: transparent !important;
            border: none !important;
            color: #888888 !important;
            padding: 4px !important;
          }
          .react-time-picker__button:hover {
            color: #FFFFFF !important;
          }
          .react-time-picker__button svg {
            stroke: currentColor !important;
          }
          .react-time-picker__clock {
            background-color: #2B2B2B !important;
            border: 1px solid rgba(136, 136, 136, 0.2) !important;
          }
          .react-clock {
            background: #2B2B2B !important;
          }
          .react-clock__face {
            border-color: rgba(136, 136, 136, 0.2) !important;
          }
          .react-clock__mark {
            background-color: #888888 !important;
          }
          .react-clock__mark__body {
            background-color: #888888 !important;
          }
          .react-clock__hand {
            background-color: #FFFFFF !important;
          }
          .react-clock__hand__body {
            background-color: #FFFFFF !important;
          }
        `}
      </style>
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-background-component border border-text-secondary/20 text-text-primary sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-text-primary">Registrar Nova Corrida</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Selection */}
            <div className="space-y-2">
              <Label className="text-text-primary">Data da Corrida</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background-component border-text-secondary/20 text-text-primary hover:bg-background-primary hover:text-accent-action",
                      !date && "text-text-secondary"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background-component border-text-secondary/20" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                    className="bg-background-component text-text-primary"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Distance Input */}
            <div className="space-y-2">
              <Label htmlFor="distance" className="text-text-primary">Distância (km)</Label>
              <Input
                id="distance"
                type="number"
                step="0.1"
                min="0.1"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="Ex: 5.2"
                className="bg-background-component border-text-secondary/20 text-text-primary placeholder-text-secondary focus:border-accent-action"
                required
              />
            </div>

            {/* Duration Input */}
            <div className="space-y-2">
              <Label className="text-text-primary flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Duração
              </Label>
              <TimePicker
                onChange={setDuration}
                value={duration}
                disableClock={true}
                clearIcon={null}
                clockIcon={null}
                format="HH:mm"
                maxDetail="minute"
                className="w-full"
              />
            </div>

            {/* Notes Input */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-text-primary">Observações (opcional)</Label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Como foi a corrida? Alguma observação?"
                className="w-full min-h-[80px] px-3 py-2 bg-background-component border border-text-secondary/20 rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-action focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 bg-transparent border-text-secondary/30 text-text-primary hover:bg-background-primary hover:text-accent-action"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-accent-action hover:bg-accent-action/90 text-background-primary font-semibold"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Corrida'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddRunModal;
