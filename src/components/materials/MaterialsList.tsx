
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  FileBox,
  PackageOpen,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Material } from "@/types/material";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatting";

interface MaterialsListProps {
  materials: Material[];
  onEdit: (material: Material) => void;
  onDelete: (materialId: string) => void;
  onAdd: () => void;
}

export function MaterialsList({
  materials,
  onEdit,
  onDelete,
  onAdd,
}: MaterialsListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter materials based on search term with null/undefined checks
  const filteredMaterials = materials.filter((material) =>
    (material.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    ((material.description || "").toLowerCase()).includes(searchTerm.toLowerCase()) ||
    ((material.type || "").toLowerCase()).includes(searchTerm.toLowerCase()) ||
    ((material.color || "").toLowerCase()).includes(searchTerm.toLowerCase()) ||
    ((material.supplier || "").toLowerCase()).includes(searchTerm.toLowerCase())
  );

  // Function to get material type label
  const getMaterialTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      mdf: "MDF",
      mdp: "MDP",
      madeira: "Madeira",
      metal: "Metal",
      vidro: "Vidro",
      plastico: "Plástico",
      outro: "Outro",
    };
    
    return types[type] || type;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <PackageOpen className="h-5 w-5" />
          Materiais
        </CardTitle>
        <Button onClick={onAdd} className="ml-auto">
          <Plus className="mr-2 h-4 w-4" /> Adicionar Material
        </Button>
      </CardHeader>

      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar materiais..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredMaterials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileBox className="h-12 w-12 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">Nenhum material encontrado</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {materials.length === 0
                ? "Adicione seu primeiro material para começar."
                : "Tente ajustar sua busca para encontrar o que procura."}
            </p>
            {materials.length === 0 && (
              <Button className="mt-4" onClick={onAdd}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar Material
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Dimensões</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">
                      {material.name}
                      {material.color && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({material.color})
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{material.type ? getMaterialTypeLabel(material.type) : "-"}</TableCell>
                    <TableCell>
                      {material.thickness && (
                        <span>{material.thickness}mm </span>
                      )}
                      {material.width && material.height && (
                        <span>
                          {material.width} x {material.height}mm
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {material.price
                        ? `${formatCurrency(material.price)}/${material.unit || "unid"}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {material.stock_quantity !== undefined
                        ? `${material.stock_quantity} ${material.unit || "unid"}`
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(material)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(material.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
