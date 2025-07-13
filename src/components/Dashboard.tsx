
import React, { useState } from 'react';
import { Plus, TrendingUp, Clock, Target, Zap, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
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
      color: "hsl(var(--accent-action))",
    },
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
            Olá, {profileLoading ? 'Corredor' : getFirstName(profile?.full_name)}! 👋
          </h1>
          <p className="text-text-secondary text-base md:text-lg">
            Pronto para mais uma corrida incrível hoje?
          </p>
        </div>

        {/* CTA Button - Moved to top */}
        <div className="flex justify-center">
          <button 
            onClick={() => setIsAddRunModalOpen(true)}
            className="group bg-gradient-to-r from-accent-action to-accent-action/80 hover:from-accent-action/90 hover:to-accent-action/70 text-background-primary px-6 py-3 md:px-8 md:py-4 rounded-2xl font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 w-full max-w-sm"
          >
            <div className="bg-white/20 rounded-full p-1">
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </div>
            <span>Registrar Nova Corrida</span>
          </button>
        </div>

        {/* Stats Grid with Modern Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-background-component via-background-component to-background-component/80 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-5 hover:shadow-xl hover:scale-105 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-2">
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-accent-action" />
                    </div>
                    <div className="text-right">
                      <p className="text-lg md:text-xl font-bold text-text-primary">{stat.value}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-text-primary font-medium text-xs md:text-sm mb-1">{stat.label}</p>
                    <p className="text-xs text-text-secondary/80">{stat.change}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Weekly Progress Chart - Full Width and Larger */}
        <div className="bg-gradient-to-br from-background-component via-background-component to-background-component/90 border border-white/10 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-accent-action/20 to-accent-action/10 rounded-xl p-2">
                <Activity className="w-5 h-5 text-accent-action" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">Progresso Semanal</h3>
            </div>
            <span className="text-sm text-text-secondary bg-background-primary/50 px-3 py-1 rounded-full">Últimos 7 dias</span>
          </div>
          {statsLoading ? (
            <div className="h-64 bg-gradient-to-br from-background-primary/50 to-background-primary/20 rounded-xl flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-accent-action border-t-transparent"></div>
                <p className="text-text-secondary">Carregando dados...</p>
              </div>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.weeklyData || []} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="distanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent-action))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--accent-action))" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--text-secondary) / 0.2)" />
                  <XAxis 
                    dataKey="dayAbbr" 
                    stroke="hsl(var(--text-secondary))"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--text-secondary))"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background-component))',
                      border: '1px solid hsl(var(--text-secondary) / 0.2)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone"
                    dataKey="distance" 
                    stroke="hsl(var(--accent-action))"
                    strokeWidth={3}
                    fill="url(#distanceGradient)"
                    dot={{ fill: 'hsl(var(--accent-action))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: 'hsl(var(--accent-action))', strokeWidth: 2, stroke: 'hsl(var(--background-primary))' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </div>

        {/* Cards Row - Recent Run and Kai's Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Most Recent Run Card */}
          <div className="bg-gradient-to-br from-background-component via-background-component to-background-component/90 border border-white/10 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-accent-action/20 to-accent-action/10 rounded-xl p-2">
                <Clock className="w-5 h-5 text-accent-action" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">Última Corrida</h3>
            </div>
            {mostRecentRun ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background-primary/30 rounded-xl p-3 text-center">
                  <p className="text-text-secondary text-xs mb-1">Data</p>
                  <p className="text-text-primary font-semibold text-sm">
                    {new Date(mostRecentRun.run_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="bg-background-primary/30 rounded-xl p-3 text-center">
                  <p className="text-text-secondary text-xs mb-1">Distância</p>
                  <p className="text-text-primary font-semibold text-sm">{mostRecentRun.distance_km} km</p>
                </div>
                <div className="bg-background-primary/30 rounded-xl p-3 text-center">
                  <p className="text-text-secondary text-xs mb-1">Duração</p>
                  <p className="text-text-primary font-semibold text-sm">{mostRecentRun.duration_minutes} min</p>
                </div>
                <div className="bg-background-primary/30 rounded-xl p-3 text-center">
                  <p className="text-text-secondary text-xs mb-1">Pace</p>
                  <p className="text-text-primary font-semibold text-sm">{formatPace(mostRecentRun.pace_min_per_km)} min/km</p>
                </div>
              </div>
            ) : (
              <div className="bg-background-primary/30 rounded-xl p-6 text-center">
                <p className="text-text-secondary">
                  Você ainda não registrou nenhuma corrida. Vamos começar!
                </p>
              </div>
            )}
          </div>

          {/* Kai's Tips */}
          <div className="bg-gradient-to-br from-background-component via-background-component to-background-component/90 border border-white/10 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/40ad6510-de2a-4e91-b092-e75e0c586e7c.png" 
                alt="Mascote Kai" 
                className="h-10 w-10 rounded-full object-cover ring-2 ring-accent-action/20"
              />
              <h3 className="text-xl font-semibold text-text-primary">Dica do Kai</h3>
            </div>
            <div className="bg-gradient-to-br from-background-primary/50 to-background-primary/30 rounded-xl p-4 border border-white/5">
              <p className="text-text-primary italic">
                "Toda corrida é uma vitória. Continue assim! 🏃‍♂️✨"
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
