
import type { Database } from "@/integrations/supabase/types";

// Project-related types
export interface Project {
  id: string;
  name: string;
  user_id: string;
  date_created: string;
  date_modified: string;
  data?: any; // For storing JSON data about the project
  preview_url?: string;
}

// Type for our API responses
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Define our own Supabase related types separately from the read-only file
export type Tables = {
  projects: Project;
}
