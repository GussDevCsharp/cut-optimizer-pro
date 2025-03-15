
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import SheetPanel from '../components/SheetPanel';
import PiecesPanel from '../components/PiecesPanel';
import CuttingBoard from '../components/CuttingBoard';
import OptimizationControls from '../components/OptimizationControls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors } from 'lucide-react';
import { ProjectNameInput } from '../components/sheet-panel/ProjectNameInput';
import { useSheetData, SheetProvider } from '../hooks/useSheetData';
import { useIsMobile } from '../hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const IndexContent = () => {
  const location = useLocation();
  const { setProjectName } = useSheetData();
  const isMobile = useIsMobile();
  
  // Get project name from location state (if available)
  useEffect(() => {
    if (location.state?.projectName) {
      setProjectName(location.state.projectName);
    }
  }, [location.state, setProjectName]);

  return (
    <>
      {/* Desktop Layout */}
      {!isMobile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Controls in the order: Project Name, Chapa, Peças, Melhor Corte */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="animate-fade-in shadow-subtle border">
              <CardHeader className="pb-2">
                <CardTitle>Projeto</CardTitle>
                <CardDescription>
                  Identifique seu projeto de corte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectNameInput />
              </CardContent>
            </Card>
            <SheetPanel />
            <PiecesPanel />
            <Card className="animate-fade-in shadow-subtle border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scissors className="h-5 w-5" />
                    <CardTitle>Melhor Corte</CardTitle>
                  </div>
                </div>
                <CardDescription>
                  Otimize o corte de chapas com eficiência máxima
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OptimizationControls />
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Visualization with multiple sheets in carousel */}
          <div className="lg:col-span-2">
            <CuttingBoard />
          </div>
        </div>
      )}

      {/* Mobile Layout - Tabs UI */}
      {isMobile && (
        <div className="w-full space-y-4">
          {/* Project Name Card always visible at top */}
          <Card className="animate-fade-in shadow-subtle border">
            <CardHeader className="pb-2">
              <CardTitle>Projeto</CardTitle>
              <CardDescription>
                Identifique seu projeto de corte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectNameInput />
            </CardContent>
          </Card>

          {/* Tabs interface for mobile */}
          <Tabs defaultValue="cuttingBoard" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="cuttingBoard">Visualização</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
              <TabsTrigger value="pieces">Peças</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cuttingBoard" className="mt-4">
              <CuttingBoard />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-4 space-y-4">
              <SheetPanel />
              <Card className="animate-fade-in shadow-subtle border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scissors className="h-5 w-5" />
                      <CardTitle>Melhor Corte</CardTitle>
                    </div>
                  </div>
                  <CardDescription>
                    Otimize o corte de chapas com eficiência máxima
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OptimizationControls />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pieces" className="mt-4">
              <PiecesPanel />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

const Index = () => {
  return (
    <Layout>
      <IndexContent />
    </Layout>
  );
};

export default Index;
