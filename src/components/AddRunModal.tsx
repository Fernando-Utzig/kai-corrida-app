
import React, { useState } from 'react';
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
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const { addRun, isAddingRun } = useRuns();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !distance || !duration) {
      return;
    }

    addRun({
      run_date: date.toISOString(),
      distance_km: parseFloat(distance),
      duration_minutes: parseFloat(duration),
      notes: notes.trim() || undefined,
    });

    // Reset form
    setDate(undefined);
    setDistance('');
    setDuration('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Nova Corrida</DialogTitle>
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
                    "w-full justify-start text-left font-normal bg-gray-800 border-gray-700",
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
              className="bg-gray-800 border-gray-700"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Duração (minutos)
            </label>
            <Input
              type="number"
              step="0.1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Ex: 30"
              className="bg-gray-800 border-gray-700"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Anotações (opcional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Como foi sua corrida?"
              className="bg-gray-800 border-gray-700"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isAddingRun || !date || !distance || !duration}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
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
