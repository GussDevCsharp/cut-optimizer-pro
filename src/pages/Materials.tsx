
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { materialService } from '@/services/materialService';
import type { Material } from '@/types/material';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, Plus, ArrowLeft, Database } from 'lucide-react';
import { MaterialForm } from '@/components/materials/MaterialForm';
import { MaterialsTable } from '@/components/materials/MaterialsTable';
import { UserMenu } from '@/components/dashboard/UserMenu';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Materials() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');
  const [tableError, setTableError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadMaterials();
    }
  }, [user]);

  const loadMaterials = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setTableError(null);
    try {
      const { data, error } = await materialService.getMaterials(user.id);
      
      if (error) {
        setTableError(error);
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar materiais',
          description: error
        });
      } else if (data) {
        setMaterials(data);
      }
    } catch (error: any) {
      console.error('Failed to load materials', error);
      setTableError('Erro ao carregar materiais');
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar materiais',
        description: 'Não foi possível carregar seus materiais'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedMaterial(null);
    setActiveTab('form');
  };

  const handleEdit = (material: Material) => {
    setSelectedMaterial(material);
    setActiveTab('form');
  };

  const handleFormSuccess = () => {
    loadMaterials();
    setActiveTab('list');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

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
    <Layout>
      <div className={`${isMobile ? 'px-2 py-2' : 'container mx-auto p-4'}`}>
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBackToDashboard} 
              className="mr-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>
                Cadastro de Materiais
              </h1>
              <p className="text-muted-foreground text-sm">
                Gerencie os materiais disponíveis para seus planos de corte
              </p>
            </div>
          </div>
          
          {!isMobile && <UserMenu userName={user?.name} onLogout={handleLogout} />}
        </div>

        {tableError && tableError.includes("tabela") && (
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
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="list">Lista de Materiais</TabsTrigger>
              <TabsTrigger value="form">
                {selectedMaterial ? 'Editar Material' : 'Novo Material'}
              </TabsTrigger>
            </TabsList>
            
            {activeTab === 'list' && (
              <Button onClick={handleAddNew}>
                <Plus size={16} className="mr-2" />
                Novo Material
              </Button>
            )}
          </div>
          
          <TabsContent value="list">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers size={18} />
                  Materiais Cadastrados
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                ) : (
                  <MaterialsTable 
                    materials={materials}
                    onEdit={handleEdit}
                    onRefresh={loadMaterials}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="form">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers size={18} />
                  {selectedMaterial ? 'Editar Material' : 'Novo Material'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MaterialForm 
                  material={selectedMaterial || undefined}
                  onSuccess={handleFormSuccess}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
