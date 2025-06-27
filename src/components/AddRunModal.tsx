
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useRuns } from '@/hooks/useRuns';

interface AddRunModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddRunModal: React.FC<AddRunModalProps> = ({ isOpen, onClose }) => {
  const [date, setDate] = useState<Date>();
  const [distance, setDistance] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [notes, setNotes] = useState('');
  const [calculatedPace, setCalculatedPace] = useState('0.00');
  const { addRun, isAddingRun } = useRuns();

  // Calculate pace in real-time
  useEffect(() => {
    const distanceNum = parseFloat(distance) || 0;
    const hoursNum = parseFloat(hours) || 0;
    const minutesNum = parseFloat(minutes) || 0;
    const totalMinutes = (hoursNum * 60) + minutesNum;

    if (distanceNum > 0 && totalMinutes > 0) {
      const pace = totalMinutes / distanceNum;
      setCalculatedPace(pace.toFixed(2));
    } else {
      setCalculatedPace('0.00');
    }
  }, [distance, hours, minutes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !distance || (!hours && !minutes)) {
      return;
    }

    const totalMinutes = (parseFloat(hours) || 0) * 60 + (parseFloat(minutes) || 0);

    addRun({
      run_date: date.toISOString(),
      distance_km: parseFloat(distance),
      duration_minutes: totalMinutes,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setDate(undefined);
    setDistance('');
    setHours('');
    setMinutes('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Registrar Nova Corrida</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Data da Corrida
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-gray-900 border-gray-600 text-gray-300",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Distância (km)
            </label>
            <Input
              type="number"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="Ex: 5.2"
              className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Duração
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="0"
                  className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500"
                />
                <label className="text-xs text-gray-400 mt-1 block">Horas (H)</label>
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  placeholder="30"
                  className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500"
                />
                <label className="text-xs text-gray-400 mt-1 block">Minutos (M)</label>
              </div>
            </div>
          </div>

          {/* Live Pace Display */}
          <div className="bg-gray-900 border border-gray-600 rounded-lg p-3">
            <p className="text-sm text-gray-400 mb-1">Seu Pace será:</p>
            <p className="text-lg font-bold text-orange-400">{calculatedPace} min/km</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Anotações (opcional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Como foi sua corrida?"
              className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isAddingRun || !date || !distance || (!hours && !minutes)}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isAddingRun ? 'Salvando...' : 'Salvar Corrida'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRunModal;
