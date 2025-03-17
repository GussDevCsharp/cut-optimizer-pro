
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
import { Layers, Plus, ArrowLeft } from 'lucide-react';
import { MaterialForm } from '@/components/materials/MaterialForm';
import { MaterialsTable } from '@/components/materials/MaterialsTable';
import { UserMenu } from '@/components/dashboard/UserMenu';

export default function Materials() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    loadMaterials();
  }, [user]);

  const loadMaterials = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await materialService.getMaterials();
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar materiais',
          description: error
        });
      } else if (data) {
        setMaterials(data);
      }
    } catch (error) {
      console.error('Failed to load materials', error);
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
