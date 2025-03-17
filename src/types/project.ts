
import type { Database } from "@/integrations/supabase/types";

// Project-related types
export interface Project {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  description?: string; // Using description instead of data
  preview_url?: string;
}

// Type for our API responses
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Extend the Database type with our projects table (without modifying the original file)
export interface ExtendedDatabase extends Database {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Project, 'id' | 'created_at'>>;
      };
    } & Database['public']['Tables'];
    Views: Database['public']['Views'];
    Functions: Database['public']['Functions'];
    Enums: Database['public']['Enums'];
    CompositeTypes: Database['public']['CompositeTypes'];
  }
}
