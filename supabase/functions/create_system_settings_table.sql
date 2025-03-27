
CREATE OR REPLACE FUNCTION public.create_system_settings_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if table exists
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = 'system_settings'
  ) THEN
    -- Create the table
    CREATE TABLE public.system_settings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      key TEXT NOT NULL UNIQUE,
      settings JSONB NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Set up RLS
    ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
    
    -- Create policy for admin access
    CREATE POLICY "Allow full access for admins" ON public.system_settings
      USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND email = 'gustavo@softcomfortaleza.com.br'
      ))
      WITH CHECK (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND email = 'gustavo@softcomfortaleza.com.br'
      ));
      
    -- Create policy for read access
    CREATE POLICY "Allow read access for all authenticated users" ON public.system_settings
      FOR SELECT
      USING (auth.role() = 'authenticated');
  END IF;
END;
$$;

