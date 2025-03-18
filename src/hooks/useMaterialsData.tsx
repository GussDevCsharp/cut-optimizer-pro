
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Material } from "@/types/material";
import {
  fetchMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from "@/services/materialService";

export function useMaterialsData(userId: string | undefined) {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialsLoading, setMaterialsLoading] = useState(true);
  const [isAddMaterialDialogOpen, setIsAddMaterialDialogOpen] = useState(false);
  const [isEditMaterialDialogOpen, setIsEditMaterialDialogOpen] = useState(false);
  const [isDeleteMaterialDialogOpen, setIsDeleteMaterialDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const loadMaterials = async () => {
    if (!userId) return;
    
    setMaterialsLoading(true);
    try {
      const { data, error } = await fetchMaterials(userId);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar materiais",
          description: error
        });
      } else if (data) {
        setMaterials(data);
      }
    } catch (error) {
      console.error("Failed to load materials", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar materiais",
        description: "Não foi possível carregar seus materiais"
      });
    } finally {
      setMaterialsLoading(false);
    }
  };

  const handleAddMaterial = async (
    data: Omit<Material, "id" | "created_at" | "updated_at" | "user_id">
  ) => {
    try {
      const result = await createMaterial({
        ...data,
        user_id: userId || "",
      });
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Erro ao criar material",
          description: result.error
        });
      } else {
        toast({
          title: "Material criado com sucesso!",
          description: `Material "${data.name}" foi criado.`,
        });
        setIsAddMaterialDialogOpen(false);
        loadMaterials();
      }
    } catch (error) {
      console.error("Failed to create material", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar material",
        description: "Não foi possível criar o material"
      });
    }
  };

  const handleEditMaterial = async (
    data: Omit<Material, "id" | "created_at" | "updated_at" | "user_id">
  ) => {
    if (!selectedMaterial) return;

    try {
      const result = await updateMaterial(selectedMaterial.id, data);
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Erro ao atualizar material",
          description: result.error
        });
      } else {
        toast({
          title: "Material atualizado com sucesso!",
          description: `Material "${data.name}" foi atualizado.`,
        });
        setIsEditMaterialDialogOpen(false);
        setSelectedMaterial(null);
        loadMaterials();
      }
    } catch (error) {
      console.error("Failed to update material", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar material",
        description: "Não foi possível atualizar o material"
      });
    }
  };

  const handleOpenEditDialog = (material: Material) => {
    setSelectedMaterial(material);
    setIsEditMaterialDialogOpen(true);
  };

  const handleDeleteMaterial = async () => {
    if (!selectedMaterial) return;
    
    try {
      const result = await deleteMaterial(selectedMaterial.id);
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Erro ao excluir material",
          description: result.error
        });
      } else {
        toast({
          title: "Material excluído com sucesso!",
          description: `Material "${selectedMaterial.name}" foi excluído.`,
        });
        setIsDeleteMaterialDialogOpen(false);
        setSelectedMaterial(null);
        loadMaterials();
      }
    } catch (error) {
      console.error("Failed to delete material", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir material",
        description: "Não foi possível excluir o material"
      });
    }
  };

  const handleDeleteDialogOpen = (id: string) => {
    const material = materials.find((m) => m.id === id);
    if (material) {
      setSelectedMaterial(material);
      setIsDeleteMaterialDialogOpen(true);
    }
  };

  return {
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
  };
}
