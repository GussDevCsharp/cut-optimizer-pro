
import { Card, CardTitle, CardDescription, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const isMobile = useIsMobile();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Card 
      className={`${isMobile ? 'h-48' : 'h-64'} cursor-pointer hover:shadow-md transition-shadow`}
      onClick={() => onClick(project)}
    >
      <div className={`p-2 ${isMobile ? 'h-[50%]' : 'p-4 h-[60%]'} overflow-hidden bg-gray-100 rounded-t-md flex items-center justify-center`}>
        {project.preview_url ? (
          <img 
            src={project.preview_url} 
            alt={project.name} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-muted-foreground">Sem preview</div>
        )}
      </div>
      <CardHeader className={`${isMobile ? 'p-3 pb-0' : 'p-4 pb-0'}`}>
        <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>{project.name}</CardTitle>
        <CardDescription className="text-xs">Criado em {formatDate(project.date_created)}</CardDescription>
      </CardHeader>
      <CardFooter className={`${isMobile ? 'p-3 pt-2' : 'p-4 pt-2'}`}>
        <Button variant="outline" className="w-full" size={isMobile ? "sm" : "sm"}>
          Abrir Projeto
        </Button>
      </CardFooter>
    </Card>
  );
};
