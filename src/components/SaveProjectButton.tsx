
import { Button } from "@/components/ui/button";
import { Save, Upload } from "lucide-react";
import { useProjectActions } from "@/hooks/useProjectActions";
import { useSheetData } from "@/hooks/useSheetData";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";

interface SaveProjectButtonProps {
  projectId: string | null;
  className?: string;
}

export function SaveProjectButton({ 
  projectId, 
  className = "" 
}: SaveProjectButtonProps) {
  const { saveProject, isSaving, isUploadingImage } = useProjectActions();
  const { projectName, sheet, pieces, placedPieces } = useSheetData();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    // Create a complete project data object with all necessary information
    const projectData = {
      sheet, 
      pieces,
      placedPieces,
      stats: {
        // Calculate efficiency if we have the necessary data
        efficiency: calculateEfficiency()
      }
    };
    
    console.log("Saving project data:", projectData);
    
    const savedProject = await saveProject(
      projectId, 
      projectName, 
      projectData,
      selectedImage || undefined,
      sheet.materialId
    );
    
    if (savedProject) {
      toast({
        title: "Projeto salvo",
        description: `${projectName} foi salvo com sucesso com ${pieces.length} peças.`
      });
      // Reset selected image after successful save
      setSelectedImage(null);
    }
  };

  const calculateEfficiency = (): number => {
    if (!sheet || !sheet.width || !sheet.height || !placedPieces || placedPieces.length === 0) {
      return 0;
    }

    // Calculate total sheet area
    const sheetArea = sheet.width * sheet.height;
    
    // Calculate total area of placed pieces
    const placedPiecesArea = placedPieces.reduce((total, piece) => {
      return total + (piece.width * piece.height);
    }, 0);
    
    // Calculate efficiency as percentage
    return (placedPiecesArea / sheetArea) * 100;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      toast({
        title: "Imagem selecionada",
        description: "A imagem será salva junto com o projeto."
      });
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <Button 
        onClick={triggerFileInput}
        variant="outline"
        size="sm"
        type="button"
        disabled={isSaving || isUploadingImage}
      >
        <Upload className="h-4 w-4 mr-1" />
        {selectedImage ? "Imagem selecionada" : "Adicionar imagem"}
      </Button>
      <Button 
        onClick={handleSave} 
        disabled={isSaving || isUploadingImage || !projectName} 
        className={className}
        size="sm"
      >
        <Save className="h-4 w-4 mr-2" />
        {isSaving 
          ? "Salvando..." 
          : isUploadingImage 
            ? "Enviando imagem..." 
            : "Salvar Projeto"}
      </Button>
    </div>
  );
}
