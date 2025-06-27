
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useRuns } from '@/hooks/useRuns';
import Slider from 'rc-slider';
import TimePicker from 'react-time-picker';
import 'rc-slider/assets/index.css';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

interface AddRunModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddRunModal: React.FC<AddRunModalProps> = ({ isOpen, onClose }) => {
  const [date, setDate] = useState<Date>();
  const [distance, setDistance] = useState(5.0);
  const [duration, setDuration] = useState('00:30');
  const [notes, setNotes] = useState('');
  const [calculatedPace, setCalculatedPace] = useState('6.00');
  const { addRun, isAddingRun } = useRuns();

  // Calculate pace in real-time
  useEffect(() => {
    if (distance > 0 && duration) {
      const [hours, minutes] = duration.split(':').map(Number);
      const totalMinutes = (hours * 60) + minutes;
      
      if (totalMinutes > 0) {
        const pace = totalMinutes / distance;
        setCalculatedPace(pace.toFixed(2));
      } else {
        setCalculatedPace('0.00');
      }
    } else {
      setCalculatedPace('0.00');
    }
  }, [distance, duration]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !distance || !duration) {
      return;
    }

    const [hours, minutes] = duration.split(':').map(Number);
    const totalMinutes = (hours * 60) + minutes;

    addRun({
      run_date: date.toISOString(),
      distance_km: distance,
      duration_minutes: totalMinutes,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setDate(undefined);
    setDistance(5.0);
    setDuration('00:30');
    setNotes('');
    onClose();
  };

  const sliderStyle = {
    rail: {
      backgroundColor: '#374151',
      height: 8,
    },
    track: {
      backgroundColor: '#f97316',
      height: 8,
    },
    handle: {
      borderColor: '#f97316',
      backgroundColor: '#f97316',
      boxShadow: '0 0 0 2px rgba(249, 115, 22, 0.2)',
      width: 20,
      height: 20,
      marginTop: -6,
    },
    handleActive: {
      boxShadow: '0 0 0 4px rgba(249, 115, 22, 0.3)',
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 mx-4 my-8">
        <DialogHeader>
          <DialogTitle className="text-white">Registrar Nova Corrida</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 p-2">
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
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto bg-gray-800 text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-3 block">
              Distância: <span className="text-orange-400 font-bold">{distance.toFixed(1)} km</span>
            </label>
            <div className="px-2">
              <Slider
                min={0.5}
                max={42.2}
                step={0.1}
                value={distance}
                onChange={(value) => setDistance(value as number)}
                styles={sliderStyle}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0.5 km</span>
                <span>42.2 km</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Duração
            </label>
            <div className="time-picker-container">
              <TimePicker
                onChange={(value) => setDuration(value as string)}
                value={duration}
                disableClock={true}
                format="HH:mm"
                className="react-time-picker--dark"
              />
            </div>
          </div>

          {/* Live Pace Display */}
          <div className="bg-gray-900 border border-gray-600 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Seu Pace será:</p>
            <p className="text-xl font-bold text-orange-400">{calculatedPace} min/km</p>
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
              className="flex-1 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isAddingRun || !date || !distance || !duration}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isAddingRun ? 'Salvando...' : 'Salvar Corrida'}
            </Button>
          </div>
        </form>

        <style>{`
          .time-picker-container .react-time-picker {
            width: 100%;
          }
          
          .react-time-picker--dark .react-time-picker__wrapper {
            background-color: #111827;
            border: 1px solid #4b5563;
            border-radius: 6px;
            padding: 8px 12px;
          }
          
          .react-time-picker--dark .react-time-picker__inputGroup {
            color: white;
          }
          
          .react-time-picker--dark .react-time-picker__inputGroup__input {
            background: transparent;
            border: none;
            color: white;
            font-size: 14px;
          }
          
          .react-time-picker--dark .react-time-picker__inputGroup__input:focus {
            outline: none;
            background-color: rgba(249, 115, 22, 0.1);
          }
          
          .react-time-picker--dark .react-time-picker__inputGroup__divider {
            color: #9ca3af;
          }
          
          .react-time-picker--dark .react-time-picker__clear-button,
          .react-time-picker--dark .react-time-picker__clock-button {
            display: none;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

export default AddRunModal;
