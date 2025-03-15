
import { FolderPlus } from "lucide-react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/database";

interface ProjectItemProps {
  project: Project;
  isMobile: boolean;
  onProjectClick: (projectId: string, projectName: string) => void;
}

export function ProjectItem({ project, isMobile, onProjectClick }: ProjectItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Card 
      key={project.id} 
      className={`${isMobile ? 'h-48' : 'h-64'} cursor-pointer hover:shadow-md transition-shadow`}
      onClick={() => onProjectClick(project.id, project.name)}
    >
      <div className={`p-2 ${isMobile ? 'h-[50%]' : 'p-4 h-[60%]'} overflow-hidden bg-gray-100 rounded-t-md flex items-center justify-center`}>
        <div className="flex items-center justify-center w-full h-full">
          <FolderPlus className="h-12 w-12 text-primary/40" />
        </div>
      </div>
      <CardHeader className={`${isMobile ? 'p-3 pb-0' : 'p-4 pb-0'}`}>
        <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>{project.name}</CardTitle>
        <CardDescription className="text-xs">Criado em {formatDate(project.created_at)}</CardDescription>
      </CardHeader>
      <CardFooter className={`${isMobile ? 'p-3 pt-2' : 'p-4 pt-2'}`}>
        <Button variant="outline" className="w-full" size={isMobile ? "sm" : "sm"}>
          Abrir Projeto
        </Button>
      </CardFooter>
    </Card>
  );
}
