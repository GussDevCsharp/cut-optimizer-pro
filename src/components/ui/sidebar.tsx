import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import { 
  Home, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Users,
  BarChart3,
  Scissors,
  Calendar,
  Clock,
  HelpCircle
} from "lucide-react";

interface SidebarProps {
  className?: string;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ 
  className, 
  isMobile = false,
  isOpen = true,
  onClose
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/dashboard",
      onClick: () => handleNavigate("/dashboard"),
      show: true
    },
    {
      title: "Otimizador",
      icon: <Scissors className="h-5 w-5" />,
      path: "/app",
      onClick: () => handleNavigate("/app"),
      show: true
    },
    {
      title: "Agendamentos",
      icon: <Calendar className="h-5 w-5" />,
      path: "/agendamentos",
      onClick: () => handleNavigate("/agendamentos"),
      show: true
    },
    {
      title: "Histórico",
      icon: <Clock className="h-5 w-5" />,
      path: "/historico",
      onClick: () => handleNavigate("/historico"),
      show: true
    },
    {
      title: "Usuários",
      icon: <Users className="h-5 w-5" />,
      path: "/usuarios",
      onClick: () => handleNavigate("/usuarios"),
      show: isAdmin
    },
    {
      title: "Relatórios",
      icon: <BarChart3 className="h-5 w-5" />,
      path: "/relatorios",
      onClick: () => handleNavigate("/relatorios"),
      show: isAdmin
    },
    {
      title: "Ajuda",
      icon: <HelpCircle className="h-5 w-5" />,
      path: "/ajuda",
      onClick: () => handleNavigate("/ajuda"),
      show: true
    },
    {
      title: "Configurações",
      icon: <Settings className="h-5 w-5" />,
      path: "/configuracoes",
      onClick: () => handleNavigate("/configuracoes"),
      show: true
    }
  ];

  const filteredItems = sidebarItems.filter(item => item.show);

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background border-r",
        isMobile ? "fixed inset-y-0 left-0 z-50 w-72 shadow-lg transform transition-transform duration-200 ease-in-out",
        !isOpen && isMobile ? "-translate-x-full" : "translate-x-0",
        className
      )}
    >
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2">
          <Scissors className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">MelhorCorte</span>
        </div>
      </div>

      <ScrollArea className="flex-1 py-2">
        <div className="space-y-1 px-3">
          {filteredItems.map((item, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      isActive(item.path) ? "bg-secondary" : ""
                    )}
                    onClick={item.onClick}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                    {isActive(item.path) && (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-auto p-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">Tema</span>
          <ThemeToggle variant="outline" size="sm" />
        </div>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}

export function MobileSidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick} className="md:hidden">
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}
