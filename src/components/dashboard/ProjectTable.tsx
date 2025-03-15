
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Beaker } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types/project";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProjectTableProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  onNewProjectClick: () => void;
  showAdminCard: boolean;
}

export const ProjectTable = ({ projects, onProjectClick, onNewProjectClick, showAdminCard }: ProjectTableProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Parse the project description to get efficiency data
  const getEfficiency = (project: Project): number | null => {
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

  // Determine badge variant based on efficiency
  const getBadgeVariant = (efficiency: number | null) => {
    if (efficiency === null) return "secondary";
    if (efficiency >= 85) return "success";
    if (efficiency >= 70) return "warning";
    return "destructive";
  };

  const handleTestingClick = () => {
    navigate("/testing");
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            {!isMobile && <TableHead>Eficiência</TableHead>}
            <TableHead>Data de criação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Row for new project button */}
          <TableRow>
            <TableCell className="font-medium">
              <div className="flex items-center space-x-2">
                <PlusCircle className="h-4 w-4 text-primary" />
                <span>Novo Projeto</span>
              </div>
            </TableCell>
            {!isMobile && <TableCell>-</TableCell>}
            <TableCell>-</TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" onClick={onNewProjectClick}>
                Criar
              </Button>
            </TableCell>
          </TableRow>

          {/* Row for testing (admin only) */}
          {showAdminCard && (
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <Beaker className="h-4 w-4 text-orange-500" />
                  <span>Ambiente de Testes</span>
                </div>
              </TableCell>
              {!isMobile && <TableCell>-</TableCell>}
              <TableCell>-</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={handleTestingClick}>
                  Acessar
                </Button>
              </TableCell>
            </TableRow>
          )}

          {/* Rows for actual projects */}
          {projects.map((project) => {
            const efficiency = getEfficiency(project);
            
            return (
              <TableRow key={project.id} onClick={() => onProjectClick(project)} className="cursor-pointer">
                <TableCell className="font-medium">{project.name}</TableCell>
                {!isMobile && (
                  <TableCell>
                    {efficiency !== null ? (
                      <Badge variant={getBadgeVariant(efficiency)}>
                        {efficiency.toFixed(1)}%
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Sem dados</span>
                    )}
                  </TableCell>
                )}
                <TableCell>{formatDate(project.created_at)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    Abrir
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
