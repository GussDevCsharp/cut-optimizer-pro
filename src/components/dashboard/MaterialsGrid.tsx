
import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/formatting";
import type { Material } from "@/types/material";

interface MaterialsGridProps {
  materials: Material[];
  isLoading: boolean;
  onEditMaterial: (material: Material) => void;
  onDeleteMaterial: (id: string) => void;
}

export function MaterialsGrid({ materials, isLoading, onEditMaterial, onDeleteMaterial }: MaterialsGridProps) {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // No materials
  if (materials.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Nenhum material cadastrado. Clique em "Novo Material" para começar.</p>
      </Card>
    );
  }

  // Material grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {materials.map((material) => (
        <Card key={material.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{material.name}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2 space-y-2">
            <div>
              <span className="text-sm font-medium">Tipo:</span>{" "}
              <span className="text-sm">{material.type}</span>
            </div>
            {material.price && (
              <div>
                <span className="text-sm font-medium">Preço:</span>{" "}
                <span className="text-sm">{formatCurrency(material.price)} / {material.unit}</span>
              </div>
            )}
            {material.stock_quantity !== undefined && (
              <div>
                <span className="text-sm font-medium">Estoque:</span>{" "}
                <span className="text-sm">{material.stock_quantity} {material.unit}</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onEditMaterial(material)}
            >
              <Edit className="h-4 w-4 mr-1" /> Editar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => {
                if (window.confirm(`Deseja realmente excluir o material "${material.name}"?`)) {
                  onDeleteMaterial(material.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Excluir
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
