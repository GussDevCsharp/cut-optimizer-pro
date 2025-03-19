
// Re-export the optimization functions from the refactored modules
import { optimizeCutting } from './optimization/optimizationEngine';
import { ScrapPiece, PlacedPiece } from '../hooks/useSheetData';

// Export the main optimization function but wrap it for backward compatibility
export { optimizeCutting };

// Add type annotation for the exported function to ensure compatibility
// This helps maintain the original interface for existing code
export type OptimizeCuttingFunction = (
  pieces: any, 
  sheet: any
) => { 
  placedPieces: PlacedPiece[], 
  scrapPieces: ScrapPiece[] 
};
