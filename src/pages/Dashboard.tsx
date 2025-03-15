
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FolderPlus, LogOut } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/database";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [newProjectName, setNewProjectName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  // Query to fetch user's projects
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Project[];
    },
    enabled: !!user, // Only run query if user is authenticated
  });

  // Mutation to create a new project
  const createProjectMutation = useMutation({
    mutationFn: async (projectName: string) => {
      const { data, error } = await supabase
        .from('projects')
        .insert([
          { name: projectName, user_id: user?.id }
        ])
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      
      toast({
        title: "Projeto criado com sucesso!",
        description: `Projeto "${newProjectName}" foi criado.`,
      });
      
      setIsDialogOpen(false);
      setNewProjectName("");
      
      // Navigate to the app page with the project name
      navigate("/app", { state: { projectName: newProjectName } });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao criar projeto",
        description: error.message || "Ocorreu um erro ao criar o projeto. Tente novamente.",
      });
    }
  });

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast({
        variant: "destructive",
        title: "Nome de projeto requerido",
        description: "Por favor, forneça um nome para o seu novo projeto.",
      });
      return;
    }

    createProjectMutation.mutate(newProjectName);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProjectClick = (projectId: string, projectName: string) => {
    navigate("/app", { state: { projectId, projectName } });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Show error if projects query fails
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

        <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'} mb-8`}>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Card className={`${isMobile ? 'h-48' : 'h-64'} cursor-pointer border-dashed border-2 hover:border-primary hover:bg-gray-50 transition-colors flex items-center justify-center`}>
                <div className="text-center p-6">
                  <FolderPlus className={`${isMobile ? 'h-12 w-12' : 'h-16 w-16'} mx-auto mb-4 text-muted-foreground`} />
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
                <Button onClick={handleCreateProject} className={isMobile ? "w-full" : ""} disabled={createProjectMutation.isPending}>
                  {createProjectMutation.isPending ? (
                    "Criando..."
                  ) : (
                    <>
                      <FolderPlus className="h-4 w-4 mr-2" /> Criar Projeto
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {isLoading ? (
            // Loading skeleton for projects
            Array.from({ length: 3 }).map((_, idx) => (
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
            ))
          ) : projects.length > 0 ? (
            // Render projects
            projects.map((project) => (
              <Card 
                key={project.id} 
                className={`${isMobile ? 'h-48' : 'h-64'} cursor-pointer hover:shadow-md transition-shadow`}
                onClick={() => handleProjectClick(project.id, project.name)}
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
            ))
          ) : (
            // No projects message
            <div className="lg:col-span-3 text-center p-8 bg-muted/20 rounded-lg border border-dashed">
              <FolderPlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">Nenhum projeto encontrado</h3>
              <p className="text-muted-foreground">
                Você ainda não tem projetos. Clique em "Criar Novo Projeto" para começar.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
