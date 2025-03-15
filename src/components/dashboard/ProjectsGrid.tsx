
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import NewProjectCard from "./NewProjectCard";
import ProjectCard from "./ProjectCard";
import TestingCard from "./TestingCard"; // Importação do novo componente
import { Project } from "@/types/project";
import { useAuth } from "@/context/AuthContext"; // Importar useAuth

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
  const { user } = useAuth(); // Obter informações do usuário
  const isAdmin = user?.email === 'admin@melhorcdorte.com.br' || user?.isAdmin; // Verificar se é admin

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
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
