
import { createContext, ReactNode, useState } from 'react';
import { 
  Piece, 
  PlacedPiece, 
  Sheet, 
  SheetContextType, 
  OptimizationDirection,
  OptimizationCallbacks
} from '../types/sheetTypes';
import { calculateSheetStats } from '../utils/sheetStatsUtils';
import { 
  startOptimizationProcess, 
  stopOptimizationProcess, 
  updateSheetDataInStorage 
} from '../utils/sheetOptimizationUtils';

export const SheetContext = createContext<SheetContextType | undefined>(undefined);

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
  const [optimizationTimeLimit, setOptimizationTimeLimit] = useState(120);
  const [kerf, setKerf] = useState(2);
  const [grainDirection, setGrainDirection] = useState<'width' | 'height'>('width');

  const addPiece = (piece: Piece) => {
    setPieces(prevPieces => [...prevPieces, piece]);
  };

  const updatePiece = (id: string, updatedPiece: Partial<Piece>) => {
    setPieces(prevPieces => 
      prevPieces.map(piece => 
        piece.id === id ? { ...piece, ...updatedPiece } : piece
      )
    );
  };

  const removePiece = (id: string) => {
    setPieces(prevPieces => prevPieces.filter(piece => piece.id !== id));
  };

  const startOptimization = (callbacks?: OptimizationCallbacks) => {
    startOptimizationProcess(
      optimizationTimeLimit,
      setIsOptimizing,
      setOptimizationProgress,
      callbacks
    );
  };

  const stopOptimization = async (): Promise<void> => {
    setIsOptimizing(false);
    return stopOptimizationProcess();
  };

  const updateSheetData = async (sheetId: string, data: any): Promise<void> => {
    return updateSheetDataInStorage(sheetId, data);
  };

  const stats = calculateSheetStats(sheet, placedPieces, currentSheetIndex);

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
        kerf,
        setKerf,
        grainDirection,
        setGrainDirection,
      }}
    >
      {children}
    </SheetContext.Provider>
  );
};
