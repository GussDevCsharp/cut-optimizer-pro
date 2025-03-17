
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { materialService } from '@/services/materialService';
import type { Material } from '@/types/material';

import { MaterialsHeader } from '@/components/materials/MaterialsHeader';
import { TableErrorAlert } from '@/components/materials/TableErrorAlert';
import { MaterialsTabs } from '@/components/materials/MaterialsTabs';

export default function Materials() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const handleFormSuccess = () => {
    loadMaterials();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout>
      <div className={`${isMobile ? 'px-2 py-2' : 'container mx-auto p-4'}`}>
        <MaterialsHeader 
          userName={user?.name}
          onLogout={handleLogout}
          isMobile={isMobile}
        />

        <TableErrorAlert 
          error={tableError}
          onRefresh={loadMaterials}
        />

        <MaterialsTabs 
          materials={materials}
          isLoading={isLoading}
          onRefresh={loadMaterials}
          onFormSuccess={handleFormSuccess}
        />
      </div>
    </Layout>
  );
}
