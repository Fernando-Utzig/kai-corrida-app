import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { CalendarIcon, Clock, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface AddRunModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddRunModal = ({ isOpen, onClose }: AddRunModalProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [distance, setDistance] = useState([5]); // Array for slider
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [seconds, setSeconds] = useState(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Calculate pace dynamically
  const pace = useMemo(() => {
    const totalMinutes = hours * 60 + minutes + seconds / 60;
    const distanceKm = distance[0];
    
    if (totalMinutes > 0 && distanceKm > 0) {
      const paceMinPerKm = totalMinutes / distanceKm;
      const paceMin = Math.floor(paceMinPerKm);
      const paceSec = Math.round((paceMinPerKm - paceMin) * 60);
      return `${paceMin}:${paceSec.toString().padStart(2, '0')} min/km`;
    }
    return '--:-- min/km';
  }, [distance, hours, minutes, seconds]);

  // Format distance display
  const formatDistance = (km: number) => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalMinutes = hours * 60 + minutes + seconds / 60;
    const distanceKm = distance[0];
    
    if (!user || distanceKm <= 0 || totalMinutes <= 0) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate pace (minutes per km)
      const paceMinPerKm = totalMinutes / distanceKm;

      const { error } = await supabase
        .from('runs')
        .insert([
          {
            user_id: user.id,
            run_date: date.toISOString(),
            distance_km: distanceKm,
            duration_minutes: totalMinutes,
            pace_min_per_km: paceMinPerKm,
            notes: notes || null,
          },
        ]);

      if (error) throw error;

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['runs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });

      toast({
        title: "Corrida registrada!",
        description: (
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/40ad6510-de2a-4e91-b092-e75e0c586e7c.png" 
              alt="Mascote Kai dando parabéns" 
              className="h-10 w-10 rounded-full object-cover"
            />
            <span>Kai está orgulhoso do seu progresso! Continue assim! 🏃‍♂️</span>
          </div>
        ),
      });

      // Reset form
      setDistance([5]);
      setHours(0);
      setMinutes(30);
      setSeconds(0);
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
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-background-component border border-text-secondary/20 text-text-primary sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-text-primary">Registrar Nova Corrida</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Selection */}
            <div className="space-y-2">
              <Label htmlFor="run-date" className="text-text-primary">Data da Corrida</Label>
              <Input
                id="run-date"
                type="date"
                value={format(date, "yyyy-MM-dd")}
                onChange={(e) => setDate(new Date(e.target.value))}
                className="bg-background-component border-text-secondary/20 text-text-primary"
              />
            </div>

            {/* Distance Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-text-primary">Distância</Label>
                <div className="text-text-primary font-semibold text-lg">
                  {formatDistance(distance[0])}
                </div>
              </div>
              <Slider
                value={distance}
                onValueChange={setDistance}
                max={42}
                min={0.1}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-text-secondary">
                <span>0.1km</span>
                <span>42km</span>
              </div>
            </div>

            {/* Duration Input */}
            <div className="space-y-4">
              <Label className="text-text-primary flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Duração
              </Label>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-text-secondary">Horas</Label>
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                    className="bg-background-component border-text-secondary/20 text-text-primary text-center"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-text-secondary">Minutos</Label>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                    className="bg-background-component border-text-secondary/20 text-text-primary text-center"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-text-secondary">Segundos</Label>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                    className="bg-background-component border-text-secondary/20 text-text-primary text-center"
                  />
                </div>
              </div>
              <div className="text-center text-sm text-text-secondary">
                {hours > 0 && `${hours}h `}{minutes}m {seconds > 0 && `${seconds}s`}
              </div>
            </div>

            {/* Pace Display */}
            <div className="bg-background-primary/50 rounded-lg p-4 border border-accent-action/20">
              <div className="flex items-center justify-center space-x-2">
                <Zap className="h-5 w-5 text-accent-action" />
                <div className="text-center">
                  <div className="text-xs text-text-secondary uppercase tracking-wide">Pace</div>
                  <div className="text-xl font-bold text-accent-action">{pace}</div>
                </div>
              </div>
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
  );
};

export default AddRunModal;
