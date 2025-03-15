
import { useIsMobile } from "@/hooks/use-mobile";
import { ProjectCard } from "./ProjectCard";
import { NewProjectCard } from "./NewProjectCard";
import type { Project } from "@/types/project";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

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
  const { isAdmin } = useAuth(); // Use the isAdmin from our updated context

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'} mb-8`}>
      <NewProjectCard onClick={onNewProjectClick} />
      
      {/* Admin-only components would go here */}
      {isAdmin && (
        // Admin-specific card or functionality
        <div className="admin-only-content">
          {/* Conteúdo visível apenas para admin */}
        </div>
      )}
      
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
