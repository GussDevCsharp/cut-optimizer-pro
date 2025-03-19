
import { Card, CardTitle, CardDescription, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Trash2 } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
  onDeleteClick?: (project: Project) => void;
}

export const ProjectCard = ({ project, onClick, onDeleteClick }: ProjectCardProps) => {
  const isMobile = useIsMobile();
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getEfficiency = (): number | null => {
    try {
      if (project.description) {
        const data = JSON.parse(project.description);
        if (data.stats && typeof data.stats.efficiency === 'number') {
          return data.stats.efficiency;
        }
      }
      return null;
    } catch (error) {
      console.error("Error parsing project description:", error);
      return null;
    }
  };

  const efficiency = getEfficiency();
  
  const getBadgeVariant = (efficiency: number | null) => {
    if (efficiency === null) return "secondary";
    if (efficiency >= 85) return "success";
    if (efficiency >= 70) return "warning";
    return "destructive";
  };

  const hasProjectImage = project.preview_url && 
                          project.preview_url !== "/placeholder.svg" && 
                          !imageError;

  const handleProjectClick = () => {
    try {
      onClick(project);
    } catch (error) {
      console.error("Error clicking project:", error);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteClick) {
      onDeleteClick(project);
    }
  };

  return (
    <Card 
      className={`${isMobile ? 'h-48' : 'h-64'} cursor-pointer hover:shadow-md transition-shadow`}
      onClick={handleProjectClick}
    >
      <div className={`p-2 ${isMobile ? 'h-[50%]' : 'p-4 h-[60%]'} overflow-hidden bg-gray-100 rounded-t-md flex items-center justify-center relative`}>
        {hasProjectImage ? (
          <img 
            src={project.preview_url} 
            alt={project.name} 
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
            {efficiency !== null ? (
              <>
                <div className="text-4xl font-bold text-primary">
                  {efficiency.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Eficiência</div>
              </>
            ) : (
              <div className="text-muted-foreground">Sem dados de eficiência</div>
            )}
          </div>
        )}
        
        {efficiency !== null && hasProjectImage && (
          <Badge 
            variant={getBadgeVariant(efficiency)}
            className="absolute top-2 right-2 text-xs"
          >
            {efficiency.toFixed(1)}% eficiência
          </Badge>
        )}
        
        {onDeleteClick && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 left-2 h-7 w-7 opacity-80 hover:opacity-100"
            onClick={handleDeleteClick}
            aria-label="Excluir projeto"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
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
