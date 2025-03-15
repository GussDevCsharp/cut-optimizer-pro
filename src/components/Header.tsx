
import { useState, useEffect } from 'react';
import { FileText, Download, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useSheetData } from '../hooks/useSheetData';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Header = () => {
  const { stats, projectName } = useSheetData();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleExport = () => {
    // Future implementation: Export functionality
    console.log("Export functionality to be implemented");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
      scrolled 
        ? "bg-background/80 backdrop-blur-lg shadow-subtle" 
        : "bg-transparent"
    }`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-primary-foreground"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold tracking-tight">Melhor Corte</h1>
            {projectName && <span className="text-xs text-muted-foreground">{projectName}</span>}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 md:space-x-6">
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-xs flex flex-col items-end">
              <span className="text-muted-foreground">Eficiência</span>
              <span className="font-medium">{stats.efficiency.toFixed(1)}%</span>
            </div>
            
            <div className="h-8 w-px bg-border"></div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={handleExport}
            >
              <FileText size={16} />
              <span>Relatório</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={handleExport}
            >
              <Download size={16} />
              <span>Exportar</span>
            </Button>
          </div>

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
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
