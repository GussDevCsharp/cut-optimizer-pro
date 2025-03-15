import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FolderPlus, LogOut, Save, Plus } from "lucide-react";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { projectService } from "@/services/projectService";
import type { Project } from "@/types/project";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newProjectName, setNewProjectName] = useState("");
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

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
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
        name: newProjectName,
        user_id: user.id,
        data: {},
        preview_url: "/placeholder.svg"
      });

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Projeto criado com sucesso!",
        description: `Projeto "${newProjectName}" foi criado.`,
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Layout>
      <div className={`${isMobile ? 'px-2 py-2' : 'container mx-auto p-4'}`}>
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div>
            <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>Bem-vindo, {user?.name || "Usuário"}</h1>
            <p className="text-muted-foreground text-sm">Veja seus projetos recentes ou crie um novo</p>
          </div>
          
          {!isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-10 w-10 p-0">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center my-12">
            <p>Carregando seus projetos...</p>
          </div>
        ) : (
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'} mb-8`}>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Card className={`${isMobile ? 'h-48' : 'h-64'} cursor-pointer border-dashed border-2 hover:border-primary hover:bg-gray-50 transition-colors flex items-center justify-center`}>
                  <div className="text-center p-6">
                    <Plus className={`${isMobile ? 'h-12 w-12' : 'h-16 w-16'} mx-auto mb-4 text-muted-foreground`} />
                    <h3 className="font-medium text-lg">Criar Novo Projeto</h3>
                    <p className="text-sm text-muted-foreground mt-1">Iniciar um novo projeto de corte</p>
                  </div>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar novo projeto</DialogTitle>
                  <DialogDescription>
                    Dê um nome para o seu novo projeto de corte.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className={`${isMobile ? 'flex flex-col gap-2' : 'grid grid-cols-4 items-center gap-4'}`}>
                    <Label htmlFor="name" className={isMobile ? "" : "text-right"}>
                      Nome
                    </Label>
                    <Input 
                      id="name" 
                      value={newProjectName} 
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Meu Projeto de Corte"
                      className={isMobile ? "" : "col-span-3"} 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateProject} className={isMobile ? "w-full" : ""}>
                    <FolderPlus className="h-4 w-4 mr-2" /> Criar Projeto
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {projects.map((project) => (
              <Card 
                key={project.id} 
                className={`${isMobile ? 'h-48' : 'h-64'} cursor-pointer hover:shadow-md transition-shadow`}
                onClick={() => handleProjectClick(project)}
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
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
