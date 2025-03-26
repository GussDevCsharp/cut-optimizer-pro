
import { OptimizationCallbacks } from '../types/sheetTypes';

export const startOptimizationProcess = (
  optimizationTimeLimit: number,
  setIsOptimizing: (value: boolean) => void,
  setOptimizationProgress: (value: number) => void,
  callbacks?: OptimizationCallbacks
) => {
  setIsOptimizing(true);
  setOptimizationProgress(0);
  
  const totalIterations = 100;
  let currentIteration = 0;
  
  const optimizationInterval = setInterval(() => {
    currentIteration++;
    
    if (callbacks?.onProgressUpdate) {
      callbacks.onProgressUpdate(currentIteration, totalIterations);
    }
    
    if (currentIteration >= totalIterations) {
      clearInterval(optimizationInterval);
      setIsOptimizing(false);
      setOptimizationProgress(100);
      
      if (callbacks?.onFinish) {
        callbacks.onFinish();
      }
    }
  }, optimizationTimeLimit * 10);
  
  return optimizationInterval;
};

export const stopOptimizationProcess = async (): Promise<void> => {
  // Implementation for stopping optimization
  return Promise.resolve();
};

export const updateSheetDataInStorage = async (sheetId: string, data: any): Promise<void> => {
  localStorage.setItem(`sheetData-${sheetId}`, JSON.stringify(data));
  return Promise.resolve();
};
