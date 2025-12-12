create table if not exists publication_topics (
  id uuid default gen_random_uuid() primary key,
  publication_id uuid references publications(id) on delete cascade not null,
  title text not null,
  order_index integer not null,
  assigned_user_id uuid references auth.users(id),
  status text default 'open' check (status in ('open', 'assigned')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(publication_id, order_index)
);

-- RLS
alter table publication_topics enable row level security;

create policy "Publications topics are viewable by everyone"
  on publication_topics for select
  using ( true );

create policy "Admins can insert topics"
  on publication_topics for insert
  with check ( 
    auth.role() = 'service_role' 
    or exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can update topics"
  on publication_topics for update
  using ( 
    auth.role() = 'service_role' 
    or exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
  
create policy "Users can update assigned topics"
  on publication_topics for update
  using ( auth.uid() = assigned_user_id );

-- Add topic_id to submissions for direct linking (optional but good practice)
alter table publication_submissions 
add column if not exists topic_id uuid references publication_topics(id);
