
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
  unit: string;
  thickness?: number;
  width?: number;
  height?: number;
  stock_quantity?: number;
  supplier?: string;
  // Frontend-only fields (not in database)
  color?: string;
  availability?: "Disponível" | "Indisponível" | "Sob Encomenda";
}

// Type for our API responses
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Define our MaterialsDatabase type without modifying the original Database type
export type MaterialsDatabase = {
  public: {
    Tables: {
      materials: {
        Row: Omit<Material, 'color' | 'availability'>;
        Insert: Omit<Material, 'id' | 'created_at' | 'updated_at' | 'color' | 'availability'>;
        Update: Partial<Omit<Material, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'color' | 'availability'>>;
      };
    } & Database['public']['Tables'];
    Views: Database['public']['Views'];
    Functions: Database['public']['Functions'];
    Enums: Database['public']['Enums'];
    CompositeTypes: Database['public']['CompositeTypes'];
  };
};
