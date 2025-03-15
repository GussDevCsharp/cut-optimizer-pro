
import { supabase } from "@/integrations/supabase/client";
import type { Project, ApiResponse } from "@/types/project";

export const projectService = {
  async getProjects(): Promise<ApiResponse<Project[]>> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('date_modified', { ascending: false });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Error fetching projects:", error.message);
      return { data: null, error: error.message };
    }
  },
  
  async getProjectById(id: string): Promise<ApiResponse<Project>> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
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
      
      const { data, error } = await supabase
        .from('projects')
        .insert(newProject)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Error creating project:", error.message);
      return { data: null, error: error.message };
    }
  },
  
  async updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'date_created'>>): Promise<ApiResponse<Project>> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updates,
          date_modified: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Error updating project:", error.message);
      return { data: null, error: error.message };
    }
  },
  
  async deleteProject(id: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('projects')
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
