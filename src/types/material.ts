
import type { Database } from "@/integrations/supabase/types";

// Material-related types
export interface Material {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  description?: string;
  type: string;
  price?: number;
  unit: string; // e.g., "m2", "unidade", etc.
  thickness?: number;
  width?: number;
  height?: number;
  color?: string;
  stock_quantity?: number;
  supplier?: string;
  availability?: "Disponível" | "Indisponível" | "Sob Encomenda";
}

// Type for our API responses
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Extend the Database type with our materials table
export type ExtendedDatabase = Database & {
  public: {
    Tables: {
      materials: {
        Row: Material;
        Insert: Omit<Material, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Material, 'id' | 'created_at'>>;
      };
    } & Database['public']['Tables'];
  }
}
