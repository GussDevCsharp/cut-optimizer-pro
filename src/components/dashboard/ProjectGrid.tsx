
import { FolderPlus } from "lucide-react";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Project } from "@/types/database";
import { CreateProjectDialog } from "./CreateProjectDialog";
import { ProjectItem } from "./ProjectItem";

interface ProjectGridProps {
  projects: Project[];
  isLoading: boolean;
  error: Error | null;
  isMobile: boolean;
  onProjectClick: (projectId: string, projectName: string) => void;
  newProjectName: string;
  setNewProjectName: (name: string) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export function ProjectGrid({ 
  projects, 
  isLoading, 
  error, 
  isMobile, 
  onProjectClick,
  newProjectName,
  setNewProjectName,
  isDialogOpen,
  setIsDialogOpen
}: ProjectGridProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar projetos",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar seus projetos.",
      });
    }
  }, [error, toast]);

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'} mb-8`}>
      <CreateProjectDialog
        isMobile={isMobile}
        newProjectName={newProjectName}
        setNewProjectName={setNewProjectName}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />

      {isLoading ? (
        <LoadingProjects isMobile={isMobile} />
      ) : projects.length > 0 ? (
        projects.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            isMobile={isMobile}
            onProjectClick={onProjectClick}
          />
        ))
      ) : (
        <EmptyProjectsMessage />
      )}
    </div>
  );
}

function LoadingProjects({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      {Array.from({ length: 3 }).map((_, idx) => (
        <Card key={`loading-${idx}`} className={`${isMobile ? 'h-48' : 'h-64'} animate-pulse`}>
          <div className={`p-2 ${isMobile ? 'h-[50%]' : 'p-4 h-[60%]'} bg-gray-200 rounded-t-md`}></div>
          <CardHeader className={`${isMobile ? 'p-3 pb-0' : 'p-4 pb-0'}`}>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </CardHeader>
          <CardFooter className={`${isMobile ? 'p-3 pt-2' : 'p-4 pt-2'}`}>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}

function EmptyProjectsMessage() {
  return (
    <div className="lg:col-span-3 text-center p-8 bg-muted/20 rounded-lg border border-dashed">
      <FolderPlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
      <h3 className="text-lg font-medium mb-2">Nenhum projeto encontrado</h3>
      <p className="text-muted-foreground">
        Você ainda não tem projetos. Clique em "Criar Novo Projeto" para começar.
      </p>
    </div>
  );
}
