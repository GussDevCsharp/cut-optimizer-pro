
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useProjectActions } from "@/hooks/useProjectActions";
import { useSheetData } from "@/hooks/useSheetData";

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

  const handleSave = async () => {
    // Create a complete project data object with all necessary information
    const projectData = {
      sheet, 
      pieces,
      placedPieces
    };
    
    await saveProject(projectId, projectName, projectData);
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
