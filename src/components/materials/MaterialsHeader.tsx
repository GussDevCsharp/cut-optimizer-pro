
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserMenu } from '@/components/dashboard/UserMenu';

interface MaterialsHeaderProps {
  userName: string | undefined;
  onLogout: () => void;
  isMobile: boolean;
}

export function MaterialsHeader({ userName, onLogout, isMobile }: MaterialsHeaderProps) {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex justify-between items-center mb-6 md:mb-8">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBackToDashboard} 
          className="mr-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>
            Cadastro de Materiais
          </h1>
          <p className="text-muted-foreground text-sm">
            Gerencie os materiais disponíveis para seus planos de corte
          </p>
        </div>
      </div>
      
      {!isMobile && <UserMenu userName={userName} onLogout={onLogout} />}
    </div>
  );
}
