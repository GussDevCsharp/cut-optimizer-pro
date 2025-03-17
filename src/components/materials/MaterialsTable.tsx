
import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { materialService } from '@/services/material';
import type { Material } from '@/types/material';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface MaterialsTableProps {
  materials: Material[];
  onEdit: (material: Material) => void;
  onRefresh: () => void;
}

export function MaterialsTable({ materials, onEdit, onRefresh }: MaterialsTableProps) {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Find the material being deleted
  const materialToDelete = materials.find((m) => m.id === deletingId);

  const handleDelete = async () => {
    if (!deletingId) return;

    setLoading(true);
    try {
      const response = await materialService.deleteMaterial(deletingId);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      toast({
        title: 'Material excluído',
        description: 'Material foi excluído com sucesso.',
      });
      
      // Refresh the materials list
      onRefresh();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao excluir o material.',
      });
    } finally {
      setLoading(false);
      setDeletingId(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-right">Espessura</TableHead>
            <TableHead className="text-right">Dimensões</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                Nenhum material cadastrado. 
                <Button variant="link" onClick={() => onEdit({ id: '', user_id: '', description: '', thickness: 15, width: 1220, height: 2440, created_at: '', updated_at: '' })}>
                  <Plus className="h-4 w-4 mr-1" /> Adicionar material
                </Button>
              </TableCell>
            </TableRow>
          ) : (
            materials.map((material) => (
              <TableRow key={material.id}>
                <TableCell>{material.description}</TableCell>
                <TableCell className="text-right">{material.thickness} mm</TableCell>
                <TableCell className="text-right">{material.width} x {material.height} mm</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(material)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeletingId(material.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir material</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o material "{materialToDelete?.description}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
