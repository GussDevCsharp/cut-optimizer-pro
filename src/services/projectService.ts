
import { supabase } from "@/integrations/supabase/client";
import type { Project, ApiResponse, ExtendedDatabase } from "@/types/project";
import { createClient } from '@supabase/supabase-js';

// Create a typed client that knows about our projects table
const typedSupabase = supabase as unknown as ReturnType<typeof createClient<ExtendedDatabase>>;

// Now we can use the typed client to access the projects table with proper typing
const projectsTable = () => typedSupabase.from('projects');

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
      
      // After creating a project, check if we need to delete old projects
      await this.retainOnlyRecentProjects(project.user_id);
      
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
  },
  
  // New method to retain only the 5 most recent projects for a user
  async retainOnlyRecentProjects(userId: string): Promise<void> {
    try {
      // Get all projects for this user, ordered by creation date
      const { data, error } = await projectsTable()
        .select('id, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // If we have more than 5 projects, delete the oldest ones
      if (data && data.length > 5) {
        const projectsToDelete = data.slice(5);
        
        for (const project of projectsToDelete) {
          await this.deleteProject(project.id);
        }
      }
    } catch (error) {
      console.error("Error managing project count:", error);
      // We don't want to break the app flow if this fails, so just log the error
    }
  }
};
