
import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import { 
  getAllMaterials, 
  createMaterial,
  updateMaterial,
  deleteMaterial
} from "@/services/materialService";
import type { Material } from "@/types/material";

export function useMaterialsData(userId: string | undefined) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadMaterials = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const data = await getAllMaterials(userId);
      setMaterials(data);
    } catch (error) {
      console.error("Error fetching materials:", error);
      toast.error("Erro ao carregar materiais.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const createMaterialItem = async (materialData: Omit<Material, 'id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return null;
    
    try {
      const newMaterial = await createMaterial({
        ...materialData,
        user_id: userId,
      });
      
      setMaterials(prev => [...prev, newMaterial]);
      return newMaterial;
    } catch (error) {
      console.error("Error creating material:", error);
      throw error;
    }
  };

  const updateMaterialItem = async (materialData: Material) => {
    try {
      const updated = await updateMaterial(materialData);
      setMaterials(prev => 
        prev.map(material => 
          material.id === updated.id ? updated : material
        )
      );
      return updated;
    } catch (error) {
      console.error("Error updating material:", error);
      throw error;
    }
  };

  const deleteMaterialItem = async (id: string) => {
    try {
      await deleteMaterial(id);
      setMaterials(prev => prev.filter(material => material.id !== id));
      return true;
    } catch (error) {
      console.error("Error deleting material:", error);
      throw error;
    }
  };

  return {
    materials,
    isLoading,
    loadMaterials,
    createMaterial: createMaterialItem,
    updateMaterial: updateMaterialItem,
    deleteMaterial: deleteMaterialItem
  };
}
