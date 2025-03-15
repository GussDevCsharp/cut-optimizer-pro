
import { supabase } from "@/integrations/supabase/client";
import type { Project, ApiResponse, SupabaseTable } from "@/types/project";

export const projectService = {
  async getProjects(): Promise<ApiResponse<Project[]>> {
    try {
      // Use type assertion to bypass type checking
      const { data, error } = await (supabase
        .from('projects') as any)
        .select('*')
        .order('date_created', { ascending: false });
      
      if (error) throw error;
      
      return { data: data as Project[], error: null };
    } catch (error: any) {
      console.error("Error fetching projects:", error.message);
      return { data: null, error: error.message };
    }
  },
  
  async getProjectById(id: string): Promise<ApiResponse<Project>> {
    try {
      // Use type assertion to bypass type checking
      const { data, error } = await (supabase
        .from('projects') as any)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { data: data as Project, error: null };
    } catch (error: any) {
      console.error("Error fetching project:", error.message);
      return { data: null, error: error.message };
    }
  },
  
  async createProject(project: Omit<Project, 'id' | 'date_created' | 'date_modified'>): Promise<ApiResponse<Project>> {
    try {
      const now = new Date().toISOString();
      const newProject = {
        ...project,
        date_created: now,
        date_modified: now,
      };
      
      // Use type assertion to bypass type checking
      const { data, error } = await (supabase
        .from('projects') as any)
        .insert(newProject)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data: data as Project, error: null };
    } catch (error: any) {
      console.error("Error creating project:", error.message);
      return { data: null, error: error.message };
    }
  },
  
  async updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'date_created'>>): Promise<ApiResponse<Project>> {
    try {
      // Use type assertion to bypass type checking
      const { data, error } = await (supabase
        .from('projects') as any)
        .update({
          ...updates,
          date_modified: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data: data as Project, error: null };
    } catch (error: any) {
      console.error("Error updating project:", error.message);
      return { data: null, error: error.message };
    }
  },
  
  async deleteProject(id: string): Promise<ApiResponse<null>> {
    try {
      // Use type assertion to bypass type checking
      const { error } = await (supabase
        .from('projects') as any)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { data: null, error: null };
    } catch (error: any) {
      console.error("Error deleting project:", error.message);
      return { data: null, error: error.message };
    }
  }
};
