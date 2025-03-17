
import { useState } from 'react';
import { Database, Copy, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { materialService } from '@/services/material';

interface TableErrorAlertProps {
  error: string | null;
  onRefresh: () => void;
}

export function TableErrorAlert({ error, onRefresh }: TableErrorAlertProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Only show if there's a table-related error about the table not existing
  if (!error || !error.includes("tabela") || !error.includes("não existe")) {
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
    setCopied(true);
    toast({
      title: 'Script SQL copiado',
      description: 'Agora você pode executá-lo no painel do Supabase'
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleCreateTable = async () => {
    setIsCreating(true);
    try {
      const { error } = await materialService.createMaterialsTable();
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erro ao criar tabela',
          description: error
        });
      } else {
        toast({
          title: 'Tabela criada com sucesso',
          description: 'A tabela de materiais foi criada no banco de dados'
        });
        
        // Refresh to check if the table now exists
        onRefresh();
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar tabela',
        description: error.message || 'Ocorreu um erro ao criar a tabela de materiais'
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Alert variant="destructive" className="mb-6">
      <Database className="h-4 w-4" />
      <AlertTitle>A tabela de materiais não existe</AlertTitle>
      <AlertDescription>
        <p className="mb-4">
          A tabela de materiais precisa ser criada no banco de dados Supabase.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant="outline" 
            onClick={() => setShowScript(!showScript)}
            className="mt-2"
          >
            {showScript ? 'Ocultar Script SQL' : 'Mostrar Script SQL'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleCopyScript}
            className="mt-2"
          >
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? 'Copiado!' : 'Copiar Script SQL'}
          </Button>

          <Button 
            variant="default"
            onClick={handleCreateTable}
            disabled={isCreating}
            className="mt-2"
          >
            {isCreating ? 'Criando...' : 'Criar Tabela'}
          </Button>
        </div>
        
        {showScript && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <pre className="text-xs overflow-auto whitespace-pre-wrap bg-muted p-2 rounded">
                {getSqlScript()}
              </pre>
            </CardContent>
          </Card>
        )}
      </AlertDescription>
    </Alert>
  );
}
