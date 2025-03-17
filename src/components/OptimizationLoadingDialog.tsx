
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface OptimizationLoadingDialogProps {
  isOpen: boolean;
}

export const OptimizationLoadingDialog = ({ isOpen }: OptimizationLoadingDialogProps) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          <h3 className="text-lg font-medium">Otimizando Corte</h3>
          <p className="text-center text-muted-foreground">
            Calculando a melhor posição para suas peças. Isso pode levar alguns segundos...
          </p>
          <Progress value={undefined} className="w-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OptimizationLoadingDialog;
