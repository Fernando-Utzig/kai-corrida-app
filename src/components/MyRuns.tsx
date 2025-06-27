
import React from 'react';
import { Calendar, Clock, MapPin, TrendingUp } from 'lucide-react';
import { useRuns } from '@/hooks/useRuns';

const MyRuns = () => {
  const { runs, isLoading } = useRuns();

  const formatPace = (pace: number) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const totalDistance = runs.reduce((sum, run) => sum + run.distance_km, 0);
  const totalTime = runs.reduce((sum, run) => sum + run.duration_minutes, 0);
  const totalHours = Math.floor(totalTime / 60);
  const totalMinutes = Math.round(totalTime % 60);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-text-primary text-lg">Carregando corridas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-2">
            Minhas Corridas 🏃‍♂️
          </h1>
          <p className="text-text-secondary text-lg">
            Acompanhe seu histórico de corridas e evolução
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-background-component border border-text-secondary/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Total de Corridas</p>
                <p className="text-2xl font-bold text-text-primary">{runs.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent-action" />
            </div>
          </div>
          <div className="bg-background-component border border-text-secondary/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Distância Total</p>
                <p className="text-2xl font-bold text-text-primary">{totalDistance.toFixed(1)} km</p>
              </div>
              <MapPin className="w-8 h-8 text-accent-action" />
            </div>
          </div>
          <div className="bg-background-component border border-text-secondary/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Tempo Total</p>
                <p className="text-2xl font-bold text-text-primary">{totalHours}h {totalMinutes}m</p>
              </div>
              <Clock className="w-8 h-8 text-accent-action" />
            </div>
          </div>
        </div>

        {/* Runs List */}
        <div className="bg-background-component border border-text-secondary/20 rounded-xl">
          <div className="p-6 border-b border-text-secondary/20">
            <h2 className="text-xl font-semibold text-text-primary">Histórico de Corridas</h2>
          </div>
          {runs.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-text-secondary">
                Você ainda não registrou nenhuma corrida. Que tal começar agora?
              </p>
            </div>
          ) : (
            <div className="divide-y divide-text-secondary/20">
              {runs.map((run, index) => (
                <div key={run.id} className="p-6 hover:bg-background-primary/50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex items-center space-x-6">
                      <div className="w-12 h-12 bg-accent-action rounded-full flex items-center justify-center">
                        <span className="text-background-primary font-semibold">{index + 1}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Calendar className="w-4 h-4 text-text-secondary" />
                          <span className="text-text-primary font-medium">
                            {new Date(run.run_date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        {run.notes && (
                          <div className="flex items-center space-x-2">
                            <span className="text-text-secondary text-sm">{run.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
                      <div className="text-center">
                        <p className="text-text-secondary text-sm">Distância</p>
                        <p className="text-text-primary font-semibold">{run.distance_km} km</p>
                      </div>
                      <div className="text-center">
                        <p className="text-text-secondary text-sm">Tempo</p>
                        <p className="text-text-primary font-semibold">{run.duration_minutes} min</p>
                      </div>
                      <div className="text-center">
                        <p className="text-text-secondary text-sm">Pace</p>
                        <p className="text-text-primary font-semibold">{formatPace(run.pace_min_per_km)} min/km</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRuns;
