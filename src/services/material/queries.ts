
import { supabase } from "@/integrations/supabase/client";

// Directly access the materials table using our typed Supabase client
export const materialsTable = () => supabase.from('materials');

// SQL script to create the materials table and set up RLS
export const createTableScript = `
  -- Criar a tabela de materiais
  CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    description TEXT NOT NULL,
    thickness NUMERIC NOT NULL,
    width NUMERIC NOT NULL,
    height NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
  );

  -- Configurar RLS (Row Level Security)
  ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

  -- Política para permitir que usuários vejam apenas seus próprios materiais
  CREATE POLICY "Users can view their own materials" 
  ON public.materials FOR SELECT 
  USING (auth.uid() = user_id);

  -- Política para permitir que usuários criem seus próprios materiais
  CREATE POLICY "Users can insert their own materials" 
  ON public.materials FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

  -- Política para permitir que usuários atualizem seus próprios materiais
  CREATE POLICY "Users can update their own materials" 
  ON public.materials FOR UPDATE
  USING (auth.uid() = user_id);

  -- Política para permitir que usuários excluam seus próprios materiais
  CREATE POLICY "Users can delete their own materials" 
  ON public.materials FOR DELETE
  USING (auth.uid() = user_id);

  -- Conceder permissões ao papel anônimo e autenticado
  GRANT ALL ON public.materials TO anon, authenticated;
`;
