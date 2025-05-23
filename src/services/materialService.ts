
import { createClient } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import type { Material } from "@/types/material";

// Type for direct supabase operations to avoid TypeScript errors
const typedSupabase = supabase as ReturnType<typeof createClient<any>>;

// Get all materials for a user
export async function getAllMaterials(userId: string): Promise<Material[]> {
  const { data, error } = await typedSupabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching materials:", error);
    throw error;
  }
  
  return data as Material[];
}

// Create a new material
export async function createMaterial(materialData: Omit<Material, 'id' | 'created_at' | 'updated_at'>): Promise<Material> {
  const { data, error } = await typedSupabase
    .from('products')
    .insert(materialData)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating material:", error);
    throw error;
  }
  
  return data as Material;
}

// Update an existing material
export async function updateMaterial(materialData: Material): Promise<Material> {
  const { id, ...updates } = materialData;
  
  const { data, error } = await typedSupabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating material:", error);
    throw error;
  }
  
  return data as Material;
}

// Delete a material
export async function deleteMaterial(id: string): Promise<void> {
  const { error } = await typedSupabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting material:", error);
    throw error;
  }
}
