
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface TrainingPlanRun {
  id: number;
  user_id: string;
  created_at: string;
  goal_id: number | null;
  suggested_run_date: string;
  suggested_distance_km: number;
  suggested_duration_minutes: number | null;
  run_type: string;
  status: string;
}

export const useTrainingPlan = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingRuns = [], isLoading } = useQuery({
    queryKey: ['training-plan-runs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('training_plan_runs')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'Pendente')
        .order('suggested_run_date', { ascending: true });

      if (error) throw error;
      return data as TrainingPlanRun[];
    },
    enabled: !!user,
  });

  const generateNextRunMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get the user's most recent run
      const { data: lastRun, error: lastRunError } = await supabase
        .from('runs')
        .select('*')
        .eq('user_id', user.id)
        .order('run_date', { ascending: false })
        .limit(1)
        .single();

      if (lastRunError && lastRunError.code !== 'PGRST116') {
        throw lastRunError;
      }

      // Generate next run parameters
      let suggestedDistance = 5; // Default distance if no previous runs
      let suggestedDate = new Date();
      
      if (lastRun) {
        // Increase distance by 5-10%
        const increasePercent = 0.05 + Math.random() * 0.05; // 5-10%
        suggestedDistance = Math.round((lastRun.distance_km * (1 + increasePercent)) * 10) / 10;
        
        // Set date to 2 days after last run
        suggestedDate = new Date(lastRun.run_date);
        suggestedDate.setDate(suggestedDate.getDate() + 2);
      } else {
        // If no previous runs, suggest tomorrow
        suggestedDate.setDate(suggestedDate.getDate() + 1);
      }

      // Insert new training plan run
      const { data, error } = await supabase
        .from('training_plan_runs')
        .insert({
          user_id: user.id,
          suggested_run_date: suggestedDate.toISOString().split('T')[0],
          suggested_distance_km: suggestedDistance,
          run_type: 'Corrida Leve',
          status: 'Pendente'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-plan-runs'] });
      toast({
        title: "Plano Atualizado!",
        description: (
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🐆</span>
            </div>
            <div>
              <p className="text-sm text-gray-400">Kai criou seu próximo treino. Vamos nessa!</p>
            </div>
          </div>
        ),
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar o próximo treino. Tente novamente.',
        variant: 'destructive',
      });
      console.error('Error generating next run:', error);
    },
  });

  const nextRun = pendingRuns.length > 0 ? pendingRuns[0] : null;
  const upcomingRuns = pendingRuns.slice(1);

  return {
    pendingRuns,
    nextRun,
    upcomingRuns,
    isLoading,
    generateNextRun: generateNextRunMutation.mutate,
    isGenerating: generateNextRunMutation.isPending,
  };
};
