
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import SheetPanel from '../components/SheetPanel';
import PiecesPanel from '../components/PiecesPanel';
import CuttingBoard from '../components/CuttingBoard';
import OptimizationControls from '../components/OptimizationControls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors } from 'lucide-react';
import { ProjectNameInput } from '../components/sheet-panel/ProjectNameInput';
import { useSheetData, SheetProvider, PlacedPiece, Piece } from '../hooks/useSheetData';
import { useIsMobile } from '../hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectActions } from '@/hooks/useProjectActions';

const IndexContent = () => {
  const location = useLocation();
  const { setProjectName, setPlacedPieces, setSheet, placedPieces, addPiece, sheet, pieces } = useSheetData();
  const isMobile = useIsMobile();
  const { loadProject } = useProjectActions();
  const [loading, setLoading] = useState(false);
  
  // Get project info from location state (if available)
  useEffect(() => {
    const fetchProjectData = async () => {
      // Check if there's a projectId in the location state or URL params
      const searchParams = new URLSearchParams(window.location.search);
      const projectId = location.state?.projectId || searchParams.get('projectId');
      
      if (projectId) {
        setLoading(true);
        try {
          const project = await loadProject(projectId);
          
          if (project) {
            // Set project name
            setProjectName(project.name);
            
            // If project has description with data, load it
            if (project.description && typeof project.description === 'object') {
              const projectData = project.description;
              
              // Load sheet dimensions if available
              if (projectData && projectData.sheet) {
                setSheet(projectData.sheet);
              }
              
              // Load pieces if available
              if (projectData && Array.isArray(projectData.pieces)) {
                // Clear existing pieces and add the saved ones
                projectData.pieces.forEach((piece: Piece) => {
                  addPiece(piece);
                });
              }
              
              // Load placed pieces if available
              if (projectData && Array.isArray(projectData.placedPieces)) {
                setPlacedPieces(projectData.placedPieces);
              }
            }
          }
        } catch (error) {
          console.error("Error loading project data:", error);
        } finally {
          setLoading(false);
        }
      } else if (location.state?.projectName) {
        // If no project ID but we have a name, just set the name
        setProjectName(location.state.projectName);
      }
    };
    
    fetchProjectData();
  }, [location.state, setProjectName, loadProject, setPlacedPieces, setSheet, addPiece]);

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
