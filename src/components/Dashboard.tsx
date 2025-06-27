
import React, { useState } from 'react';
import { Plus, TrendingUp, Clock, Target, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useProfile } from '@/hooks/useProfile';
import { useRuns } from '@/hooks/useRuns';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import AddRunModal from './AddRunModal';

const Dashboard = () => {
  const [isAddRunModalOpen, setIsAddRunModalOpen] = useState(false);
  const { profile, isLoading: profileLoading } = useProfile();
  const { mostRecentRun } = useRuns();
  const { stats, isLoading: statsLoading } = useDashboardStats();

  // Extract first name from full name
  const getFirstName = (fullName: string | null) => {
    if (!fullName) return 'Corredor';
    return fullName.split(' ')[0];
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatPace = (pace: number) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatGoal = (goal: any) => {
    if (!goal) return 'Defina uma meta!';
    return `Meta: ${goal.target_distance_km}km em ${formatTime(goal.target_time_minutes)}`;
  };

  const statCards = [
    {
      label: 'Corridas Este Mês',
      value: statsLoading ? '...' : stats?.runsThisMonth.toString() || '0',
      change: 'Último mês',
      icon: TrendingUp,
      color: 'text-green-400'
    },
    {
      label: 'Tempo Total (mês)',
      value: statsLoading ? '...' : formatTime(stats?.totalTimeThisMonth || 0),
      change: 'Corridas do mês',
      icon: Clock,
      color: 'text-blue-400'
    },
    {
      label: 'Meta Ativa',
      value: statsLoading ? '...' : formatGoal(stats?.activeGoal),
      change: 'Defina objetivos',
      icon: Target,
      color: 'text-orange-400'
    },
    {
      label: 'Melhor Pace',
      value: statsLoading ? '...' : (stats?.bestPace ? `${formatPace(stats.bestPace)} min/km` : 'N/A'),
      change: 'Recorde pessoal',
      icon: Zap,
      color: 'text-purple-400'
    }
  ];

  const chartConfig = {
    distance: {
      label: "Distância (km)",
      color: "#FFFFFF",
    },
  };

  return (
    <div className="min-h-screen bg-background-primary p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-2">
                Bem-vindo de volta, Corredor! 🏃‍♂️
              </h1>
              <p className="text-text-secondary text-lg">
                {profileLoading ? (
                  'Pronto para mais uma corrida incrível hoje?'
                ) : (
                  `${getFirstName(profile?.full_name)}, pronto para mais uma corrida incrível hoje?`
                )}
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="text-right">
                <p className="text-sm text-text-secondary">Hoje</p>
                <p className="text-xl font-semibold text-text-primary">
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-background-component border border-text-secondary/20 rounded-xl p-6 hover:bg-background-component/80 transition-all duration-200 hover:transform hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`${stat.color} w-8 h-8`} />
                  <div className="text-right">
                    <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                  </div>
                </div>
                <div>
                  <p className="text-text-primary font-medium mb-1">{stat.label}</p>
                  <p className="text-sm text-text-secondary">{stat.change}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="mb-8">
          <button 
            onClick={() => setIsAddRunModalOpen(true)}
            className="group bg-accent-action hover:bg-accent-action/90 text-background-primary px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-3"
          >
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-200" />
            <span>Registrar Nova Corrida</span>
          </button>
        </div>

        {/* Most Recent Run Card */}
        <div className="mb-8">
          <div className="bg-background-component border border-text-secondary/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Última Corrida</h3>
            {mostRecentRun ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-text-secondary text-sm">Data</p>
                  <p className="text-text-primary font-semibold">
                    {new Date(mostRecentRun.run_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-text-secondary text-sm">Distância</p>
                  <p className="text-text-primary font-semibold">{mostRecentRun.distance_km} km</p>
                </div>
                <div className="text-center">
                  <p className="text-text-secondary text-sm">Duração</p>
                  <p className="text-text-primary font-semibold">{mostRecentRun.duration_minutes} min</p>
                </div>
                <div className="text-center">
                  <p className="text-text-secondary text-sm">Pace</p>
                  <p className="text-text-primary font-semibold">{formatPace(mostRecentRun.pace_min_per_km)} min/km</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-text-secondary">
                  Você ainda não registrou nenhuma corrida. Vamos começar!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Charts and Kai's Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Progress Chart */}
          <div className="bg-background-component border border-text-secondary/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-text-primary">Progresso Semanal</h3>
              <span className="text-sm text-text-secondary">Últimos 7 dias</span>
            </div>
            {statsLoading ? (
              <div className="h-48 bg-background-primary rounded-lg flex items-center justify-center">
                <p className="text-text-secondary">Carregando dados...</p>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.weeklyData || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#888888" />
                    <XAxis 
                      dataKey="dayAbbr" 
                      stroke="#888888"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#888888"
                      fontSize={12}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="distance" 
                      fill="var(--color-distance)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </div>

          {/* Kai's Tips */}
          <div className="bg-background-component border border-text-secondary/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-accent-action rounded-full flex items-center justify-center">
                <span className="text-2xl">🐆</span>
              </div>
              <h3 className="text-xl font-semibold text-text-primary">Dica do Kai</h3>
            </div>
            <div className="bg-background-primary rounded-lg p-4">
              <p className="text-text-primary">
                "Toda corrida é uma vitória. Continue assim!"
              </p>
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
