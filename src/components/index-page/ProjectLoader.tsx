
import { useEffect } from 'react';
import { useSheetData } from '@/hooks/useSheetData';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useProjectActions } from '@/hooks/useProjectActions';

export function ProjectLoader() {
  const { loadProject, isLoading } = useProjectActions();
  const { setProjectName, setSheet, addPiece, setPieces, setPlacedPieces } = useSheetData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('projectId');

  useEffect(() => {
    // Check if there's drawing project data in localStorage
    const drawingProjectData = localStorage.getItem('drawing-project-data');
    
    if (drawingProjectData) {
      try {
        const projectData = JSON.parse(drawingProjectData);
        
        // Set project name
        setProjectName('Novo Projeto de Desenho');
        
        // Set sheet data
        if (projectData.sheet) {
          setSheet(projectData.sheet);
        }
        
        // Set pieces
        if (projectData.pieces && Array.isArray(projectData.pieces)) {
          setPieces(projectData.pieces);
          
          // Also add each piece individually to ensure IDs are handled correctly
          projectData.pieces.forEach((piece: any) => {
            addPiece(piece);
          });
        }
        
        // Set placed pieces if available
        if (projectData.placedPieces && Array.isArray(projectData.placedPieces)) {
          setPlacedPieces(projectData.placedPieces);
        }
        
        toast.success('Projeto carregado do desenho', {
          description: `${projectData.pieces.length} tipos de peças foram importados`
        });
        
        // Remove the data from localStorage
        localStorage.removeItem('drawing-project-data');
        
        return; // Exit early, no need to load from projectId
      } catch (error) {
        console.error('Error loading drawing project data:', error);
        localStorage.removeItem('drawing-project-data');
      }
    }
    
    // If no drawing data, proceed with regular project loading
    if (projectId) {
      const loadProjectData = async () => {
        const project = await loadProject(projectId);
        
        if (project && project.description) {
          // Set project name
          setProjectName(project.name);
          
          // Set sheet data if available
          if (project.description.sheet) {
            setSheet(project.description.sheet);
          }
          
          // Set pieces if available
          if (project.description.pieces && Array.isArray(project.description.pieces)) {
            setPieces(project.description.pieces);
          }
          
          // Set placed pieces if available
          if (project.description.placedPieces && Array.isArray(project.description.placedPieces)) {
            setPlacedPieces(project.description.placedPieces);
          }
          
          // Update URL state to include projectId
          navigate('?projectId=' + projectId, { replace: true });
        }
      };
      
      loadProjectData();
    }
  }, [projectId, loadProject, navigate, setProjectName, setSheet, setPieces, setPlacedPieces, addPiece]);

  return null;
}
