-- Migration: 003_storage_bucket.sql

-- Insert the 'documents' bucket into the storage.buckets table
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

-- Set up RLS policies for the documents bucket
create policy "Documents are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'documents' );

create policy "Users can upload documents"
  on storage.objects for insert
  with check ( bucket_id = 'documents' );

create policy "Users can update their own documents"
  on storage.objects for update
  using ( bucket_id = 'documents' );
