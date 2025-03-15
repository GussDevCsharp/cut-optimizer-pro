
import { useIsMobile } from "@/hooks/use-mobile";
import { ProjectCard } from "./ProjectCard";
import { NewProjectCard } from "./NewProjectCard";
import { TestingCard } from "./TestingCard";
import type { Project } from "@/types/project";
import { useAuth } from "@/context/AuthContext";
import { Loader2, LayoutGrid, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import { ProjectTable } from "./ProjectTable";

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
  const { isAdmin } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-8">
      {/* View Toggle */}
      <div className="flex justify-end mb-2">
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "list")}>
          <ToggleGroupItem value="grid" aria-label="Visualização em grade">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="Visualização em lista">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {viewMode === "grid" ? (
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
          <NewProjectCard onClick={onNewProjectClick} />
          
          {isAdmin && <TestingCard />}
          
          {projects.map((project) => (
            <ProjectCard 
              key={project.id}
              project={project}
              onClick={onProjectClick}
            />
          ))}
        </div>
      ) : (
        <ProjectTable 
          projects={projects} 
          onProjectClick={onProjectClick}
          onNewProjectClick={onNewProjectClick}
          showAdminCard={isAdmin}
        />
      )}
    </div>
  );
};
