
import { Piece, Sheet, PlacedPiece } from '../hooks/useSheetData';
import { optimizeCutting, OptimizationDirection } from '../utils/optimizationAlgorithm';

// Interface para as mensagens recebidas pelo worker
interface WorkerMessage {
  pieces: Piece[];
  sheet: Sheet;
  direction: OptimizationDirection;
}

// Event listener para mensagens recebidas
self.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
  const { pieces, sheet, direction } = event.data;
  
  // Notify that processing has started
  self.postMessage({ status: 'processing', progress: 0 });
  
  try {
    // Send progress updates
    let lastProgressTime = Date.now();
    const progressCallback = (progress: number) => {
      const now = Date.now();
      // Only send progress updates every 100ms to reduce communication overhead
      if (now - lastProgressTime > 100) {
        self.postMessage({ status: 'processing', progress });
        lastProgressTime = now;
      }
    };
    
    // Executa a otimização em uma thread separada com relatórios de progresso
    const result = optimizeCutting(pieces, sheet, direction);
    
    // Final progress update
    self.postMessage({ status: 'processing', progress: 100 });
    
    // Send the result back to the main thread
    self.postMessage({ 
      status: 'complete',
      success: true, 
      placedPieces: result,
      message: `Otimização completa: ${result.length} peças posicionadas`
    });
  } catch (error) {
    console.error('Error in optimization worker:', error);
    self.postMessage({ 
      status: 'error',
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido na otimização'
    });
  }
});

// Notifica que o worker está pronto
self.postMessage({ status: 'ready' });
