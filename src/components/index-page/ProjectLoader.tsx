
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSheetData } from '@/hooks/useSheetData';
import { useProjectActions } from '@/hooks/useProjectActions';
import { Progress } from "@/components/ui/progress";

// Define the structure of our saved project data
interface ProjectData {
  sheet?: any;
  pieces?: any[];
  placedPieces?: any[];
}

export const ProjectLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { setProjectName, setPlacedPieces, setSheet, setPieces } = useSheetData();
  const { loadProject } = useProjectActions();
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (loading) {
      // Create a smoother loading progress animation
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          // Cap at 98% to show it's still waiting for final data
          const newProgress = prevProgress + (100 - prevProgress) * 0.1;
          return newProgress >= 98 ? 98 : newProgress;
        });
      }, 150);
      
      return () => clearInterval(interval);
    }
  }, [loading]);
  
  useEffect(() => {
    const fetchProjectData = async () => {
      // Prevent double initialization
      if (isInitialized) return;
      
      // Check if there's a projectId in the location state or URL params
      const searchParams = new URLSearchParams(window.location.search);
      const projectId = location.state?.projectId || searchParams.get('projectId');
      
      if (projectId) {
        setLoading(true);
        setProgress(0);
        try {
          const project = await loadProject(projectId);
          
          if (project) {
            // Set project name
            setProjectName(project.name);
            
            // If project has description with data, load it
            if (project.description && typeof project.description === 'object') {
              // Cast project.description to our ProjectData interface
              const projectData = project.description as ProjectData;
              
              console.log("Loaded project data:", projectData);
              
              // Load sheet dimensions if available
              if (projectData.sheet) {
                setSheet(projectData.sheet);
              }
              
              // Load pieces if available
              if (projectData.pieces && Array.isArray(projectData.pieces)) {
                // Clear existing pieces and add the saved ones
                setPieces(projectData.pieces);
                
                console.log("Loaded pieces:", projectData.pieces);
              }
              
              // Load placed pieces if available
              if (projectData.placedPieces && Array.isArray(projectData.placedPieces)) {
                setPlacedPieces(projectData.placedPieces);
                
                console.log("Loaded placed pieces:", projectData.placedPieces);
              }
              
              // Indicate that data has been loaded successfully
              setDataLoaded(true);
            }
          }
        } catch (error) {
          console.error("Error loading project data:", error);
        } finally {
          // Ensure we reach 100% before removing the loader
          setProgress(100);
          setTimeout(() => {
            setLoading(false);
            setIsInitialized(true); // Mark as initialized to prevent re-fetching
          }, 600); // Slightly longer timeout to ensure smooth transition
        }
      } else if (location.state?.projectName) {
        // If no project ID but we have a name, just set the name
        setProjectName(location.state.projectName);
        setIsInitialized(true);
      } else {
        // No project to load, mark as initialized
        setIsInitialized(true);
      }
    };
    
    fetchProjectData();
  }, [location.state, setProjectName, loadProject, setPlacedPieces, setSheet, setPieces, isInitialized]);

  // Display a loading indicator while project is being loaded
  if (loading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <div className="w-[300px] space-y-4">
          <h2 className="text-xl font-semibold text-center">Carregando projeto</h2>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">
            Aguarde enquanto carregamos os dados do seu projeto
          </p>
        </div>
      </div>
    );
  }

  // Don't render children until fully initialized
  if (!isInitialized) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <div className="w-[300px] space-y-4">
          <h2 className="text-xl font-semibold text-center">Inicializando...</h2>
          <Progress value={30} className="w-full" />
        </div>
      </div>
    );
  }

  // Render children once loading is complete
  return <>{children}</>;
};

export default ProjectLoader;
