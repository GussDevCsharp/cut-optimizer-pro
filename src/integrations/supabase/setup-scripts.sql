
-- Create profiles table (if it doesn't exist already)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create subscription plans table
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  duration_days INTEGER NOT NULL,
  features JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user subscriptions table
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES subscription_plans(id) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'expired')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  expiration_date TIMESTAMP WITH TIME ZONE NOT NULL,
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create payment history table
CREATE TABLE payment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subscription_id UUID REFERENCES user_subscriptions(id) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'card', 'boleto')),
  payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'approved', 'rejected', 'error')),
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create leads table for marketing purposes
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('new', 'contacted', 'converted', 'lost')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price, duration_days, features, is_active)
VALUES 
  ('Básico', 'Plano básico com recursos essenciais', 19.90, 30, '["Otimização de cortes", "Até 50 projetos"]', TRUE),
  ('Profissional', 'Plano profissional com recursos avançados', 49.90, 30, '["Otimização de cortes", "Projetos ilimitados", "Exportação em PDF"]', TRUE),
  ('Empresarial', 'Plano empresarial completo', 99.90, 30, '["Otimização de cortes", "Projetos ilimitados", "Exportação em PDF", "Múltiplos usuários", "Suporte prioritário"]', TRUE);

-- Create RLS policies for the tables
-- Policy for subscription_plans (public read)
CREATE POLICY subscription_plans_select_policy ON subscription_plans 
  FOR SELECT USING (TRUE);

-- Policies for user_subscriptions
CREATE POLICY user_subscriptions_select_policy ON user_subscriptions 
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND email = 'gustavo@softcomfortaleza.com.br'
  ));

CREATE POLICY user_subscriptions_insert_policy ON user_subscriptions 
  FOR INSERT WITH CHECK (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND email = 'gustavo@softcomfortaleza.com.br'
  ));

CREATE POLICY user_subscriptions_update_policy ON user_subscriptions 
  FOR UPDATE USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND email = 'gustavo@softcomfortaleza.com.br'
  ));

-- Policies for payment_history
CREATE POLICY payment_history_select_policy ON payment_history 
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND email = 'gustavo@softcomfortaleza.com.br'
  ));

CREATE POLICY payment_history_insert_policy ON payment_history 
  FOR INSERT WITH CHECK (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND email = 'gustavo@softcomfortaleza.com.br'
  ));

-- Policies for leads table
CREATE POLICY leads_select_policy ON leads 
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND email = 'gustavo@softcomfortaleza.com.br'
  ));

CREATE POLICY leads_insert_policy ON leads 
  FOR INSERT WITH CHECK (TRUE); -- Allow public inserts for lead capture

-- Enable RLS on the tables
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
