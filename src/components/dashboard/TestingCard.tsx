
import { Beaker } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";

export const TestingCard = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/testing");
  };

  return (
    <Card 
      className={`${isMobile ? 'h-48' : 'h-64'} cursor-pointer border-dashed border-2 hover:border-orange-400 hover:bg-orange-50 transition-colors flex items-center justify-center`}
      onClick={handleClick}
    >
      <div className="text-center p-6">
        <Beaker className={`${isMobile ? 'h-12 w-12' : 'h-16 w-16'} mx-auto mb-4 text-orange-500`} />
        <h3 className="font-medium text-lg">Ambiente de Testes</h3>
        <p className="text-sm text-muted-foreground mt-1">Acesse ferramentas e funções de teste</p>
      </div>
    </Card>
  );
};
