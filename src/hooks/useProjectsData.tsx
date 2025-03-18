
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { projectService } from "@/services/projectService";
import type { Project } from "@/types/project";

export function useProjectsData(userId: string | undefined) {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadProjects = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await projectService.getProjects();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar projetos",
          description: error
        });
      } else if (data) {
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to load projects", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar projetos",
        description: "Não foi possível carregar seus projetos"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (projectName: string, imageFile?: File) => {
    if (!projectName.trim()) {
      toast({
        variant: "destructive",
        title: "Nome de projeto requerido",
        description: "Por favor, forneça um nome para o seu novo projeto.",
      });
      return null;
    }

    if (!userId) {
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: "Você precisa estar logado para criar um projeto.",
      });
      return null;
    }

    try {
      // Default preview URL
      let preview_url = "/placeholder.svg";
      
      // If image file is provided, upload it to Supabase Storage
      if (imageFile) {
        const { data: fileData, error: fileError } = await projectService.uploadProjectImage(imageFile);
        
        if (fileError) {
          console.error("Error uploading image:", fileError);
          toast({
            variant: "destructive",
            title: "Erro ao fazer upload da imagem",
            description: "A imagem não pôde ser carregada, mas o projeto será criado mesmo assim."
          });
        } else if (fileData) {
          preview_url = fileData.path;
        }
      }

      const { data, error } = await projectService.createProject({
        name: projectName,
        user_id: userId,
        description: JSON.stringify({}), // Empty object for new projects
        preview_url
      });

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Projeto criado com sucesso!",
        description: `Projeto "${projectName}" foi criado.`,
      });
      
      setIsDialogOpen(false);
      
      return data;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar projeto",
        description: error.message || "Não foi possível criar o projeto."
      });
      return null;
    }
  };

  return {
    projects,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    loadProjects,
    handleCreateProject
  };
}
