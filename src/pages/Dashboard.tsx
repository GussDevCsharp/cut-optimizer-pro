
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { projectService } from "@/services/projectService";
import type { Project } from "@/types/project";

// Dashboard components
import { UserMenu } from "@/components/dashboard/UserMenu";
import { ProjectsGrid } from "@/components/dashboard/ProjectsGrid";
import { NewProjectDialog } from "@/components/dashboard/NewProjectDialog";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await projectService.getProjects();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar projetos",
          description: error
        });
      } else if (data) {
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to load projects", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar projetos",
        description: "Não foi possível carregar seus projetos"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (projectName: string) => {
    if (!projectName.trim()) {
      toast({
        variant: "destructive",
        title: "Nome de projeto requerido",
        description: "Por favor, forneça um nome para o seu novo projeto.",
      });
      return;
    }

    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: "Você precisa estar logado para criar um projeto.",
      });
      return;
    }

    try {
      const { data, error } = await projectService.createProject({
        name: projectName,
        user_id: user.id,
        description: JSON.stringify({}), // Empty object for new projects
        preview_url: "/placeholder.svg"
      });

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Projeto criado com sucesso!",
        description: `Projeto "${projectName}" foi criado.`,
      });
      
      setIsDialogOpen(false);
      
      // Navigate to the project editor
      if (data) {
        navigate("/app", { state: { projectId: data.id, projectName: data.name } });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar projeto",
        description: error.message || "Não foi possível criar o projeto."
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProjectClick = (project: Project) => {
    navigate("/app", { state: { projectId: project.id, projectName: project.name } });
  };

  return (
    <Layout>
      <div className={`${isMobile ? 'px-2 py-2' : 'container mx-auto p-4'}`}>
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div>
            <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>Bem-vindo, {user?.name || "Usuário"}</h1>
            <p className="text-muted-foreground text-sm">Veja seus projetos recentes ou crie um novo</p>
          </div>
          
          {!isMobile && <UserMenu userName={user?.name} onLogout={handleLogout} />}
        </div>

        <ProjectsGrid 
          projects={projects}
          isLoading={isLoading}
          onNewProjectClick={() => setIsDialogOpen(true)}
          onProjectClick={handleProjectClick}
        />

        <NewProjectDialog 
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onCreateProject={handleCreateProject}
        />
      </div>
    </Layout>
  );
}
