
import { useEffect } from 'react';
import { useSheetData, Piece } from '@/hooks/useSheetData';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useProjectActions } from '@/hooks/useProjectActions';

// Define the structure of drawing project data
interface DrawingProjectData {
  sheet: {
    width: number;
    height: number;
    cutWidth: number;
    thickness?: number;
    materialName?: string;
  };
  pieces: Array<{
    id: string;
    width: number;
    height: number;
    quantity: number;
    color?: string;
    x: number;
    y: number;
    rotation?: number;
    canRotate: boolean;
  }>;
  placedPieces: Array<any>;
}

export function ProjectLoader() {
  const { loadProject, isLoading } = useProjectActions();
  const { setProjectName, setSheet, addPiece, setPieces, setPlacedPieces } = useSheetData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('projectId');

  useEffect(() => {
    // Check if there's drawing project data in localStorage
    const drawingProjectDataStr = localStorage.getItem('drawing-project-data');
    
    if (drawingProjectDataStr) {
      try {
        const projectData = JSON.parse(drawingProjectDataStr) as DrawingProjectData;
        
        // Set project name
        setProjectName('Novo Projeto de Desenho');
        
        // Set sheet data
        if (projectData.sheet) {
          setSheet({
            width: projectData.sheet.width,
            height: projectData.sheet.height,
            cutWidth: projectData.sheet.cutWidth || 4
          });
        }
        
        // Set pieces - ensure they conform to Piece type
        if (projectData.pieces && Array.isArray(projectData.pieces)) {
          // Map the pieces to ensure they match the required Piece structure
          const mappedPieces: Piece[] = projectData.pieces.map(piece => ({
            id: piece.id,
            width: piece.width,
            height: piece.height,
            quantity: piece.quantity,
            color: piece.color,
            x: piece.x,
            y: piece.y,
            canRotate: piece.canRotate
          }));
          
          setPieces(mappedPieces);
          
          // Add each piece individually to ensure IDs are handled correctly
          mappedPieces.forEach(piece => {
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
    
    // If no drawing data, proceed with regular project loading logic
    if (projectId) {
      const loadProjectData = async () => {
        try {
          const project = await loadProject(projectId);
          
          if (project && project.description) {
            try {
              // Parse project description if it's a string
              const projectDesc = typeof project.description === 'string' 
                ? JSON.parse(project.description) 
                : project.description;
              
              // Set project name
              setProjectName(project.name || 'Projeto sem nome');
              
              // Set sheet data if available
              if (projectDesc.sheet) {
                setSheet(projectDesc.sheet);
              }
              
              // Set pieces if available
              if (projectDesc.pieces && Array.isArray(projectDesc.pieces)) {
                setPieces(projectDesc.pieces);
              }
              
              // Set placed pieces if available
              if (projectDesc.placedPieces && Array.isArray(projectDesc.placedPieces)) {
                setPlacedPieces(projectDesc.placedPieces);
              }
              
              // Update URL state to include projectId
              navigate('?projectId=' + projectId, { replace: true });
              
              toast.success('Projeto carregado com sucesso', {
                description: `${project.name} foi carregado`
              });
            } catch (error) {
              console.error('Error parsing project description:', error);
              toast.error('Erro ao carregar projeto');
            }
          }
        } catch (error) {
          console.error('Error loading project:', error);
          toast.error('Erro ao carregar projeto');
        }
      };
      
      loadProjectData();
    }
  }, [projectId, loadProject, navigate, setProjectName, setSheet, setPieces, setPlacedPieces, addPiece]);

  return null;
}
