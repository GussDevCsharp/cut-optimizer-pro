
-- Function to create the leads table if it doesn't exist
create or replace function create_leads_table()
returns void
language plpgsql
security definer
as $$
begin
  -- Check if the leads table already exists
  if not exists (
    select from pg_tables
    where schemaname = 'public'
    and tablename = 'leads'
  ) then
    -- Create the leads table
    create table public.leads (
      id uuid primary key default uuid_generate_v4(),
      name text not null,
      email text not null,
      address text,
      phone text,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now(),
      status text default 'pending', -- pending, converted, canceled
      payment_id text,
      source text,
      notes text
    );

    -- Add comment to table
    comment on table public.leads is 'Table for storing potential customers before they complete payment';

    -- Set up Row Level Security
    alter table public.leads enable row level security;

    -- Create policies
    create policy "Leads are viewable by admins"
      on public.leads
      for select
      to authenticated
      using (
        exists (
          select 1 from public.profiles
          where profiles.id = auth.uid()
          and profiles.is_admin = true
        )
      );

    create policy "Leads can be inserted by anyone"
      on public.leads
      for insert
      to anon, authenticated
      with check (true);

    create policy "Leads can be updated by admins"
      on public.leads
      for update
      to authenticated
      using (
        exists (
          select 1 from public.profiles
          where profiles.id = auth.uid()
          and profiles.is_admin = true
        )
      );
  end if;
end;
$$;

-- Execute the function to create the table
select create_leads_table();
