
import { useOptimization } from "../hooks/useOptimization";
import DirectionSelector from "./optimization/DirectionSelector";
import OptimizationButtons from "./optimization/OptimizationButtons";
import PiecesStatsCard from "./optimization/PiecesStatsCard";
import OptimizationLoadingDialog from './OptimizationLoadingDialog';

export const OptimizationControls = () => {
  const {
    isOptimizing,
    optimizationProgress,
    progressMessage,
    optimizationDirection,
    handleDirectionChange,
    handleOptimize,
    handleClear,
    pieces
  } = useOptimization();
  
  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Direction toggle */}
        <DirectionSelector 
          direction={optimizationDirection}
          onDirectionChange={handleDirectionChange}
        />
      
        {/* Optimization buttons */}
        <OptimizationButtons
          onOptimize={handleOptimize}
          onClear={handleClear}
          isOptimizing={isOptimizing}
          hasPieces={pieces.length > 0}
        />
        
        {/* Pieces statistics */}
        <PiecesStatsCard pieces={pieces} />
      </div>
      
      {/* Loading dialog with progress */}
      <OptimizationLoadingDialog 
        isOpen={isOptimizing} 
        progress={optimizationProgress} 
        message={progressMessage}
      />
    </>
  );
};

export default OptimizationControls;
