
import React from "react";
import { ProjectCard } from "./ProjectCard";
import { NewProjectCard } from "./NewProjectCard";
import { TestingCard } from "./TestingCard";
import { ProjectTable } from "./ProjectTable";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, Table } from "lucide-react";
import type { Project } from "@/types/project";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectsGridProps {
  projects: Project[];
  isLoading: boolean;
  onNewProjectClick: () => void;
  onProjectClick: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
}

export function ProjectsGrid({ 
  projects, 
  isLoading, 
  onNewProjectClick, 
  onProjectClick,
  onDeleteProject
}: ProjectsGridProps) {
  const isMobile = useIsMobile();
  const { isAdmin } = useAuth();
  const [view, setView] = React.useState<"grid" | "table">("grid");

  const handleDeleteProject = (project: Project) => {
    if (onDeleteProject) {
      onDeleteProject(project);
    }
  };

  if (isLoading) {
    // Show skeleton loaders while loading
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="h-64 rounded-md overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Seus projetos</h2>
        <Tabs value={view} onValueChange={(v) => setView(v as "grid" | "table")} className="hidden sm:block">
          <TabsList>
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              <span className="hidden sm:inline">Grade</span>
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              <span className="hidden sm:inline">Lista</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* New Project Card */}
          <NewProjectCard onClick={onNewProjectClick} />
          
          {/* Testing Environment Card (admin only) */}
          {isAdmin && <TestingCard />}
          
          {/* Project Cards */}
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={onProjectClick}
              onDeleteClick={handleDeleteProject}
            />
          ))}
        </div>
      ) : (
        // Table view
        <ProjectTable 
          projects={projects} 
          onProjectClick={onProjectClick} 
          onNewProjectClick={onNewProjectClick}
          onDeleteProject={handleDeleteProject}
          showAdminCard={isAdmin}
        />
      )}
    </div>
  );
}
