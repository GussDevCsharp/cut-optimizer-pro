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
  color?: string;
  availability?: "Disponível" | "Indisponível" | "Sob Encomenda";
}

// Type for our API responses
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Define the database structure with materials table
export type MaterialsDatabase = Database & {
  public: {
    Tables: {
      materials: {
        Row: {
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
        };
        Insert: {
          name: string;
          user_id: string;
          description?: string;
          type: string;
          price?: number;
          unit: string;
          thickness?: number;
          width?: number;
          height?: number;
          stock_quantity?: number;
          supplier?: string;
        };
        Update: {
          name?: string;
          description?: string;
          type?: string;
          price?: number;
          unit?: string;
          thickness?: number;
          width?: number;
          height?: number;
          stock_quantity?: number;
          supplier?: string;
        };
      };
    };
  };
};
