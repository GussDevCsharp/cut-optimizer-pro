
import type { Database } from "@/integrations/supabase/types";

// Project-related types
export interface Project {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  data?: any; // For storing JSON data about the project
  preview_url?: string;
}

// Type for our API responses
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
