
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectsData } from "@/hooks/useProjectsData";
import { ProjectsGrid } from "@/components/dashboard/ProjectsGrid";
import { NewProjectDialog } from "@/components/dashboard/NewProjectDialog";
import { DeleteProjectDialog } from "@/components/dashboard/DeleteProjectDialog";
import type { Project } from "@/types/project";
import { useToast } from "@/hooks/use-toast";
import { projectService } from "@/services/projectService";

interface ProjectsTabContentProps {
  userId: string | undefined;
  isActiveTab: boolean;
}

export function ProjectsTabContent({ userId, isActiveTab }: ProjectsTabContentProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    projects,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    loadProjects,
    handleCreateProject
  } = useProjectsData(userId);

  // Delete project state
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load projects when this tab becomes active
  React.useEffect(() => {
    if (isActiveTab) {
      loadProjects();
    }
  }, [isActiveTab, userId]);

  const handleProjectClick = (project: Project) => {
    navigate("/app", { state: { projectId: project.id, projectName: project.name } });
  };

  const handleProjectCreated = async (name: string, imageFile?: File) => {
    const createdProject = await handleCreateProject(name, imageFile);
    
    // Navigate to the project editor if project was created successfully
    if (createdProject) {
      navigate("/app", { 
        state: { 
          projectId: createdProject.id, 
          projectName: createdProject.name 
        } 
      });
    }
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await projectService.deleteProject(projectToDelete.id);
      
      if (error) {
        throw new Error(error);
      }
      
      toast({
        title: "Projeto excluído",
        description: `O projeto "${projectToDelete.name}" foi excluído com sucesso.`
      });
      
      // Reload projects to reflect the change
      loadProjects();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir o projeto."
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <ProjectsGrid 
        projects={projects}
        isLoading={isLoading}
        onNewProjectClick={() => setIsDialogOpen(true)}
        onProjectClick={handleProjectClick}
        onDeleteProject={handleDeleteClick}
      />

      <NewProjectDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreateProject={handleProjectCreated}
      />

      {projectToDelete && (
        <DeleteProjectDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          projectName={projectToDelete.name}
          onConfirmDelete={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
