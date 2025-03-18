
import React from "react";
import { Material } from "@/types/material";

interface DeleteMaterialDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  material: Material | null;
}

export function DeleteMaterialDialog({
  isOpen,
  onClose,
  onDelete,
  material
}: DeleteMaterialDialogProps) {
  if (!isOpen || !material) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-background rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-2">Excluir Material</h3>
        <p className="mb-4">
          Tem certeza que deseja excluir{" "}
          <span className="font-medium">{material?.name}</span>?
          Esta ação não pode ser desfeita.
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 border rounded-md hover:bg-accent"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
            onClick={onDelete}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
