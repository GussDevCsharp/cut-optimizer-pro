
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Briefcase, Package, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateUserManual } from "@/utils/userManual";
import { useToast } from "@/hooks/use-toast";

// Dashboard components
import { UserMenu } from "@/components/dashboard/UserMenu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectsTabContent } from "@/components/dashboard/ProjectsTabContent";
import { MaterialsTabContent } from "@/components/dashboard/MaterialsTabContent";
import ThemeToggle from "@/components/ThemeToggle";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("projects");
  const { toast } = useToast();

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
            <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>Bem-vindo, {user?.name || "Usuário"}</h1>
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
              <>
                <ThemeToggle />
                <UserMenu userName={user?.name} onLogout={handleLogout} />
              </>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Projetos</span>
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Materiais</span>
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
        </Tabs>
      </div>
    </Layout>
  );
}
