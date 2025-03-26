
import { Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";

interface InstallAppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInstall: () => void;
  onDismiss: () => void;
}

export const InstallAppDialog = ({
  open,
  onOpenChange,
  onInstall,
  onDismiss
}: InstallAppDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Instalar Melhor Corte como aplicativo</DialogTitle>
          <DialogDescription>
            Instale o aplicativo Melhor Corte em seu dispositivo para uma experiência mais rápida e melhor, mesmo sem internet.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-center py-4">
          <div className="h-16 w-16 rounded-lg bg-primary flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary-foreground"></div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onDismiss}>
            Agora não
          </Button>
          <Button className="gap-2" onClick={onInstall}>
            <Download className="h-4 w-4" />
            Instalar aplicativo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
