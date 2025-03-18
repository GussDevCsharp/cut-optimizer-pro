
-- Create a function to initialize the materials table
CREATE OR REPLACE FUNCTION init_materials_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the table already exists
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'materials') THEN
    -- Create the materials table
    CREATE TABLE materials (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL,
      price DECIMAL,
      unit TEXT NOT NULL,
      thickness DECIMAL,
      width DECIMAL,
      height DECIMAL,
      stock_quantity INTEGER,
      supplier TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create an index on user_id for faster queries
    CREATE INDEX materials_user_id_idx ON materials(user_id);
    
    -- Create a trigger to update the updated_at column
    CREATE TRIGGER set_materials_updated_at
    BEFORE UPDATE ON materials
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
    
    -- Create an RLS policy for materials
    ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
    
    -- Create policies for insert, select, update, and delete
    CREATE POLICY "Users can insert their own materials" 
      ON materials FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
      
    CREATE POLICY "Users can view their own materials" 
      ON materials FOR SELECT 
      USING (auth.uid() = user_id);
      
    CREATE POLICY "Users can update their own materials" 
      ON materials FOR UPDATE 
      USING (auth.uid() = user_id);
      
    CREATE POLICY "Users can delete their own materials" 
      ON materials FOR DELETE 
      USING (auth.uid() = user_id);
  END IF;
END;
$$;

-- Create the updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
