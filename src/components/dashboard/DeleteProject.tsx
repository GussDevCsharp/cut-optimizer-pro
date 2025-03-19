
import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteProjectDialog } from "@/components/dashboard/DeleteProjectDialog";
import { projectService } from "@/services/projectService";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { Project } from "@/types/project";

interface DeleteProjectProps {
  project: Project;
  onSuccess?: () => void;
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function DeleteProject({ 
  project, 
  onSuccess, 
  variant = "destructive", 
  size = "default",
  className 
}: DeleteProjectProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await projectService.deleteProject(project.id);
      
      if (error) {
        throw new Error(error);
      }
      
      toast({
        title: "Projeto excluído",
        description: `O projeto "${project.name}" foi excluído com sucesso.`
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        // If no success callback provided, navigate to dashboard
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir o projeto."
      });
    } finally {
      setIsDeleting(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        onClick={() => setIsDialogOpen(true)}
        className={className}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Excluir Projeto
      </Button>

      <DeleteProjectDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        projectName={project.name}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
