
import React from "react";
import { MaterialsList } from "@/components/materials/MaterialsList";
import { MaterialDialog } from "@/components/materials/MaterialDialog";
import { DeleteMaterialDialog } from "@/components/materials/DeleteMaterialDialog";
import { useMaterialsData } from "@/hooks/useMaterialsData";

interface MaterialsTabContentProps {
  userId: string | undefined;
  isActiveTab: boolean;
}

export function MaterialsTabContent({ userId, isActiveTab }: MaterialsTabContentProps) {
  const {
    materials,
    materialsLoading,
    selectedMaterial,
    isAddMaterialDialogOpen,
    isEditMaterialDialogOpen,
    isDeleteMaterialDialogOpen,
    setIsAddMaterialDialogOpen,
    setIsEditMaterialDialogOpen,
    setIsDeleteMaterialDialogOpen,
    setSelectedMaterial,
    loadMaterials,
    handleAddMaterial,
    handleEditMaterial,
    handleOpenEditDialog,
    handleDeleteMaterial,
    handleDeleteDialogOpen
  } = useMaterialsData(userId);

  // Load materials when this tab becomes active
  React.useEffect(() => {
    if (isActiveTab) {
      loadMaterials();
    }
  }, [isActiveTab, userId]);

  return (
    <div className="space-y-4">
      <MaterialsList
        materials={materials}
        onEdit={handleOpenEditDialog}
        onDelete={handleDeleteDialogOpen}
        onAdd={() => setIsAddMaterialDialogOpen(true)}
      />
      
      {/* Add Material Dialog */}
      <MaterialDialog
        isOpen={isAddMaterialDialogOpen}
        onClose={() => setIsAddMaterialDialogOpen(false)}
        onSubmit={handleAddMaterial}
        title="Adicionar Material"
      />

      {/* Edit Material Dialog */}
      {selectedMaterial && (
        <MaterialDialog
          isOpen={isEditMaterialDialogOpen}
          onClose={() => {
            setIsEditMaterialDialogOpen(false);
            setSelectedMaterial(null);
          }}
          onSubmit={handleEditMaterial}
          initialData={selectedMaterial}
          title="Editar Material"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteMaterialDialog
        isOpen={isDeleteMaterialDialogOpen}
        onClose={() => {
          setIsDeleteMaterialDialogOpen(false);
          setSelectedMaterial(null);
        }}
        onDelete={handleDeleteMaterial}
        material={selectedMaterial}
      />
    </div>
  );
}
