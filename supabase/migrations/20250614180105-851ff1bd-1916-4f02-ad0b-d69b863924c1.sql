
-- Update the check constraint to include 'pending' as a valid upload status
ALTER TABLE public.pdf_uploads DROP CONSTRAINT pdf_uploads_upload_status_check;

ALTER TABLE public.pdf_uploads ADD CONSTRAINT pdf_uploads_upload_status_check 
CHECK (upload_status IN ('pending', 'uploaded', 'processing', 'completed', 'failed'));
