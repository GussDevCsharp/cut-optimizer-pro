
import { supabase } from "@/integrations/supabase/client";
import type { Material, MaterialFormValues } from "@/types/material";
import type { ApiResponse } from "@/types/project";

export const materialService = {
  // Get all materials for the current user
  getMaterials: async (): Promise<ApiResponse<Material[]>> => {
    try {
      const { data: materials, error } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return { data: materials, error: null };
    } catch (error: any) {
      console.error("Error fetching materials:", error);
      return { data: null, error: error.message };
    }
  },
  
  // Get a specific material by ID
  getMaterial: async (id: string): Promise<ApiResponse<Material>> => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { data, error: null };
    } catch (error: any) {
      console.error("Error fetching material:", error);
      return { data: null, error: error.message };
    }
  },
  
  // Create a new material
  createMaterial: async (material: MaterialFormValues): Promise<ApiResponse<Material>> => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .insert([material])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { data, error: null };
    } catch (error: any) {
      console.error("Error creating material:", error);
      return { data: null, error: error.message };
    }
  },
  
  // Update an existing material
  updateMaterial: async (id: string, material: Partial<MaterialFormValues>): Promise<ApiResponse<Material>> => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .update(material)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { data, error: null };
    } catch (error: any) {
      console.error("Error updating material:", error);
      return { data: null, error: error.message };
    }
  },
  
  // Delete a material
  deleteMaterial: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      return { data: null, error: null };
    } catch (error: any) {
      console.error("Error deleting material:", error);
      return { data: null, error: error.message };
    }
  }
};
