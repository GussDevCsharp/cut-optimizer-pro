
import { Settings, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from 'lucide-react';
import { HeaderAvatar } from './HeaderAvatar';
import { InstallAppButton } from './InstallAppButton';
import { useAuth } from '@/context/AuthContext';

type MobileMenuProps = {
  onSettingsClick: () => void;
  onLogoutClick: () => void;
  onInstallClick: () => void;
  isInstallable: boolean;
};

export const MobileMenu = ({ 
  onSettingsClick, 
  onLogoutClick, 
  onInstallClick,
  isInstallable
}: MobileMenuProps) => {
  const { user } = useAuth();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <div className="flex flex-col gap-4 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <HeaderAvatar />
            <div>
              <p className="font-medium">{user?.name || 'Usuário'}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          
          {isInstallable && (
            <InstallAppButton onClick={onInstallClick} />
          )}
          
          <Button variant="outline" className="justify-start gap-2" onClick={onSettingsClick}>
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </Button>
          
          <Button variant="outline" className="justify-start gap-2" onClick={onLogoutClick}>
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
