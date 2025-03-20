
// Re-export the optimization functions from the refactored modules
import { optimizeCutting } from './optimization/optimizationEngine';
import { clearOptimizationCaches } from './optimization/positionUtils';

// Wrapped optimization function that clears caches before running
const runOptimization = (...args: Parameters<typeof optimizeCutting>) => {
  // Clear caches before each optimization run to prevent memory leaks and ensure fresh results
  clearOptimizationCaches();
  return optimizeCutting(...args);
};

// Export the optimized function
export { runOptimization as optimizeCutting };
