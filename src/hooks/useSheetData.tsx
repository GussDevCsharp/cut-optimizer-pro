
import { useContext } from 'react';
import { SheetContext } from '../context/SheetContext';
import { 
  Piece,
  PlacedPiece,
  Sheet,
  OptimizationDirection,
  OptimizationCallbacks
} from '../types/sheetTypes';

export type { 
  Piece,
  PlacedPiece, 
  Sheet,
  OptimizationDirection,
  OptimizationCallbacks
};

export const useSheetData = () => {
  const context = useContext(SheetContext);
  if (context === undefined) {
    throw new Error('useSheetData must be used within a SheetProvider');
  }
  return context;
};

// Re-export SheetProvider for convenience
export { SheetProvider } from '../context/SheetContext';
