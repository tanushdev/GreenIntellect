
-- Create table for analyzed companies
CREATE TABLE public.analyzed_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT,
  headquarters TEXT,
  report_year TEXT,
  report_type TEXT,
  pages_analyzed INTEGER DEFAULT 0,
  last_updated TEXT,
  overall_score INTEGER DEFAULT 0,
  focus_score INTEGER DEFAULT 0,
  environment_score INTEGER DEFAULT 0,
  claims_score INTEGER DEFAULT 0,
  actions_score INTEGER DEFAULT 0,
  net_action_direction TEXT CHECK (net_action_direction IN ('positive', 'negative', 'neutral')),
  key_findings JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to control access
ALTER TABLE public.analyzed_companies ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access (you may need to adjust this based on your admin role setup)
CREATE POLICY "Admin can manage analyzed companies" 
  ON public.analyzed_companies 
  FOR ALL 
  USING (true);

-- Create policy for users to view analyzed companies
CREATE POLICY "Users can view analyzed companies" 
  ON public.analyzed_companies 
  FOR SELECT 
  USING (true);
