
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface OptimizationLoadingDialogProps {
  isOpen: boolean;
}

export const OptimizationLoadingDialog = ({ isOpen }: OptimizationLoadingDialogProps) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
            <h3 className="text-lg font-medium">Otimizando Corte</h3>
          </div>
          
          <p className="text-center text-muted-foreground">
            Calculando a melhor posição para suas peças. Isso pode levar alguns segundos...
          </p>
          
          {/* Progress bar indeterminate */}
          <Progress className="w-full" />
          
          <p className="text-sm text-center text-muted-foreground">
            Por favor, aguarde enquanto otimizamos o seu projeto
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OptimizationLoadingDialog;
