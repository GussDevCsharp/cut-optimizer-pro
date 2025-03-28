
-- Function to add the address column to the profiles table if it doesn't exist
create or replace function add_address_to_profiles()
returns void
language plpgsql
security definer
as $$
begin
  -- Check if the address column already exists
  if not exists (
    select from information_schema.columns
    where table_schema = 'public'
    and table_name = 'profiles'
    and column_name = 'address'
  ) then
    -- Add the address column to the profiles table
    alter table public.profiles
    add column address text;

    -- Add comment to the new column
    comment on column public.profiles.address is 'User address information';
  end if;
end;
$$;

-- Execute the function to add the column
select add_address_to_profiles();
