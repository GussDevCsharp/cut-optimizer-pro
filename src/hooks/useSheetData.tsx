
import { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export interface Piece {
  id: string;
  width: number;
  height: number;
  quantity: number;
  canRotate: boolean;
  color?: string;
}

export interface PlacedPiece extends Piece {
  x: number;
  y: number;
  rotated: boolean;
  sheetIndex: number; // Add sheetIndex to track which sheet the piece is on
}

export interface Sheet {
  width: number;
  height: number;
  cutWidth: number;
}

interface SheetContextType {
  projectId: string | null;
  projectName: string;
  setProjectName: (name: string) => void;
  sheet: Sheet;
  setSheet: (sheet: Sheet) => void;
  pieces: Piece[];
  addPiece: (piece: Piece) => void;
  updatePiece: (id: string, piece: Partial<Piece>) => void;
  removePiece: (id: string) => void;
  placedPieces: PlacedPiece[];
  setPlacedPieces: (pieces: PlacedPiece[]) => void;
  stats: {
    usedArea: number;
    wasteArea: number;
    efficiency: number;
    sheetCount: number; // Add sheet count to stats
  };
  currentSheetIndex: number; // Add current sheet index
  setCurrentSheetIndex: (index: number) => void; // Add setter for current sheet index
  saveProject: () => Promise<void>; // Add function to save project data
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export const SheetProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Get project ID from location state
  const projectIdFromState = location.state?.projectId;
  
  const [projectId, setProjectId] = useState<string | null>(projectIdFromState || null);
  const [projectName, setProjectName] = useState<string>(location.state?.projectName || '');
  const [sheet, setSheet] = useState<Sheet>({
    width: 1220,
    height: 2440,
    cutWidth: 4,
  });
  
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [placedPieces, setPlacedPieces] = useState<PlacedPiece[]>([]);
  const [currentSheetIndex, setCurrentSheetIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load project data from Supabase when projectId changes
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId || !isAuthenticated) return;
      
      setIsLoading(true);
      
      try {
        // Fetch project details
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
        
        if (projectError) throw projectError;
        
        if (projectData) {
          setProjectName(projectData.name);
          
          // Fetch sheet details
          const { data: sheetData, error: sheetError } = await supabase
            .from('sheets')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          if (!sheetError && sheetData) {
            setSheet({
              width: sheetData.width,
              height: sheetData.height,
              cutWidth: sheetData.cut_width,
            });
          }
          
          // Fetch pieces
          const { data: piecesData, error: piecesError } = await supabase
            .from('pieces')
            .select('*')
            .eq('project_id', projectId);
          
          if (piecesError) throw piecesError;
          
          if (piecesData) {
            setPieces(piecesData.map(piece => ({
              id: piece.id,
              width: piece.width,
              height: piece.height,
              quantity: piece.quantity,
              canRotate: piece.can_rotate,
              color: piece.color,
            })));
          }
          
          // Fetch placed pieces
          const { data: placedPiecesData, error: placedPiecesError } = await supabase
            .from('placed_pieces')
            .select(`
              id,
              project_id,
              sheet_index,
              x,
              y, 
              rotated,
              pieces (*)
            `)
            .eq('project_id', projectId);
          
          if (placedPiecesError) throw placedPiecesError;
          
          if (placedPiecesData) {
            const formattedPlacedPieces = placedPiecesData.map((item: any) => ({
              id: item.pieces.id,
              width: item.pieces.width,
              height: item.pieces.height,
              quantity: item.pieces.quantity,
              canRotate: item.pieces.can_rotate,
              color: item.pieces.color,
              x: item.x,
              y: item.y,
              rotated: item.rotated,
              sheetIndex: item.sheet_index,
            }));
            
            setPlacedPieces(formattedPlacedPieces);
            
            // Set currentSheetIndex to max sheet index if there are placed pieces
            if (formattedPlacedPieces.length > 0) {
              const maxSheetIndex = Math.max(...formattedPlacedPieces.map(p => p.sheetIndex));
              setCurrentSheetIndex(maxSheetIndex);
            }
          }
        }
      } catch (error) {
        console.error('Error loading project:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar projeto",
          description: "Não foi possível carregar os dados do projeto. Tente novamente.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProject();
  }, [projectId, isAuthenticated, toast]);

  // Create a new project when projectName changes but projectId doesn't exist
  useEffect(() => {
    const createNewProject = async () => {
      if (!projectName || projectId || !isAuthenticated || !user) return;
      
      try {
        // Create new project
        const { data: newProject, error: projectError } = await supabase
          .from('projects')
          .insert([
            { name: projectName, user_id: user.id }
          ])
          .select()
          .single();
        
        if (projectError) throw projectError;
        
        if (newProject) {
          setProjectId(newProject.id);
          toast({
            title: "Projeto criado",
            description: `O projeto "${projectName}" foi criado com sucesso.`,
          });
        }
      } catch (error) {
        console.error('Error creating project:', error);
        toast({
          variant: "destructive",
          title: "Erro ao criar projeto",
          description: "Não foi possível criar o projeto. Tente novamente.",
        });
      }
    };
    
    createNewProject();
  }, [projectName, projectId, isAuthenticated, user, toast]);

  const addPiece = (piece: Piece) => {
    setPieces([...pieces, piece]);
  };

  const updatePiece = (id: string, updatedPiece: Partial<Piece>) => {
    setPieces(pieces.map(piece => 
      piece.id === id ? { ...piece, ...updatedPiece } : piece
    ));
  };

  const removePiece = (id: string) => {
    setPieces(pieces.filter(piece => piece.id !== id));
  };

  // Save project data to Supabase
  const saveProject = async () => {
    if (!projectId || !isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Você precisa estar logado e ter um projeto ativo para salvar.",
      });
      return;
    }
    
    try {
      // Update project name
      const { error: projectError } = await supabase
        .from('projects')
        .update({ name: projectName, updated_at: new Date().toISOString() })
        .eq('id', projectId);
      
      if (projectError) throw projectError;
      
      // Update or create sheet
      const { error: sheetError } = await supabase
        .from('sheets')
        .upsert([
          {
            project_id: projectId,
            width: sheet.width,
            height: sheet.height,
            cut_width: sheet.cutWidth,
          }
        ]);
      
      if (sheetError) throw sheetError;
      
      // Save pieces - first remove existing ones then add current ones
      const { error: deletePiecesError } = await supabase
        .from('pieces')
        .delete()
        .eq('project_id', projectId);
      
      if (deletePiecesError) throw deletePiecesError;
      
      if (pieces.length > 0) {
        const piecesToInsert = pieces.map(piece => ({
          id: piece.id,
          project_id: projectId,
          width: piece.width,
          height: piece.height,
          quantity: piece.quantity,
          can_rotate: piece.canRotate,
          color: piece.color,
        }));
        
        const { error: insertPiecesError } = await supabase
          .from('pieces')
          .insert(piecesToInsert);
        
        if (insertPiecesError) throw insertPiecesError;
      }
      
      // Save placed pieces - first remove existing ones then add current ones
      const { error: deletePlacedPiecesError } = await supabase
        .from('placed_pieces')
        .delete()
        .eq('project_id', projectId);
      
      if (deletePlacedPiecesError) throw deletePlacedPiecesError;
      
      if (placedPieces.length > 0) {
        const placedPiecesToInsert = placedPieces.map(piece => ({
          id: uuidv4(),
          project_id: projectId,
          piece_id: piece.id,
          sheet_index: piece.sheetIndex,
          x: piece.x,
          y: piece.y,
          rotated: piece.rotated,
        }));
        
        const { error: insertPlacedPiecesError } = await supabase
          .from('placed_pieces')
          .insert(placedPiecesToInsert);
        
        if (insertPlacedPiecesError) throw insertPlacedPiecesError;
      }
      
      toast({
        title: "Projeto salvo",
        description: "Todas as alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar projeto",
        description: "Não foi possível salvar as alterações. Tente novamente.",
      });
    }
  };

  // Calculate the number of sheets used
  const sheetCount = placedPieces.length > 0 
    ? Math.max(...placedPieces.map(p => p.sheetIndex)) + 1 
    : 0;

  // Calculate usage statistics for the current sheet
  const currentSheetPieces = placedPieces.filter(p => p.sheetIndex === currentSheetIndex);
  const totalSheetArea = sheet.width * sheet.height;
  const usedArea = currentSheetPieces.reduce((total, piece) => {
    return total + (piece.width * piece.height);
  }, 0);
  const wasteArea = totalSheetArea - usedArea;
  const efficiency = totalSheetArea > 0 ? (usedArea / totalSheetArea) * 100 : 0;

  const stats = {
    usedArea,
    wasteArea,
    efficiency,
    sheetCount
  };

  // Show loading state if data is still loading
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <SheetContext.Provider
      value={{
        projectId,
        projectName,
        setProjectName,
        sheet,
        setSheet,
        pieces,
        addPiece,
        updatePiece,
        removePiece,
        placedPieces,
        setPlacedPieces,
        stats,
        currentSheetIndex,
        setCurrentSheetIndex,
        saveProject,
      }}
    >
      {children}
    </SheetContext.Provider>
  );
};

export const useSheetData = () => {
  const context = useContext(SheetContext);
  if (context === undefined) {
    throw new Error('useSheetData must be used within a SheetProvider');
  }
  return context;
};
