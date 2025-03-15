
import { useState } from "react";
import { FolderPlus, Image as ImageIcon } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface NewProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (name: string, imageFile?: File) => void;
}

export const NewProjectDialog = ({ 
  isOpen, 
  onOpenChange, 
  onCreateProject 
}: NewProjectDialogProps) => {
  const [newProjectName, setNewProjectName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const isMobile = useIsMobile();

  const handleCreateProject = () => {
    onCreateProject(newProjectName, imageFile || undefined);
    setNewProjectName(""); // Reset for next time
    setImageFile(null); // Reset image file
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar novo projeto</DialogTitle>
          <DialogDescription>
            Dê um nome para o seu novo projeto de corte.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className={`${isMobile ? 'flex flex-col gap-2' : 'grid grid-cols-4 items-center gap-4'}`}>
            <Label htmlFor="name" className={isMobile ? "" : "text-right"}>
              Nome
            </Label>
            <Input 
              id="name" 
              value={newProjectName} 
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Meu Projeto de Corte"
              className={isMobile ? "" : "col-span-3"} 
            />
          </div>
          
          <div className={`${isMobile ? 'flex flex-col gap-2' : 'grid grid-cols-4 items-center gap-4'}`}>
            <Label htmlFor="project-image" className={isMobile ? "" : "text-right"}>
              Imagem
            </Label>
            <div className={isMobile ? "" : "col-span-3"}>
              <Input
                id="project-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {imageFile && (
                <p className="text-xs text-muted-foreground mt-1">
                  {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)
                </p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateProject} className={isMobile ? "w-full" : ""}>
            <FolderPlus className="h-4 w-4 mr-2" /> Criar Projeto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
