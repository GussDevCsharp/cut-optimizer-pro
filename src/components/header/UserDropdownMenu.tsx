
import { LogOut, Settings, Download } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';

interface UserDropdownMenuProps {
  isInstallable: boolean;
  onInstall: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const UserDropdownMenu = ({ 
  isInstallable, 
  onInstall, 
  onOpenSettings, 
  onLogout 
}: UserDropdownMenuProps) => {
  const { user } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full h-10 w-10 p-0">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isInstallable && (
          <DropdownMenuItem onClick={onInstall} className="cursor-pointer">
            <Download className="mr-2 h-4 w-4" />
            <span>Instalar aplicativo</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onOpenSettings} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
