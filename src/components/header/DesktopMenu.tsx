
import { LogOut, Settings, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from '@/types/auth';

interface DesktopMenuProps {
  user: User | null;
  isInstallable: boolean;
  onInstallClick: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const DesktopMenu = ({ 
  user, 
  isInstallable, 
  onInstallClick, 
  onOpenSettings, 
  onLogout 
}: DesktopMenuProps) => {
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
          <DropdownMenuItem onClick={onInstallClick} className="cursor-pointer">
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

export default DesktopMenu;
