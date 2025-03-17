
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
