
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { projectService } from "@/services/projectService";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function useProjectActions() {
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const saveProject = async (projectId: string | null, projectName: string, projectData: any) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Você precisa estar logado para salvar um projeto.",
      });
      return null;
    }

    setIsSaving(true);
    try {
      // If we have a projectId, update it; otherwise, create a new one
      if (projectId) {
        const { data, error } = await projectService.updateProject(projectId, {
          name: projectName,
          data: projectData
        });
        
        if (error) throw new Error(error);
        
        toast({
          title: "Projeto salvo",
          description: "As alterações foram salvas com sucesso."
        });
        
        return data;
      } else {
        // Create new project
        const { data, error } = await projectService.createProject({
          name: projectName,
          user_id: user.id,
          data: projectData,
          preview_url: "/placeholder.svg" // Placeholder for now
        });
        
        if (error) throw new Error(error);
        
        toast({
          title: "Projeto criado",
          description: "Projeto criado e salvo com sucesso."
        });
        
        // Update the URL to include the project ID without refreshing
        if (data) {
          window.history.replaceState(
            {...window.history.state, projectId: data.id}, 
            '', 
            window.location.pathname
          );
        }
        
        return data;
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar o projeto."
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const loadProject = async (projectId: string) => {
    try {
      const { data, error } = await projectService.getProjectById(projectId);
      
      if (error) throw new Error(error);
      if (!data) throw new Error("Projeto não encontrado");
      
      return data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar projeto",
        description: error.message || "Não foi possível carregar o projeto."
      });
      navigate("/dashboard");
      return null;
    }
  };

  return {
    saveProject,
    loadProject,
    isSaving
  };
}
