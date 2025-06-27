
import React from 'react';
import { Brain, Calendar, MapPin, Clock, Zap } from 'lucide-react';
import { useTrainingPlan } from '@/hooks/useTrainingPlan';
import { Button } from '@/components/ui/button';

const IntelligentPlan = () => {
  const { nextRun, upcomingRuns, isLoading, generateNextRun, isGenerating } = useTrainingPlan();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const formatDistance = (distance: number) => {
    return `${distance} km`;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Plano Inteligente 🧠
          </h1>
          <p className="text-gray-400 text-lg">
            Deixe o Kai criar seu plano de treino personalizado
          </p>
        </div>

        {/* Generate Button */}
        <div className="mb-8">
          <Button
            onClick={() => generateNextRun()}
            disabled={isGenerating || isLoading}
            className="w-full lg:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <Brain size={32} className="animate-pulse" />
            <span>
              {isGenerating ? 'Kai está pensando...' : 'Kai, qual meu próximo treino?'}
            </span>
          </Button>
        </div>

        {/* Next Challenge */}
        {nextRun && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Seu Próximo Desafio 🎯
            </h2>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:bg-gray-750 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{nextRun.run_type}</h3>
                    <p className="text-gray-400 text-sm">Sugerido pelo Kai</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-orange-500 text-white text-sm rounded-full font-medium">
                  {nextRun.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Data Sugerida</p>
                    <p className="text-white font-semibold">{formatDate(nextRun.suggested_run_date)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Distância</p>
                    <p className="text-white font-semibold">{formatDistance(nextRun.suggested_distance_km)}</p>
                  </div>
                </div>
                {nextRun.suggested_duration_minutes && (
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Duração Estimada</p>
                      <p className="text-white font-semibold">{nextRun.suggested_duration_minutes} min</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Runs */}
        {upcomingRuns.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Próximas Semanas 📅
            </h2>
            <div className="space-y-4">
              {upcomingRuns.map((run) => (
                <div key={run.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4 opacity-75">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-300">•</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{run.run_type}</p>
                        <p className="text-gray-400 text-sm">{formatDate(run.suggested_run_date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{formatDistance(run.suggested_distance_km)}</p>
                      <p className="text-gray-400 text-sm">Planejado</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !nextRun && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhum treino planejado
            </h3>
            <p className="text-gray-400 mb-6">
              Clique no botão acima para que o Kai crie seu próximo desafio
            </p>
          </div>
        )}

        {/* Kai's Tip */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">🐆</span>
            </div>
            <h3 className="text-xl font-semibold text-white">Dica do Kai</h3>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-300">
              "Meu algoritmo analisa seu histórico de corridas e cria treinos progressivos 
              para você evoluir de forma segura e eficiente. Confie no processo! 🚀"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligentPlan;
