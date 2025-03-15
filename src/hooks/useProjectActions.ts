
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { projectService } from "@/services/projectService";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function useProjectActions() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
          description: JSON.stringify(projectData) // Store the data as a serialized JSON string
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
          description: JSON.stringify(projectData), // Store the data as a serialized JSON string
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
    setIsLoading(true);
    try {
      const { data, error } = await projectService.getProjectById(projectId);
      
      if (error) throw new Error(error);
      if (!data) throw new Error("Projeto não encontrado");
      
      // Parse the description field if it contains JSON data
      if (data.description) {
        try {
          data.description = JSON.parse(data.description);
        } catch (e) {
          // If parsing fails, keep the description as is
          console.warn("Failed to parse project description as JSON");
        }
      }
      
      // Add a small delay to ensure UI stability
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar projeto",
        description: error.message || "Não foi possível carregar o projeto."
      });
      navigate("/dashboard");
      return null;
    } finally {
      // Add a small delay before ending loading state
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  };

  return {
    saveProject,
    loadProject,
    isSaving,
    isLoading
  };
}
