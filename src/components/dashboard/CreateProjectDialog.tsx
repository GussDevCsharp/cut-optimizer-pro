
import { FolderPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { createProject } from "@/services/project-service";

interface CreateProjectDialogProps {
  isMobile: boolean;
  newProjectName: string;
  setNewProjectName: (name: string) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export function CreateProjectDialog({ 
  isMobile, 
  newProjectName, 
  setNewProjectName, 
  isDialogOpen, 
  setIsDialogOpen 
}: CreateProjectDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: async (projectName: string) => {
      if (!user?.id) throw new Error("User ID is required");
      return createProject(projectName, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      
      toast({
        title: "Projeto criado com sucesso!",
        description: `Projeto "${newProjectName}" foi criado.`,
      });
      
      setIsDialogOpen(false);
      setNewProjectName("");
      
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

  return (
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
          <Button 
            onClick={handleCreateProject} 
            className={isMobile ? "w-full" : ""} 
            disabled={createProjectMutation.isPending}
          >
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
  );
}
