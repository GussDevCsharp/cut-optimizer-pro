
import { Loader2 } from "lucide-react";
import { NewProjectCard } from "./NewProjectCard";
import { ProjectCard } from "./ProjectCard";
import TestingCard from "./TestingCard"; 
import { useAuth } from "@/context/AuthContext"; 
import { Project } from "@/types/project";

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
  onProjectClick,
}: ProjectsGridProps) => {
  const { user } = useAuth();
  // Verificar se é admin pelo email, já que isAdmin não existe no tipo AuthUser
  const isAdmin = user?.email === 'admin@melhorcdorte.com.br';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      <NewProjectCard onClick={onNewProjectClick} />
      
      {/* Mostrar o card de testes apenas para administradores */}
      {isAdmin && (
        <TestingCard />
      )}
      
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={() => onProjectClick(project)}
        />
      ))}
    </div>
  );
};
