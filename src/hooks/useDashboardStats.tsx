
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DashboardStats {
  runsThisMonth: number;
  totalTimeThisMonth: number;
  activeGoal: {
    target_distance_km: number;
    target_time_minutes: number;
  } | null;
  bestPace: number | null;
  weeklyData: Array<{
    day: string;
    dayAbbr: string;
    distance: number;
  }>;
}

export const useDashboardStats = () => {
  const { user } = useAuth();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async (): Promise<DashboardStats> => {
      if (!user) throw new Error('User not authenticated');

      // Get current month boundaries
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      // Get last 7 days boundaries
      const today = new Date();
      const last7Days = new Date(today);
      last7Days.setDate(today.getDate() - 6);

      // Runs this month
      const { data: monthlyRuns, error: monthlyError } = await supabase
        .from('runs')
        .select('duration_minutes')
        .eq('user_id', user.id)
        .gte('run_date', startOfMonth.toISOString())
        .lte('run_date', endOfMonth.toISOString());

      if (monthlyError) throw monthlyError;

      const runsThisMonth = monthlyRuns?.length || 0;
      const totalTimeThisMonth = monthlyRuns?.reduce((sum, run) => sum + run.duration_minutes, 0) || 0;

      // Active goal
      const { data: activeGoal, error: goalError } = await supabase
        .from('goals')
        .select('target_distance_km, target_time_minutes')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (goalError && goalError.code !== 'PGRST116') throw goalError;

      // Best pace
      const { data: bestPaceData, error: paceError } = await supabase
        .from('runs')
        .select('pace_min_per_km')
        .eq('user_id', user.id)
        .order('pace_min_per_km', { ascending: true })
        .limit(1);

      if (paceError) throw paceError;

      const bestPace = bestPaceData?.[0]?.pace_min_per_km || null;

      // Weekly data
      const { data: weeklyRuns, error: weeklyError } = await supabase
        .from('runs')
        .select('run_date, distance_km')
        .eq('user_id', user.id)
        .gte('run_date', last7Days.toISOString())
        .lte('run_date', today.toISOString());

      if (weeklyError) throw weeklyError;

      // Process weekly data
      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const weeklyData = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayOfWeek = date.getDay();
        const dateStr = date.toISOString().split('T')[0];
        
        const dayRuns = weeklyRuns?.filter(run => 
          run.run_date.startsWith(dateStr)
        ) || [];
        
        const totalDistance = dayRuns.reduce((sum, run) => sum + run.distance_km, 0);

        weeklyData.push({
          day: date.toLocaleDateString('pt-BR', { weekday: 'long' }),
          dayAbbr: dayNames[dayOfWeek],
          distance: totalDistance
        });
      }

      return {
        runsThisMonth,
        totalTimeThisMonth,
        activeGoal: activeGoal || null,
        bestPace,
        weeklyData
      };
    },
    enabled: !!user,
  });

  return {
    stats,
    isLoading,
    error,
  };
};
