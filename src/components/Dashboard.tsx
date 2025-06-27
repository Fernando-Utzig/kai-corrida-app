
import React, { useState } from 'react';
import { Plus, TrendingUp, Clock, Target, Zap } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useRuns } from '@/hooks/useRuns';
import AddRunModal from './AddRunModal';

const Dashboard = () => {
  const [isAddRunModalOpen, setIsAddRunModalOpen] = useState(false);
  const { profile, isLoading: profileLoading } = useProfile();
  const { mostRecentRun, runs } = useRuns();

  // Extract first name from full name
  const getFirstName = (fullName: string | null) => {
    if (!fullName) return 'Corredor';
    return fullName.split(' ')[0];
  };

  const stats = [
    {
      label: 'Corridas Este Mês',
      value: runs.length.toString(),
      change: '+3 da semana passada',
      icon: TrendingUp,
      color: 'text-green-400'
    },
    {
      label: 'Tempo Total',
      value: '18h 45m',
      change: 'Último mês: 15h 20m',
      icon: Clock,
      color: 'text-blue-400'
    },
    {
      label: 'Meta Mensal',
      value: '80%',
      change: '16/20 corridas',
      icon: Target,
      color: 'text-orange-400'
    },
    {
      label: 'Melhor Pace',
      value: '4:32',
      change: 'min/km esta semana',
      icon: Zap,
      color: 'text-purple-400'
    }
  ];

  const formatPace = (pace: number) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Bem-vindo de volta, Corredor! 🏃‍♂️
              </h1>
              <p className="text-gray-400 text-lg">
                {profileLoading ? (
                  'Pronto para mais uma corrida incrível hoje?'
                ) : (
                  `${getFirstName(profile?.full_name)}, pronto para mais uma corrida incrível hoje?`
                )}
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="text-right">
                <p className="text-sm text-gray-400">Hoje</p>
                <p className="text-xl font-semibold text-white">
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Most Recent Run Card */}
        <div className="mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Última Corrida</h3>
            {mostRecentRun ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Data</p>
                  <p className="text-white font-semibold">
                    {new Date(mostRecentRun.run_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Distância</p>
                  <p className="text-white font-semibold">{mostRecentRun.distance_km} km</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Duração</p>
                  <p className="text-white font-semibold">{mostRecentRun.duration_minutes} min</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Pace</p>
                  <p className="text-white font-semibold">{formatPace(mostRecentRun.pace_min_per_km)} min/km</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400">
                  Você ainda não registrou nenhuma corrida. Vamos começar!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mb-8">
          <button 
            onClick={() => setIsAddRunModalOpen(true)}
            className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-3"
          >
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-200" />
            <span>Registrar Nova Corrida</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:bg-gray-750 transition-all duration-200 hover:transform hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`${stat.color} w-8 h-8`} />
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-300 font-medium mb-1">{stat.label}</p>
                  <p className="text-sm text-gray-400">{stat.change}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Kai's Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🐆</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Dica do Kai</h3>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-300">
                "Toda corrida é uma vitória. Continue assim!"
              </p>
            </div>
          </div>

          {/* Progress Chart Placeholder */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Progresso Semanal</h3>
              <span className="text-sm text-gray-400">Últimos 7 dias</span>
            </div>
            <div className="h-48 bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-orange-400 mx-auto mb-2" />
                <p className="text-gray-400">Gráfico de progresso em breve</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddRunModal 
        isOpen={isAddRunModalOpen} 
        onClose={() => setIsAddRunModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
