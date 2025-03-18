
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Package } from "lucide-react";

// Materials components and services
import { MaterialsList } from "@/components/materials/MaterialsList";
import { MaterialDialog } from "@/components/materials/MaterialDialog";
import { Material } from "@/types/material";
import {
  fetchMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from "@/services/materialService";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Materials state
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialsLoading, setMaterialsLoading] = useState(true);
  const [isAddMaterialDialogOpen, setIsAddMaterialDialogOpen] = useState(false);
  const [isEditMaterialDialogOpen, setIsEditMaterialDialogOpen] = useState(false);
  const [isDeleteMaterialDialogOpen, setIsDeleteMaterialDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [activeTab, setActiveTab] = useState("projects");

  useEffect(() => {
    if (activeTab === "projects") {
      loadProjects();
    } else if (activeTab === "materials") {
      loadMaterials();
    }
  }, [user, activeTab]);

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

  const loadMaterials = async () => {
    if (!user) return;
    
    setMaterialsLoading(true);
    try {
      const { data, error } = await fetchMaterials(user.id);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar materiais",
          description: error
        });
      } else if (data) {
        setMaterials(data);
      }
    } catch (error) {
      console.error("Failed to load materials", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar materiais",
        description: "Não foi possível carregar seus materiais"
      });
    } finally {
      setMaterialsLoading(false);
    }
  };

  // Project handlers
  const handleCreateProject = async (projectName: string, imageFile?: File) => {
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
      // Default preview URL
      let preview_url = "/placeholder.svg";
      
      // If image file is provided, upload it to Supabase Storage
      if (imageFile) {
        const { data: fileData, error: fileError } = await projectService.uploadProjectImage(imageFile);
        
        if (fileError) {
          console.error("Error uploading image:", fileError);
          toast({
            variant: "destructive",
            title: "Erro ao fazer upload da imagem",
            description: "A imagem não pôde ser carregada, mas o projeto será criado mesmo assim."
          });
        } else if (fileData) {
          preview_url = fileData.path;
        }
      }

      const { data, error } = await projectService.createProject({
        name: projectName,
        user_id: user.id,
        description: JSON.stringify({}), // Empty object for new projects
        preview_url
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

  // Material handlers
  const handleAddMaterial = async (
    data: Omit<Material, "id" | "created_at" | "updated_at" | "user_id">
  ) => {
    try {
      const result = await createMaterial({
        ...data,
        user_id: user?.id || "",
      });
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Erro ao criar material",
          description: result.error
        });
      } else {
        toast({
          title: "Material criado com sucesso!",
          description: `Material "${data.name}" foi criado.`,
        });
        setIsAddMaterialDialogOpen(false);
        loadMaterials();
      }
    } catch (error) {
      console.error("Failed to create material", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar material",
        description: "Não foi possível criar o material"
      });
    }
  };

  const handleEditMaterial = async (
    data: Omit<Material, "id" | "created_at" | "updated_at" | "user_id">
  ) => {
    if (!selectedMaterial) return;

    try {
      const result = await updateMaterial(selectedMaterial.id, data);
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Erro ao atualizar material",
          description: result.error
        });
      } else {
        toast({
          title: "Material atualizado com sucesso!",
          description: `Material "${data.name}" foi atualizado.`,
        });
        setIsEditMaterialDialogOpen(false);
        setSelectedMaterial(null);
        loadMaterials();
      }
    } catch (error) {
      console.error("Failed to update material", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar material",
        description: "Não foi possível atualizar o material"
      });
    }
  };

  const handleOpenEditDialog = (material: Material) => {
    setSelectedMaterial(material);
    setIsEditMaterialDialogOpen(true);
  };

  const handleDeleteMaterial = async () => {
    if (!selectedMaterial) return;
    
    try {
      const result = await deleteMaterial(selectedMaterial.id);
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Erro ao excluir material",
          description: result.error
        });
      } else {
        toast({
          title: "Material excluído com sucesso!",
          description: `Material "${selectedMaterial.name}" foi excluído.`,
        });
        setIsDeleteMaterialDialogOpen(false);
        setSelectedMaterial(null);
        loadMaterials();
      }
    } catch (error) {
      console.error("Failed to delete material", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir material",
        description: "Não foi possível excluir o material"
      });
    }
  };

  return (
    <Layout>
      <div className={`${isMobile ? 'px-2 py-2' : 'container mx-auto p-4'}`}>
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div>
            <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>Bem-vindo, {user?.name || "Usuário"}</h1>
            <p className="text-muted-foreground text-sm">Gerencie seus projetos e materiais</p>
          </div>
          
          {!isMobile && <UserMenu userName={user?.name} onLogout={handleLogout} />}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Projetos</span>
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Materiais</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="materials" className="space-y-4">
            <MaterialsList
              materials={materials}
              onEdit={handleOpenEditDialog}
              onDelete={(id) => {
                const material = materials.find((m) => m.id === id);
                if (material) {
                  setSelectedMaterial(material);
                  setIsDeleteMaterialDialogOpen(true);
                }
              }}
              onAdd={() => setIsAddMaterialDialogOpen(true)}
            />
            
            {/* Add Material Dialog */}
            <MaterialDialog
              isOpen={isAddMaterialDialogOpen}
              onClose={() => setIsAddMaterialDialogOpen(false)}
              onSubmit={handleAddMaterial}
              title="Adicionar Material"
            />

            {/* Edit Material Dialog */}
            {selectedMaterial && (
              <MaterialDialog
                isOpen={isEditMaterialDialogOpen}
                onClose={() => {
                  setIsEditMaterialDialogOpen(false);
                  setSelectedMaterial(null);
                }}
                onSubmit={handleEditMaterial}
                initialData={selectedMaterial}
                title="Editar Material"
              />
            )}

            {/* Delete Confirmation Dialog */}
            <div>
              {isDeleteMaterialDialogOpen && selectedMaterial && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                  <div className="bg-background rounded-lg p-6 w-full max-w-md">
                    <h3 className="text-lg font-medium mb-2">Excluir Material</h3>
                    <p className="mb-4">
                      Tem certeza que deseja excluir{" "}
                      <span className="font-medium">{selectedMaterial?.name}</span>?
                      Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        className="px-4 py-2 border rounded-md hover:bg-accent"
                        onClick={() => {
                          setIsDeleteMaterialDialogOpen(false);
                          setSelectedMaterial(null);
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
                        onClick={handleDeleteMaterial}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
