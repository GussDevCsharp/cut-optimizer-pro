
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Material } from "@/types/material";
import { MaterialForm } from "./MaterialForm";

interface MaterialDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Material, "id" | "created_at" | "updated_at" | "user_id">) => Promise<void>;
  initialData?: Material;
  title: string;
}

export function MaterialDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}: MaterialDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <MaterialForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
