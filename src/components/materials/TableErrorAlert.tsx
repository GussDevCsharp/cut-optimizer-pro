
import { useState } from 'react';
import { Database } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface TableErrorAlertProps {
  error: string | null;
}

export function TableErrorAlert({ error }: TableErrorAlertProps) {
  const { toast } = useToast();
  
  // Only show if there's a table-related error
  if (!error || !error.includes("tabela")) {
    return null;
  }

  const getSqlScript = () => {
    return `
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
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(getSqlScript());
    toast({
      title: 'Script SQL copiado',
      description: 'Agora você pode executá-lo no painel do Supabase'
    });
  };

  return (
    <Alert variant="destructive" className="mb-6">
      <Database className="h-4 w-4" />
      <AlertTitle>A tabela de materiais não existe</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          É necessário criar a tabela de materiais no banco de dados Supabase. 
          Copie o script SQL abaixo e execute-o no painel do Supabase (SQL Editor).
        </p>
        <Button 
          variant="outline" 
          onClick={handleCopyScript}
          className="mt-2"
        >
          Copiar Script SQL
        </Button>
      </AlertDescription>
    </Alert>
  );
}
