
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Run {
  id: number;
  run_date: string;
  distance_km: number;
  duration_minutes: number;
  pace_min_per_km: number;
  notes?: string;
}

export interface NewRun {
  run_date: string;
  distance_km: number;
  duration_minutes: number;
  notes?: string;
}

export const useRuns = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: runs = [], isLoading, error } = useQuery({
    queryKey: ['runs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('runs')
        .select('*')
        .eq('user_id', user.id)
        .order('run_date', { ascending: false });

      if (error) throw error;
      return data as Run[];
    },
    enabled: !!user,
  });

  const addRunMutation = useMutation({
    mutationFn: async (newRun: NewRun) => {
      if (!user) throw new Error('User not authenticated');

      const pace = newRun.duration_minutes / newRun.distance_km;
      
      const { data, error } = await supabase
        .from('runs')
        .insert({
          user_id: user.id,
          run_date: newRun.run_date,
          distance_km: newRun.distance_km,
          duration_minutes: newRun.duration_minutes,
          pace_min_per_km: pace,
          notes: newRun.notes || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['runs'] });
      toast({
        title: "Parabéns!",
        description: (
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">👍</span>
            </div>
            <div>
              <p className="text-sm text-gray-400">Corrida registrada com sucesso. Continue assim!</p>
            </div>
          </div>
        ),
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Não foi possível registrar a corrida. Tente novamente.',
        variant: 'destructive',
      });
      console.error('Error adding run:', error);
    },
  });

  const mostRecentRun = runs.length > 0 ? runs[0] : null;

  return {
    runs,
    isLoading,
    error,
    mostRecentRun,
    addRun: addRunMutation.mutate,
    isAddingRun: addRunMutation.isPending,
  };
};
