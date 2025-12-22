/*
  # Create Storage Bucket for Member Documents

  1. Storage Setup
    - Create `member-documents` bucket
    - Set up proper policies for file uploads
    - Allow public access for uploaded files

  2. Security
    - Allow public uploads to the bucket
    - Allow public access to view uploaded files
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('member-documents', 'member-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public uploads to the bucket
CREATE POLICY "Anyone can upload member documents"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'member-documents');

-- Allow public access to view uploaded files
CREATE POLICY "Anyone can view member documents"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'member-documents');

-- Allow public updates to member documents
CREATE POLICY "Anyone can update member documents"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'member-documents');

-- Allow public deletion of member documents
CREATE POLICY "Anyone can delete member documents"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'member-documents');