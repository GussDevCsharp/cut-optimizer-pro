
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/database";

export const fetchProjects = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data as Project[];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

export const createProject = async (projectName: string, userId: string) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([
      { name: projectName, user_id: userId }
    ])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data as Project;
};
