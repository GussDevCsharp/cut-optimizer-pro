
import { supabase } from "@/integrations/supabase/client";
import type { Material, MaterialFormValues } from "@/types/material";
import type { ApiResponse } from "@/types/project";

// Directly access the materials table using our typed Supabase client
const materialsTable = () => supabase.from('materials');

export const materialService = {
  // Get all materials for the current user
  getMaterials: async (userId?: string): Promise<ApiResponse<Material[]>> => {
    try {
      let query = materialsTable().select('*').order('created_at', { ascending: false });
      
      // If userId is provided, filter by user_id
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: materials, error } = await query;

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
      const { data, error } = await materialsTable()
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
  createMaterial: async (material: MaterialFormValues & { user_id: string }): Promise<ApiResponse<Material>> => {
    try {
      const now = new Date().toISOString();
      const newMaterial = {
        ...material,
        created_at: now,
        updated_at: now
      };

      const { data, error } = await materialsTable()
        .insert(newMaterial)
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
      const updates = {
        ...material,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await materialsTable()
        .update(updates)
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
      const { error } = await materialsTable()
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
