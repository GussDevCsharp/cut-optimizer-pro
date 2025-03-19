
// Re-export the optimization functions from the refactored modules
import { optimizeCutting } from './optimization/optimizationEngine';
import { ScrapPiece, PlacedPiece } from '../hooks/useSheetData';

// Export the main optimization function but wrap it for backward compatibility
export const optimizeCutting as {
  (pieces: any, sheet: any): { placedPieces: PlacedPiece[], scrapPieces: ScrapPiece[] };
};
