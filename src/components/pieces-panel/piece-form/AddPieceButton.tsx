
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface AddPieceButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export const AddPieceButton = ({ 
  onClick, 
  isLoading 
}: AddPieceButtonProps) => {
  return (
    <Button 
      className="w-full mt-2" 
      onClick={onClick}
      disabled={isLoading}
    >
      <Plus size={16} className="mr-2" />
      {isLoading ? "Salvando..." : "Adicionar Peça"}
    </Button>
  );
};
