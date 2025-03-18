
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MaterialsGrid } from "@/components/dashboard/MaterialsGrid";
import { MaterialsTable } from "@/components/dashboard/MaterialsTable";
import { NewMaterialDialog } from "@/components/dashboard/NewMaterialDialog";
import { useMaterialsData } from "@/hooks/useMaterialsData";
import { useIsMobile } from "@/hooks/use-mobile";

interface MaterialsTabContentProps {
  userId: string | undefined;
  isActiveTab: boolean;
}

export function MaterialsTabContent({ userId, isActiveTab }: MaterialsTabContentProps) {
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { materials, isLoading, loadMaterials, createMaterial, deleteMaterial, updateMaterial } = useMaterialsData(userId);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);

  // Load materials when this tab becomes active
  useEffect(() => {
    if (isActiveTab && userId) {
      loadMaterials();
    }
  }, [isActiveTab, userId, loadMaterials]);

  const handleCreateMaterial = async (materialData: any) => {
    try {
      await createMaterial(materialData);
      setIsDialogOpen(false);
      toast.success("Material cadastrado com sucesso!");
    } catch (error) {
      console.error("Error creating material:", error);
      toast.error("Erro ao cadastrar material.");
    }
  };

  const handleUpdateMaterial = async (materialData: any) => {
    try {
      await updateMaterial(materialData);
      setIsDialogOpen(false);
      setSelectedMaterial(null);
      toast.success("Material atualizado com sucesso!");
    } catch (error) {
      console.error("Error updating material:", error);
      toast.error("Erro ao atualizar material.");
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    try {
      await deleteMaterial(id);
      toast.success("Material excluído com sucesso!");
    } catch (error) {
      console.error("Error deleting material:", error);
      toast.error("Erro ao excluir material.");
    }
  };

  const handleEditMaterial = (material: any) => {
    setSelectedMaterial(material);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Materiais</h2>
        <Button 
          onClick={() => {
            setSelectedMaterial(null);
            setIsDialogOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Material</span>
        </Button>
      </div>

      {isMobile ? (
        <MaterialsGrid 
          materials={materials}
          isLoading={isLoading}
          onEditMaterial={handleEditMaterial}
          onDeleteMaterial={handleDeleteMaterial}
        />
      ) : (
        <MaterialsTable 
          materials={materials}
          isLoading={isLoading}
          onEditMaterial={handleEditMaterial}
          onDeleteMaterial={handleDeleteMaterial}
        />
      )}

      <NewMaterialDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        material={selectedMaterial}
        onSaveMaterial={selectedMaterial ? handleUpdateMaterial : handleCreateMaterial}
      />
    </div>
  );
}
