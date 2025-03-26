
import { useState, createContext, useContext, ReactNode } from 'react';
import { OptimizationDirection } from '../utils/optimization/optimizationEngine';

export interface Piece {
  id: string;
  width: number;
  height: number;
  quantity: number;
  canRotate: boolean;
  color?: string;
  materialId?: string;
  name: string; // Adding name property as it's used in the code
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
  materialId?: string; // Add materialId to track the selected material
}

interface OptimizationCallbacks {
  onProgressUpdate?: (iteration: number, totalIterations: number) => void;
  onFinish?: () => void;
}

interface SheetContextType {
  projectName: string;
  setProjectName: (name: string) => void;
  sheet: Sheet;
  setSheet: (sheet: Sheet) => void;
  pieces: Piece[];
  addPiece: (piece: Piece) => void;
  setPieces: (pieces: Piece[]) => void; // Add this method to set all pieces at once
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
  optimizationDirection: OptimizationDirection; // Add optimization direction
  setOptimizationDirection: (direction: OptimizationDirection) => void; // Add setter for optimization direction
  isOptimizing: boolean;
  optimizationProgress: number;
  setIsOptimizing: (value: boolean) => void;
  setOptimizationProgress: (value: number) => void;
  startOptimization: (callbacks?: OptimizationCallbacks) => void;
  stopOptimization: () => Promise<void>;
  optimizationTimeLimit: number;
  setOptimizationTimeLimit: (limit: number) => void;
  updateSheetData: (sheetId: string, data: any) => Promise<void>;
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export const SheetProvider = ({ children }: { children: ReactNode }) => {
  const [projectName, setProjectName] = useState<string>('');
  const [sheet, setSheet] = useState<Sheet>({
    width: 1220,
    height: 2440,
    cutWidth: 4,
  });
  
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [placedPieces, setPlacedPieces] = useState<PlacedPiece[]>([]);
  const [currentSheetIndex, setCurrentSheetIndex] = useState<number>(0);
  const [optimizationDirection, setOptimizationDirection] = useState<OptimizationDirection>('horizontal');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizationTimeLimit, setOptimizationTimeLimit] = useState(120); // 2 minutes default

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

  // New optimization methods
  const startOptimization = (callbacks?: OptimizationCallbacks) => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    // Simulate optimization process 
    // In a real app, this would call the actual optimization algorithm
    const totalIterations = 100;
    let currentIteration = 0;
    
    const optimizationInterval = setInterval(() => {
      currentIteration++;
      
      if (callbacks?.onProgressUpdate) {
        callbacks.onProgressUpdate(currentIteration, totalIterations);
      }
      
      if (currentIteration >= totalIterations || !isOptimizing) {
        clearInterval(optimizationInterval);
        setIsOptimizing(false);
        setOptimizationProgress(100);
        
        if (callbacks?.onFinish) {
          callbacks.onFinish();
        }
      }
    }, optimizationTimeLimit * 10); // Adjust timing based on timeout
  };

  const stopOptimization = async (): Promise<void> => {
    setIsOptimizing(false);
    return Promise.resolve();
  };

  // Method to update sheet data in database or localStorage
  const updateSheetData = async (sheetId: string, data: any): Promise<void> => {
    // Here you would typically save to a backend
    // For now, just save to localStorage
    localStorage.setItem(`sheetData-${sheetId}`, JSON.stringify(data));
    return Promise.resolve();
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

  return (
    <SheetContext.Provider
      value={{
        projectName,
        setProjectName,
        sheet,
        setSheet,
        pieces,
        setPieces,
        addPiece,
        updatePiece,
        removePiece,
        placedPieces,
        setPlacedPieces,
        stats,
        currentSheetIndex,
        setCurrentSheetIndex,
        optimizationDirection,
        setOptimizationDirection,
        isOptimizing,
        optimizationProgress,
        setIsOptimizing,
        setOptimizationProgress,
        startOptimization,
        stopOptimization,
        optimizationTimeLimit,
        setOptimizationTimeLimit,
        updateSheetData,
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
