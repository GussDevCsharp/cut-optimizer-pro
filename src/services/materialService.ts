
import { Material, ApiResponse, MaterialsDatabase } from "@/types/material";
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Type-cast the supabase client to include our materials table definition
const typedSupabase = supabase as unknown as ReturnType<typeof createClient<MaterialsDatabase>>;

// Filter out frontend-only fields before sending to database
const filterNonDatabaseFields = (material: Partial<Material>) => {
  const { color, availability, ...databaseFields } = material;
  return databaseFields;
};

// Create the materials table if it doesn't exist
export const initializeMaterialsTable = async (): Promise<boolean> => {
  try {
    // Check if the table exists
    const { error: checkError } = await supabase
      .from('materials')
      .select('id')
      .limit(1);
    
    // If table exists, return true
    if (!checkError) {
      console.log('Materials table already exists');
      return true;
    }
    
    // If error is not related to missing table, throw it
    if (checkError.code !== 'PGRST204') {
      throw checkError;
    }
    
    // Table doesn't exist, create it manually with SQL
    const { error: createError } = await supabase.rpc('init_materials_table');
    
    if (createError) {
      console.error('Error creating materials table:', createError);
      return false;
    }
    
    console.log('Materials table created successfully');
    return true;
  } catch (error) {
    console.error('Error checking/creating materials table:', error);
    return false;
  }
};

// Fetch all materials for a user
export const fetchMaterials = async (userId: string): Promise<ApiResponse<Material[]>> => {
  try {
    // First make sure the table exists
    await initializeMaterialsTable();
    
    const { data, error } = await typedSupabase
      .from('materials')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Add default values for frontend-only fields
    const materialsWithDefaultValues = data.map(material => ({
      ...material,
      color: "", // Default frontend-only field
      availability: "Disponível" as const // Default frontend-only field
    }));

    return { data: materialsWithDefaultValues, error: null };
  } catch (error) {
    console.error('Error fetching materials:', error);
    return { data: null, error: (error as Error).message };
  }
};

// Fetch a single material by ID
export const fetchMaterialById = async (materialId: string): Promise<ApiResponse<Material>> => {
  try {
    // First make sure the table exists
    await initializeMaterialsTable();
    
    const { data, error } = await typedSupabase
      .from('materials')
      .select('*')
      .eq('id', materialId)
      .single();

    if (error) {
      throw error;
    }

    // Add default values for frontend-only fields
    const materialWithDefaultValues = {
      ...data,
      color: "", // Default frontend-only field
      availability: "Disponível" as const // Default frontend-only field
    };

    return { data: materialWithDefaultValues, error: null };
  } catch (error) {
    console.error('Error fetching material:', error);
    return { data: null, error: (error as Error).message };
  }
};

// Create a new material - only send fields that exist in the database
export const createMaterial = async (
  material: Omit<Material, 'id' | 'created_at' | 'updated_at'>
): Promise<ApiResponse<Material>> => {
  try {
    // First make sure the table exists
    await initializeMaterialsTable();
    
    // Filter out fields that don't exist in the database
    const databaseFields = filterNonDatabaseFields(material);
    
    console.log('Creating material with data:', databaseFields);
    
    const { data, error } = await typedSupabase
      .from('materials')
      .insert([databaseFields])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    // Add default values for frontend-only fields to the returned data
    const materialWithDefaultValues = {
      ...data,
      color: material.color || "", // Use provided value or default
      availability: material.availability || "Disponível" as const // Use provided value or default
    };

    return { data: materialWithDefaultValues, error: null };
  } catch (error) {
    console.error('Error creating material:', error);
    return { data: null, error: (error as Error).message };
  }
};

// Update an existing material - only send fields that exist in the database
export const updateMaterial = async (
  materialId: string, 
  materialData: Partial<Omit<Material, 'id' | 'created_at' | 'user_id'>>
): Promise<ApiResponse<Material>> => {
  try {
    // Filter out fields that don't exist in the database
    const databaseFields = filterNonDatabaseFields(materialData);
    
    const { data, error } = await typedSupabase
      .from('materials')
      .update(databaseFields)
      .eq('id', materialId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Add default values for frontend-only fields
    const materialWithDefaultValues = {
      ...data,
      color: materialData.color || "", // Use provided value or default
      availability: materialData.availability || "Disponível" as const // Use provided value or default
    };

    return { data: materialWithDefaultValues, error: null };
  } catch (error) {
    console.error('Error updating material:', error);
    return { data: null, error: (error as Error).message };
  }
};

// Delete a material
export const deleteMaterial = async (materialId: string): Promise<ApiResponse<null>> => {
  try {
    const { error } = await typedSupabase
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
