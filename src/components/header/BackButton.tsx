
import { ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

type BackButtonProps = {
  onClick: () => void;
};

export const BackButton = ({ onClick }: BackButtonProps) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onClick}
      className="bg-lilac text-white hover:bg-lilac/90 border-lilac mr-1"
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      Dashboard
    </Button>
  );
};
