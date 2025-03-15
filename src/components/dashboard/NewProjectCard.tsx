
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface NewProjectCardProps {
  onClick: () => void;
}

export const NewProjectCard = ({ onClick }: NewProjectCardProps) => {
  const isMobile = useIsMobile();

  return (
    <Card 
      className={`${isMobile ? 'h-48' : 'h-64'} cursor-pointer border-dashed border-2 hover:border-primary hover:bg-gray-50 transition-colors flex items-center justify-center`}
      onClick={onClick}
    >
      <div className="text-center p-6">
        <Plus className={`${isMobile ? 'h-12 w-12' : 'h-16 w-16'} mx-auto mb-4 text-muted-foreground`} />
        <h3 className="font-medium text-lg">Criar Novo Projeto</h3>
        <p className="text-sm text-muted-foreground mt-1">Iniciar um novo projeto de corte</p>
      </div>
    </Card>
  );
};
