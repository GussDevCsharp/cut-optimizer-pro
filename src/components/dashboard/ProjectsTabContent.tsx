
import React from "react";
import { useNavigate } from "react-router-dom";
import { useProjectsData } from "@/hooks/useProjectsData";
import { ProjectsGrid } from "@/components/dashboard/ProjectsGrid";
import { NewProjectDialog } from "@/components/dashboard/NewProjectDialog";
import type { Project } from "@/types/project";

interface ProjectsTabContentProps {
  userId: string | undefined;
  isActiveTab: boolean;
}

export function ProjectsTabContent({ userId, isActiveTab }: ProjectsTabContentProps) {
  const navigate = useNavigate();
  const {
    projects,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    loadProjects,
    handleCreateProject
  } = useProjectsData(userId);

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

  return (
    <div className="space-y-4">
      <ProjectsGrid 
        projects={projects}
        isLoading={isLoading}
        onNewProjectClick={() => setIsDialogOpen(true)}
        onProjectClick={handleProjectClick}
      />

      <NewProjectDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreateProject={handleProjectCreated}
      />
    </div>
  );
}
