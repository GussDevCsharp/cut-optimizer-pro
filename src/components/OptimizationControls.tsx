
import React from 'react';
import { cn } from '@/lib/utils';
import { useSheetData } from '@/hooks/useSheetData';
import { TimeLimitInput } from './optimization/TimeLimitInput';
import { OptimizationProgress } from './optimization/OptimizationProgress';

interface OptimizationControlsProps {
  className?: string;
}

export const OptimizationControls: React.FC<OptimizationControlsProps> = ({ className }) => {
  const {
    startOptimization,
    stopOptimization,
    isOptimizing,
    optimizationProgress,
    setOptimizationProgress,
    optimizationTimeLimit,
    setOptimizationTimeLimit,
  } = useSheetData();

  return (
    <div className={cn("flex flex-col gap-4 p-4 border rounded-md", className)}>
      <TimeLimitInput 
        optimizationTimeLimit={optimizationTimeLimit}
        setOptimizationTimeLimit={setOptimizationTimeLimit}
      />
      
      <OptimizationProgress 
        isOptimizing={isOptimizing}
        optimizationProgress={optimizationProgress}
        startOptimization={startOptimization}
        stopOptimization={stopOptimization}
        setOptimizationProgress={setOptimizationProgress}
      />
    </div>
  );
};
