
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Briefcase, Package, BookOpen, Settings, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateUserManual } from "@/utils/userManual";
import { useToast } from "@/hooks/use-toast";

// Dashboard components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectsTabContent } from "@/components/dashboard/ProjectsTabContent";
import { MaterialsTabContent } from "@/components/dashboard/MaterialsTabContent";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserDropdownMenu } from "@/components/header/UserDropdownMenu";
import { UserManagementPanel } from "@/components/settings/UserManagementPanel";
import { EmailSettings } from "@/components/settings/EmailSettings";
import { MasterPanelManual } from "@/components/settings/MasterPanelManual";
import { MercadoPagoSettings } from "@/components/settings/MercadoPagoSettings";

export default function Dashboard() {
  const { user, logout, isMasterAdmin } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("projects");
  const { toast } = useToast();

  // Listen for tab change events
  useEffect(() => {
    const handleSetTab = (event: any) => {
      if (event.detail && event.detail.tab) {
        setActiveTab(event.detail.tab);
      }
    };
    
    window.addEventListener('dashboard-set-tab', handleSetTab);
    
    return () => {
      window.removeEventListener('dashboard-set-tab', handleSetTab);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDownloadManual = async () => {
    try {
      toast({
        title: "Gerando manual do usuário",
        description: "Aguarde enquanto geramos o manual em PDF.",
      });
      
      await generateUserManual();
      
      toast({
        title: "Manual gerado com sucesso!",
        description: "O download do manual deve começar automaticamente.",
      });
    } catch (error) {
      console.error("Error generating user manual:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar manual",
        description: "Não foi possível gerar o manual do usuário. Tente novamente.",
      });
    }
  };

  return (
    <Layout>
      <div className={`${isMobile ? 'px-2 py-2' : 'container mx-auto p-4'}`}>
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div>
            <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>
              Bem-vindo, {user?.name || "Usuário"}
              {isMasterAdmin && <span className="ml-2 text-sm text-primary">(Admin Master)</span>}
            </h1>
            <p className="text-muted-foreground text-sm">Gerencie seus projetos</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={handleDownloadManual}
            >
              <BookOpen className="h-4 w-4" />
              <span className={isMobile ? "hidden" : "inline"}>Manual do Usuário</span>
            </Button>
            
            {!isMobile && (
              <div className="flex items-center gap-2">
                <ThemeToggle 
                  size="sm" 
                  variant="ghost" 
                  showTooltip={true}
                  className="bg-transparent hover:bg-accent/60"
                />
                <UserDropdownMenu 
                  isInstallable={false} // No install option on dashboard
                  onInstall={() => {}} 
                  onOpenSettings={() => setActiveTab("settings")} 
                  onLogout={handleLogout} 
                />
              </div>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className={`grid w-full ${isMasterAdmin ? 'grid-cols-4' : 'grid-cols-2'} mb-4`}>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Projetos</span>
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Materiais</span>
            </TabsTrigger>
            {isMasterAdmin && (
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Configurações</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Manual</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="space-y-4">
            <ProjectsTabContent 
              userId={user?.id} 
              isActiveTab={activeTab === "projects"}
            />
          </TabsContent>
          
          <TabsContent value="materials" className="space-y-4">
            <MaterialsTabContent 
              userId={user?.id} 
              isActiveTab={activeTab === "materials"}
            />
          </TabsContent>
          
          {isMasterAdmin && (
            <TabsContent value="settings" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Configurações do Sistema</h2>
                <Tabs defaultValue="email" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="users">Usuários</TabsTrigger>
                    <TabsTrigger value="mercado-pago">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Mercado Pago
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="email">
                    <EmailSettings />
                  </TabsContent>
                  
                  <TabsContent value="users">
                    <UserManagementPanel />
                  </TabsContent>
                  
                  <TabsContent value="mercado-pago">
                    <MercadoPagoSettings />
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>
          )}
          
          <TabsContent value="manual" className="space-y-4">
            <MasterPanelManual />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
