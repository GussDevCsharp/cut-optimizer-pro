
-- Create payment_logs table for storing transaction logs
CREATE TABLE IF NOT EXISTS payment_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  product_id TEXT,
  product_name TEXT,
  price NUMERIC(10, 2),
  payment_method TEXT CHECK (payment_method IN ('pix', 'card', 'boleto')),
  status TEXT CHECK (status IN ('pending', 'processing', 'approved', 'rejected', 'error')),
  payment_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_sandbox BOOLEAN DEFAULT true,
  user_agent TEXT,
  card_type TEXT,
  installments INTEGER,
  customer_email TEXT,
  metadata JSONB
);

-- Add RLS policies to payment_logs table
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to see their own logs
CREATE POLICY payment_logs_select_policy ON payment_logs 
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND email = 'gustavo@softcomfortaleza.com.br'
  ));

-- Allow authenticated users and anonymous users to insert logs
CREATE POLICY payment_logs_insert_policy ON payment_logs 
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL OR auth.role() = 'authenticated');

-- Allow admins to see all logs
CREATE POLICY payment_logs_admin_select_policy ON payment_logs
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND email = 'gustavo@softcomfortaleza.com.br'
  ));

-- Create an RPC function to insert payment logs with less strict RLS
-- This function allows anyone to insert a payment log
CREATE OR REPLACE FUNCTION insert_payment_log(log_data JSONB)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER -- This bypasses RLS
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO payment_logs (
    timestamp,
    product_id,
    product_name,
    price,
    payment_method,
    status,
    payment_id,
    user_id,
    is_sandbox,
    user_agent,
    customer_email,
    metadata
  ) VALUES (
    (log_data->>'timestamp')::TIMESTAMP WITH TIME ZONE,
    log_data->>'product_id',
    log_data->>'product_name',
    (log_data->>'price')::NUMERIC,
    log_data->>'payment_method',
    log_data->>'status',
    log_data->>'payment_id',
    (log_data->>'user_id')::UUID,
    (log_data->>'is_sandbox')::BOOLEAN,
    log_data->>'user_agent',
    log_data->>'customer_email',
    log_data->'metadata'
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;
