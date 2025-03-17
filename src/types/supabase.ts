
import type { Database as OriginalDatabase } from "@/integrations/supabase/types";
import type { Material } from "./material";

// Extend the original Database type with our custom tables
export interface Database extends OriginalDatabase {
  public: {
    Tables: {
      materials: {
        Row: Material;
        Insert: Omit<Material, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Material, 'id' | 'created_at' | 'updated_at'>>;
      };
      projects: {
        Row: {
          id: string;
          name: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          description?: string;
          preview_url?: string;
        };
        Insert: Omit<{
          id: string;
          name: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          description?: string;
          preview_url?: string;
        }, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<{
          id: string;
          name: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          description?: string;
          preview_url?: string;
        }, 'id' | 'created_at' | 'updated_at'>>;
      };
    } & OriginalDatabase['public']['Tables'];
    Views: OriginalDatabase['public']['Views'];
    Functions: OriginalDatabase['public']['Functions'];
    Enums: OriginalDatabase['public']['Enums'];
    CompositeTypes: OriginalDatabase['public']['CompositeTypes'];
  };
}
