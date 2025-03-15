
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSheetData } from '@/hooks/useSheetData';
import { useProjectActions } from '@/hooks/useProjectActions';

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
          setLoading(false);
        }
      } else if (location.state?.projectName) {
        // If no project ID but we have a name, just set the name
        setProjectName(location.state.projectName);
      }
    };
    
    fetchProjectData();
  }, [location.state, setProjectName, loadProject, setPlacedPieces, setSheet, setPieces]);

  // Simply render children once loading is complete
  return <>{children}</>;
};

export default ProjectLoader;
