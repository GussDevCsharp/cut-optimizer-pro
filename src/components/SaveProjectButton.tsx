
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useProjectActions } from "@/hooks/useProjectActions";
import { useSheetData } from "@/hooks/useSheetData";
import { useToast } from "@/hooks/use-toast";

interface SaveProjectButtonProps {
  projectId: string | null;
  className?: string;
}

export function SaveProjectButton({ 
  projectId, 
  className = "" 
}: SaveProjectButtonProps) {
  const { saveProject, isSaving } = useProjectActions();
  const { projectName, sheet, pieces, placedPieces } = useSheetData();
  const { toast } = useToast();

  const handleSave = async () => {
    // Create a complete project data object with all necessary information
    const projectData = {
      sheet, 
      pieces,
      placedPieces
    };
    
    console.log("Saving project data:", projectData); // Add logging to debug
    
    const savedProject = await saveProject(projectId, projectName, projectData);
    
    if (savedProject) {
      toast({
        title: "Projeto salvo",
        description: `${projectName} foi salvo com sucesso com ${pieces.length} peças.`
      });
    }
  };

  return (
    <Button 
      onClick={handleSave} 
      disabled={isSaving || !projectName} 
      className={className}
      size="sm"
    >
      <Save className="h-4 w-4 mr-2" />
      {isSaving ? "Salvando..." : "Salvar Projeto"}
    </Button>
  );
}
