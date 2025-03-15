
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useProjectActions } from "@/hooks/useProjectActions";

interface SaveProjectButtonProps {
  projectId: string | null;
  projectName: string;
  projectData: any;
  className?: string;
}

export function SaveProjectButton({ 
  projectId, 
  projectName, 
  projectData, 
  className = "" 
}: SaveProjectButtonProps) {
  const { saveProject, isSaving } = useProjectActions();

  const handleSave = async () => {
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
