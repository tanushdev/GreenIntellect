

-- Create the pdf_uploads table
CREATE TABLE public.pdf_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  company_name TEXT NOT NULL,
  report_year TEXT NOT NULL DEFAULT '2023',
  file_name TEXT NOT NULL,
  file_path TEXT,
  upload_status TEXT NOT NULL DEFAULT 'uploaded' CHECK (upload_status IN ('uploaded', 'processing', 'completed', 'failed')),
  processing_progress INTEGER NOT NULL DEFAULT 0 CHECK (processing_progress >= 0 AND processing_progress <= 100),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pdf_uploads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pdf_uploads
CREATE POLICY "Users can view their own uploads" 
  ON public.pdf_uploads 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own uploads" 
  ON public.pdf_uploads 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own uploads" 
  ON public.pdf_uploads 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own uploads" 
  ON public.pdf_uploads 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create the storage bucket for PDF reports
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pdf-reports', 'pdf-reports', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the pdf-reports bucket
CREATE POLICY "Anyone can view PDFs" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'pdf-reports');

CREATE POLICY "Users can upload their own PDFs" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'pdf-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own PDFs" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'pdf-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

