
import { LogOut, Menu, Settings, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@/context/AuthContext';

interface MobileMenuProps {
  isInstallable: boolean;
  onInstall: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const MobileMenu = ({ 
  isInstallable, 
  onInstall, 
  onOpenSettings, 
  onLogout 
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
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.name || 'Usuário'}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          
          {isInstallable && (
            <Button variant="outline" className="justify-start gap-2" onClick={onInstall}>
              <Download className="h-4 w-4" />
              <span>Instalar aplicativo</span>
            </Button>
          )}
          
          <Button variant="outline" className="justify-start gap-2" onClick={onOpenSettings}>
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </Button>
          
          <Button variant="outline" className="justify-start gap-2" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
