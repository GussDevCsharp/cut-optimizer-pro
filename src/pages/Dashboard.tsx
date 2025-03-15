
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FolderPlus, LogOut } from "lucide-react";

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

type Project = {
  id: string;
  name: string;
  date: string;
  previewUrl?: string;
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll use mock data
    const mockProjects = [
      { id: "1", name: "Projeto de Madeira 1", date: "10/05/2023", previewUrl: "/placeholder.svg" },
      { id: "2", name: "Corte Especial", date: "15/06/2023", previewUrl: "/placeholder.svg" },
      { id: "3", name: "Móveis Sala", date: "22/07/2023", previewUrl: "/placeholder.svg" },
      { id: "4", name: "Projeto Cozinha", date: "05/08/2023", previewUrl: "/placeholder.svg" },
      { id: "5", name: "Mesa Escritório", date: "18/09/2023", previewUrl: "/placeholder.svg" },
    ];
    setProjects(mockProjects);
  }, []);

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast({
        variant: "destructive",
        title: "Nome de projeto requerido",
        description: "Por favor, forneça um nome para o seu novo projeto.",
      });
      return;
    }

    // In a real app, this would make an API call to create a project
    // For now, we'll just mock it and redirect
    toast({
      title: "Projeto criado com sucesso!",
      description: `Projeto "${newProjectName}" foi criado.`,
    });
    
    setIsDialogOpen(false);
    // Pass the project name as state when navigating
    navigate("/app", { state: { projectName: newProjectName } });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProjectClick = (projectId: string, projectName: string) => {
    // In a real app, this would load the selected project
    // Pass the project name as state when navigating
    navigate("/app", { state: { projectName: projectName } });
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
              onClick={() => handleProjectClick(project.id, project.name)}
            >
              <div className={`p-2 ${isMobile ? 'h-[50%]' : 'p-4 h-[60%]'} overflow-hidden bg-gray-100 rounded-t-md flex items-center justify-center`}>
                {project.previewUrl ? (
                  <img 
                    src={project.previewUrl} 
                    alt={project.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground">Sem preview</div>
                )}
              </div>
              <CardHeader className={`${isMobile ? 'p-3 pb-0' : 'p-4 pb-0'}`}>
                <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>{project.name}</CardTitle>
                <CardDescription className="text-xs">Criado em {project.date}</CardDescription>
              </CardHeader>
              <CardFooter className={`${isMobile ? 'p-3 pt-2' : 'p-4 pt-2'}`}>
                <Button variant="outline" className="w-full" size={isMobile ? "sm" : "sm"}>
                  Abrir Projeto
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
