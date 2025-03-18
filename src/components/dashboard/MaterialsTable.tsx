
import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/formatting";
import type { Material } from "@/types/material";

interface MaterialsTableProps {
  materials: Material[];
  isLoading: boolean;
  onEditMaterial: (material: Material) => void;
  onDeleteMaterial: (id: string) => void;
}

export function MaterialsTable({ materials, isLoading, onEditMaterial, onDeleteMaterial }: MaterialsTableProps) {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Preço / Unidade</TableHead>
              <TableHead>Dimensões</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Disponibilidade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-9 w-24 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // No materials
  if (materials.length === 0) {
    return (
      <div className="rounded-md border p-6 text-center">
        <p className="text-muted-foreground">Nenhum material cadastrado. Clique em "Novo Material" para começar.</p>
      </div>
    );
  }

  // Materials table
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Preço / Unidade</TableHead>
            <TableHead>Dimensões</TableHead>
            <TableHead>Estoque</TableHead>
            <TableHead>Disponibilidade</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material.id}>
              <TableCell className="font-medium">{material.name}</TableCell>
              <TableCell>{material.type}</TableCell>
              <TableCell>{material.price ? `${formatCurrency(material.price)} / ${material.unit}` : '-'}</TableCell>
              <TableCell>
                {material.width && material.height 
                  ? `${material.width} × ${material.height} ${material.thickness ? `× ${material.thickness}` : ''}`
                  : '-'}
              </TableCell>
              <TableCell>{material.stock_quantity !== undefined ? `${material.stock_quantity} ${material.unit}` : '-'}</TableCell>
              <TableCell>{material.availability || 'Disponível'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEditMaterial(material)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      if (window.confirm(`Deseja realmente excluir o material "${material.name}"?`)) {
                        onDeleteMaterial(material.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
