
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSheetData } from '@/hooks/useSheetData';
import { useProjectActions } from '@/hooks/useProjectActions';
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
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
  
  useEffect(() => {
    const fetchProjectData = async () => {
      // Check if there's a projectId in the location state or URL params
      const searchParams = new URLSearchParams(window.location.search);
      const projectId = location.state?.projectId || searchParams.get('projectId');
      
      if (projectId) {
        setLoading(true);
        setProgress(10);
        try {
          const project = await loadProject(projectId);
          setProgress(40);
          
          if (project) {
            // Set project name
            setProjectName(project.name);
            setProgress(50);
            
            // If project has description with data, load it
            if (project.description && typeof project.description === 'object') {
              // Cast project.description to our ProjectData interface
              const projectData = project.description as ProjectData;
              
              console.log("Loaded project data:", projectData);
              setProgress(60);
              
              // Load sheet dimensions if available
              if (projectData.sheet) {
                setSheet(projectData.sheet);
              }
              setProgress(70);
              
              // Load pieces if available
              if (projectData.pieces && Array.isArray(projectData.pieces)) {
                // Clear existing pieces and add the saved ones
                setPieces(projectData.pieces);
                
                console.log("Loaded pieces:", projectData.pieces);
              }
              setProgress(85);
              
              // Load placed pieces if available
              if (projectData.placedPieces && Array.isArray(projectData.placedPieces)) {
                setPlacedPieces(projectData.placedPieces);
                
                console.log("Loaded placed pieces:", projectData.placedPieces);
              }
              setProgress(95);
              
              // Indicate that data has been loaded successfully
              setTimeout(() => {
                setDataLoaded(true);
                setProgress(100);
                setLoading(false);
              }, 500); // Short delay to ensure UI components have time to update
            } else {
              setDataLoaded(true);
              setLoading(false);
            }
          } else {
            setDataLoaded(true);
            setLoading(false);
          }
        } catch (error) {
          console.error("Error loading project data:", error);
          setDataLoaded(true);
          setLoading(false);
        }
      } else if (location.state?.projectName) {
        // If no project ID but we have a name, just set the name
        setProjectName(location.state.projectName);
        setDataLoaded(true);
      } else {
        // No project to load
        setDataLoaded(true);
      }
    };
    
    fetchProjectData();
  }, [location.state, setProjectName, loadProject, setPlacedPieces, setSheet, setPieces]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
        <Card className="w-full max-w-md p-6 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
          
          <Progress value={progress} className="h-2 w-full" />
          
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Simply render children once loading is complete
  return dataLoaded ? <>{children}</> : null;
};

export default ProjectLoader;
