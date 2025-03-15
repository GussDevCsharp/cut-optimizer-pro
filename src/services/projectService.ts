
import { supabase } from "@/integrations/supabase/client";
import type { Project, ApiResponse } from "@/types/project";

// This cast is necessary because our Database type doesn't know about the 'projects' table
// We're bypassing TypeScript type checking for Supabase queries
const projectsTable = () => supabase.from('projects') as unknown as any;

export const projectService = {
  async getProjects(): Promise<ApiResponse<Project[]>> {
    try {
      const { data, error } = await projectsTable()
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return { data: data as Project[], error: null };
    } catch (error: any) {
      console.error("Error fetching projects:", error.message);
      return { data: null, error: error.message };
    }
  },
  
  async getProjectById(id: string): Promise<ApiResponse<Project>> {
    try {
      const { data, error } = await projectsTable()
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
  
  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Project>> {
    try {
      const now = new Date().toISOString();
      const newProject = {
        ...project,
        created_at: now,
        updated_at: now,
      };
      
      const { data, error } = await projectsTable()
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
  
  async updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'created_at'>>): Promise<ApiResponse<Project>> {
    try {
      const { data, error } = await projectsTable()
        .update({
          ...updates,
          updated_at: new Date().toISOString()
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
      const { error } = await projectsTable()
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
