
import { Settings, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { HeaderAvatar } from './HeaderAvatar';
import { InstallAppButton } from './InstallAppButton';

type DesktopMenuProps = {
  onSettingsClick: () => void;
  onLogoutClick: () => void;
  onInstallClick: () => void;
  isInstallable: boolean;
};

export const DesktopMenu = ({ 
  onSettingsClick, 
  onLogoutClick, 
  onInstallClick,
  isInstallable
}: DesktopMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full h-10 w-10 p-0">
          <HeaderAvatar />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isInstallable && (
          <DropdownMenuItem onClick={onInstallClick} className="cursor-pointer">
            <InstallAppButton variant="ghost" className="cursor-pointer w-full justify-start p-0" onClick={onInstallClick}>
              Instalar aplicativo
            </InstallAppButton>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogoutClick} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
