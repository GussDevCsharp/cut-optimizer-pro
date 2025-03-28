
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

-- Allow authenticated users to insert logs
CREATE POLICY payment_logs_insert_policy ON payment_logs 
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.role() = 'authenticated');

-- Allow admins to see all logs
CREATE POLICY payment_logs_admin_select_policy ON payment_logs
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND email = 'gustavo@softcomfortaleza.com.br'
  ));
