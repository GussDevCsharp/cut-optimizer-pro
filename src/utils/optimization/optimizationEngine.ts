
import { Piece, PlacedPiece, Sheet } from '../../hooks/useSheetData';

// Worker instance cache
let optimizationWorker: Worker | null = null;

// Create worker on demand
const getWorker = (): Worker => {
  if (!optimizationWorker) {
    optimizationWorker = new Worker(
      new URL('./optimizationWorker.ts', import.meta.url),
      { type: 'module' }
    );
  }
  return optimizationWorker;
};

// Run the optimization algorithm in a web worker
export const optimizeCutting = (
  pieces: Piece[],
  sheet: Sheet
): Promise<PlacedPiece[]> => {
  return new Promise((resolve, reject) => {
    try {
      console.time('optimization');
      console.log("Starting optimization with", pieces.length, "piece types");
      
      const worker = getWorker();
      const messageId = Date.now().toString();
      
      // Set up event listener for worker messages
      const handleMessage = (event: MessageEvent) => {
        const { type, result, error, progress, messageId: responseId } = event.data;
        
        // Skip messages not related to this request
        if (responseId !== messageId) return;
        
        // Handle progress updates
        if (type === 'progress') {
          window.dispatchEvent(new CustomEvent('optimization-progress', {
            detail: { progress }
          }));
          return;
        }
        
        // Handle completion
        if (type === 'complete') {
          console.log("Optimization complete. Placed", result.length, "pieces");
          console.timeEnd('optimization');
          worker.removeEventListener('message', handleMessage);
          resolve(result);
          return;
        }
        
        // Handle errors
        if (type === 'error') {
          console.error("Optimization worker error:", error);
          worker.removeEventListener('message', handleMessage);
          reject(new Error(error));
          return;
        }
      };
      
      // Listen for messages from the worker
      worker.addEventListener('message', handleMessage);
      
      // Start the worker with the input data
      worker.postMessage({
        pieces,
        sheet,
        messageId
      });
      
    } catch (error) {
      console.error("Failed to start optimization worker:", error);
      reject(error);
    }
  });
};
