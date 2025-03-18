
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Briefcase, Package, PenTool } from "lucide-react";

// Dashboard components
import { UserMenu } from "@/components/dashboard/UserMenu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectsTabContent } from "@/components/dashboard/ProjectsTabContent";
import { MaterialsTabContent } from "@/components/dashboard/MaterialsTabContent";
import { DrawingTabContent } from "@/components/dashboard/DrawingTabContent";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("projects");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Layout>
      <div className={`${isMobile ? 'px-2 py-2' : 'container mx-auto p-4'}`}>
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div>
            <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>Bem-vindo, {user?.name || "Usuário"}</h1>
            <p className="text-muted-foreground text-sm">Gerencie seus projetos</p>
          </div>
          
          {!isMobile && <UserMenu userName={user?.name} onLogout={handleLogout} />}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Projetos</span>
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Materiais</span>
            </TabsTrigger>
            <TabsTrigger value="drawing" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              <span>Desenho</span>
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
          
          <TabsContent value="drawing" className="space-y-4">
            <DrawingTabContent 
              userId={user?.id} 
              isActiveTab={activeTab === "drawing"}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
