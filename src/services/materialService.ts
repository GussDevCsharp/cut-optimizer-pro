
import { Material, ApiResponse, ExtendedDatabase } from "@/types/material";
import { supabase } from '@/integrations/supabase/client';

// Fetch all materials for a user
export const fetchMaterials = async (userId: string): Promise<ApiResponse<Material[]>> => {
  try {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching materials:', error);
    return { data: null, error: (error as Error).message };
  }
};

// Fetch a single material by ID
export const fetchMaterialById = async (materialId: string): Promise<ApiResponse<Material>> => {
  try {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('id', materialId)
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching material:', error);
    return { data: null, error: (error as Error).message };
  }
};

// Create a new material
export const createMaterial = async (material: Omit<Material, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Material>> => {
  try {
    const { data, error } = await supabase
      .from('materials')
      .insert([material])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error creating material:', error);
    return { data: null, error: (error as Error).message };
  }
};

// Update an existing material
export const updateMaterial = async (materialId: string, materialData: Partial<Omit<Material, 'id' | 'created_at'>>): Promise<ApiResponse<Material>> => {
  try {
    const { data, error } = await supabase
      .from('materials')
      .update(materialData)
      .eq('id', materialId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating material:', error);
    return { data: null, error: (error as Error).message };
  }
};

// Delete a material
export const deleteMaterial = async (materialId: string): Promise<ApiResponse<null>> => {
  try {
    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', materialId);

    if (error) {
      throw error;
    }

    return { data: null, error: null };
  } catch (error) {
    console.error('Error deleting material:', error);
    return { data: null, error: (error as Error).message };
  }
};
