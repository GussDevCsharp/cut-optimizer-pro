
// Re-export the optimization functions from the refactored modules
import { optimizeCutting, compatibilityOptimizeCutting as originalCompatibility } from './optimization/optimizationEngine';

// Export both optimization functions
export { optimizeCutting };

// Override the compatibilityOptimizeCutting function to ensure it returns just the placed pieces array
// This maintains backward compatibility with components that expect just the array
export const compatibilityOptimizeCutting = (pieces, sheet) => {
  const result = originalCompatibility(pieces, sheet);
  return result.placedPieces;
};
