
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, Plus } from 'lucide-react';
import { MaterialForm } from '@/components/materials/MaterialForm';
import { MaterialsTable } from '@/components/materials/MaterialsTable';
import type { Material } from '@/types/material';

interface MaterialsTabsProps {
  materials: Material[];
  isLoading: boolean;
  onRefresh: () => void;
  onFormSuccess: () => void;
}

export function MaterialsTabs({ materials, isLoading, onRefresh, onFormSuccess }: MaterialsTabsProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const handleAddNew = () => {
    setSelectedMaterial(null);
    setActiveTab('form');
  };

  const handleEdit = (material: Material) => {
    setSelectedMaterial(material);
    setActiveTab('form');
  };

  return (
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
                onRefresh={onRefresh}
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
              onSuccess={onFormSuccess}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
