
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Carregando corridas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Minhas Corridas 🏃‍♂️
          </h1>
          <p className="text-gray-400 text-lg">
            Acompanhe seu histórico de corridas e evolução
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Corridas</p>
                <p className="text-2xl font-bold text-white">{runs.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Distância Total</p>
                <p className="text-2xl font-bold text-white">{totalDistance.toFixed(1)} km</p>
              </div>
              <MapPin className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Tempo Total</p>
                <p className="text-2xl font-bold text-white">{totalHours}h {totalMinutes}m</p>
              </div>
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Runs List */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Histórico de Corridas</h2>
          </div>
          {runs.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-400">
                Você ainda não registrou nenhuma corrida. Que tal começar agora?
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {runs.map((run, index) => (
                <div key={run.id} className="p-6 hover:bg-gray-750 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex items-center space-x-6">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">{index + 1}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-white font-medium">
                            {new Date(run.run_date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        {run.notes && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400 text-sm">{run.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
                      <div className="text-center">
                        <p className="text-gray-400 text-sm">Distância</p>
                        <p className="text-white font-semibold">{run.distance_km} km</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400 text-sm">Tempo</p>
                        <p className="text-white font-semibold">{run.duration_minutes} min</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400 text-sm">Pace</p>
                        <p className="text-white font-semibold">{formatPace(run.pace_min_per_km)} min/km</p>
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
