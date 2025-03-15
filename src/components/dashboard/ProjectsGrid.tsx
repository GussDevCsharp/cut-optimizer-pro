
import { useIsMobile } from "@/hooks/use-mobile";
import { ProjectCard } from "./ProjectCard";
import { NewProjectCard } from "./NewProjectCard";
import type { Project } from "@/types/project";

interface ProjectsGridProps {
  projects: Project[];
  isLoading: boolean;
  onNewProjectClick: () => void;
  onProjectClick: (project: Project) => void;
}

export const ProjectsGrid = ({ 
  projects, 
  isLoading, 
  onNewProjectClick, 
  onProjectClick 
}: ProjectsGridProps) => {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <p>Carregando seus projetos...</p>
      </div>
    );
  }

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'} mb-8`}>
      <NewProjectCard onClick={onNewProjectClick} />
      
      {projects.map((project) => (
        <ProjectCard 
          key={project.id}
          project={project}
          onClick={onProjectClick}
        />
      ))}
    </div>
  );
};
