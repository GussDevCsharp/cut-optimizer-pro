
import { supabase } from "@/integrations/supabase/client";
import type { Material, MaterialFormValues } from "@/types/material";
import type { ApiResponse } from "@/types/project";
import { materialsTable, createTableScript } from "./queries";

/**
 * Get all materials for the current user
 */
export const getMaterials = async (userId?: string): Promise<ApiResponse<Material[]>> => {
  try {
    let query = materialsTable().select('*').order('created_at', { ascending: false });
    
    // If userId is provided, filter by user_id
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: materials, error } = await query;

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        // Table doesn't exist yet - return empty array instead of error
        console.log("Materials table doesn't exist yet. Returning empty array.");
        return { data: [], error: "A tabela de materiais não existe no banco de dados." };
      }
      throw new Error(error.message);
    }

    return { data: materials || [], error: null };
  } catch (error: any) {
    console.error("Error fetching materials:", error);
    return { data: [], error: error.message };
  }
};

/**
 * Get a specific material by ID
 */
export const getMaterial = async (id: string): Promise<ApiResponse<Material>> => {
  try {
    const { data, error } = await materialsTable()
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        // Table doesn't exist yet
        return { data: null, error: "A tabela de materiais não existe no banco de dados." };
      }
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error: any) {
    console.error("Error fetching material:", error);
    return { data: null, error: error.message };
  }
};

/**
 * Create a new material
 */
export const createMaterial = async (
  material: MaterialFormValues & { user_id: string }
): Promise<ApiResponse<Material>> => {
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
      console.error("Error in createMaterial:", error);
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        // Table doesn't exist yet
        return { data: null, error: "A tabela de materiais não existe no banco de dados. Por favor, execute o script SQL fornecido." };
      }
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error: any) {
    console.error("Error creating material:", error);
    return { data: null, error: error.message };
  }
};

/**
 * Update an existing material
 */
export const updateMaterial = async (
  id: string, 
  material: Partial<MaterialFormValues>
): Promise<ApiResponse<Material>> => {
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
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        // Table doesn't exist yet
        return { data: null, error: "A tabela de materiais não existe no banco de dados." };
      }
      throw new Error(error.message);
    }

    return { data, error: null };
  } catch (error: any) {
    console.error("Error updating material:", error);
    return { data: null, error: error.message };
  }
};

/**
 * Delete a material
 */
export const deleteMaterial = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const { error } = await materialsTable()
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        // Table doesn't exist yet
        return { data: null, error: "A tabela de materiais não existe no banco de dados." };
      }
      throw new Error(error.message);
    }

    return { data: null, error: null };
  } catch (error: any) {
    console.error("Error deleting material:", error);
    return { data: null, error: error.message };
  }
};

/**
 * Create the materials table in the database
 */
export const createMaterialsTable = async (): Promise<ApiResponse<null>> => {
  try {
    // Execute the SQL script directly
    const { error } = await supabase.rpc('execute_sql', { sql: createTableScript });

    if (error) {
      console.error("Error creating materials table:", error);
      return { 
        data: null, 
        error: `Erro ao criar tabela: ${error.message}` 
      };
    }

    return { 
      data: null, 
      error: null 
    };
  } catch (error: any) {
    console.error("Error creating materials table:", error);
    return { data: null, error: error.message };
  }
};
