
-- Create the sequence first
CREATE SEQUENCE IF NOT EXISTS training_plan_runs_id_seq;

-- Create the training_plan_runs table
CREATE TABLE public.training_plan_runs (
  id BIGINT NOT NULL DEFAULT nextval('training_plan_runs_id_seq'::regclass) PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  goal_id BIGINT,
  suggested_run_date DATE NOT NULL,
  suggested_distance_km DOUBLE PRECISION NOT NULL,
  suggested_duration_minutes DOUBLE PRECISION,
  run_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente'
);

-- Add Row Level Security (RLS)
ALTER TABLE public.training_plan_runs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own training plan runs" 
  ON public.training_plan_runs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own training plan runs" 
  ON public.training_plan_runs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own training plan runs" 
  ON public.training_plan_runs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own training plan runs" 
  ON public.training_plan_runs 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add foreign key constraints
ALTER TABLE public.training_plan_runs
ADD CONSTRAINT fk_training_plan_runs_goal_id
FOREIGN KEY (goal_id) REFERENCES public.goals(id);
