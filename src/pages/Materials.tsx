
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { MaterialsList } from "@/components/materials/MaterialsList";
import { MaterialDialog } from "@/components/materials/MaterialDialog";
import { Material } from "@/types/material";
import {
  fetchMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  initializeMaterialsTable,
} from "@/services/materialService";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Layout from "@/components/Layout";
import { useInitializeDatabase } from "@/hooks/useInitializeDatabase";

export default function Materials() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const { isInitializing, error: initError } = useInitializeDatabase();

  // Show initialization error if there was one
  useEffect(() => {
    if (initError) {
      toast.error("Erro de inicialização", {
        description: initError,
      });
    }
  }, [initError]);

  // Query to fetch materials
  const { data: materialsData, isLoading } = useQuery({
    queryKey: ["materials", user?.id],
    queryFn: () => fetchMaterials(user?.id || ""),
    enabled: !!user?.id && !isInitializing,
  });

  // Mutation to create a new material
  const createMaterialMutation = useMutation({
    mutationFn: (newMaterial: Omit<Material, "id" | "created_at" | "updated_at">) =>
      createMaterial(newMaterial),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials", user?.id] });
      setIsAddDialogOpen(false);
      toast.success("Material criado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar material", {
        description: (error as Error).message || "Tente novamente mais tarde",
      });
    },
  });

  // Mutation to update an existing material
  const updateMaterialMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Material, "id" | "created_at" | "user_id">>;
    }) => updateMaterial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials", user?.id] });
      setIsEditDialogOpen(false);
      setSelectedMaterial(null);
      toast.success("Material atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar material", {
        description: (error as Error).message || "Tente novamente mais tarde",
      });
    },
  });

  // Mutation to delete a material
  const deleteMaterialMutation = useMutation({
    mutationFn: (id: string) => deleteMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials", user?.id] });
      setIsDeleteDialogOpen(false);
      setSelectedMaterial(null);
      toast.success("Material excluído com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir material", {
        description: (error as Error).message || "Tente novamente mais tarde",
      });
    },
  });

  // Handlers
  const handleAddMaterial = async (
    data: Omit<Material, "id" | "created_at" | "updated_at" | "user_id">
  ) => {
    await createMaterialMutation.mutateAsync({
      ...data,
      user_id: user?.id || "",
    });
  };

  const handleEditMaterial = async (
    data: Omit<Material, "id" | "created_at" | "updated_at" | "user_id">
  ) => {
    if (!selectedMaterial) return;

    await updateMaterialMutation.mutateAsync({
      id: selectedMaterial.id,
      data,
    });
  };

  const handleOpenEditDialog = (material: Material) => {
    setSelectedMaterial(material);
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (material: Material) => {
    setSelectedMaterial(material);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteMaterial = async () => {
    if (!selectedMaterial) return;
    await deleteMaterialMutation.mutateAsync(selectedMaterial.id);
  };

  const materials = materialsData?.data || [];

  return (
    <Layout>
      <div className="container py-6 space-y-6">
        {isInitializing ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <p className="text-muted-foreground">Inicializando banco de dados...</p>
            </div>
          </div>
        ) : (
          <MaterialsList
            materials={materials}
            onEdit={handleOpenEditDialog}
            onDelete={(id) => {
              const material = materials.find((m) => m.id === id);
              if (material) {
                handleOpenDeleteDialog(material);
              }
            }}
            onAdd={() => setIsAddDialogOpen(true)}
          />
        )}

        {/* Add Material Dialog */}
        <MaterialDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSubmit={handleAddMaterial}
          title="Adicionar Material"
        />

        {/* Edit Material Dialog */}
        {selectedMaterial && (
          <MaterialDialog
            isOpen={isEditDialogOpen}
            onClose={() => {
              setIsEditDialogOpen(false);
              setSelectedMaterial(null);
            }}
            onSubmit={handleEditMaterial}
            initialData={selectedMaterial}
            title="Editar Material"
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={(open) => !open && setIsDeleteDialogOpen(false)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Material</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir{" "}
                <span className="font-medium">{selectedMaterial?.name}</span>?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteMaterial} className="bg-destructive text-destructive-foreground">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
