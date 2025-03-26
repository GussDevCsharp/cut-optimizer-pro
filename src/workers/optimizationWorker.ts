
import { Piece, Sheet, PlacedPiece } from '../hooks/useSheetData';
import { optimizeCutting, OptimizationDirection } from '../utils/optimizationAlgorithm';

// Define interfaces for worker message types
interface WorkerMessage {
  pieces: Piece[];
  sheet: Sheet;
  direction: OptimizationDirection;
}

// Progress update message type
interface ProgressMessage {
  status: 'processing';
  progress: number;
  message?: string;
}

// Success result message type
interface SuccessMessage {
  status: 'complete';
  success: true;
  placedPieces: PlacedPiece[];
  message: string;
  stats?: {
    totalPieces: number;
    placedPieces: number;
    efficiency: number;
  };
}

// Error message type
interface ErrorMessage {
  status: 'error';
  success: false;
  error: string;
  details?: any;
}

// Ready message type
interface ReadyMessage {
  status: 'ready';
}

// Union type for all outgoing message types
type WorkerResponse = ReadyMessage | ProgressMessage | SuccessMessage | ErrorMessage;

// Worker context setup
class OptimizationWorker {
  // Store optimization parameters
  private pieces: Piece[] = [];
  private sheet: Sheet | null = null;
  private direction: OptimizationDirection = 'horizontal';
  private lastProgressTime = 0;
  private startTime = 0;
  
  constructor() {
    // Setup message listener
    self.addEventListener('message', this.handleMessage.bind(this));
    
    // Signal that worker is ready
    this.sendMessage({ status: 'ready' });
  }
  
  /**
   * Handle incoming messages from the main thread
   */
  private handleMessage(event: MessageEvent<WorkerMessage>): void {
    try {
      const { pieces, sheet, direction } = event.data;
      
      // Store optimization parameters
      this.pieces = pieces;
      this.sheet = sheet;
      this.direction = direction;
      
      // Start optimization process
      this.startOptimization();
    } catch (error) {
      this.handleError('Error processing message', error);
    }
  }
  
  /**
   * Start the optimization process
   */
  private startOptimization(): void {
    if (!this.sheet) {
      this.handleError('Invalid sheet configuration', null);
      return;
    }
    
    try {
      // Initialize timing and progress tracking
      this.startTime = Date.now();
      this.lastProgressTime = this.startTime;
      
      // Notify that processing has started
      this.sendProgressUpdate(0, 'Iniciando otimização...');
      
      // Total pieces to be placed (accounting for quantity)
      const totalPiecesToPlace = this.pieces.reduce((sum, piece) => sum + piece.quantity, 0);
      
      // Execute optimization
      const result = optimizeCutting(this.pieces, this.sheet, this.direction);
      
      // Final progress update
      this.sendProgressUpdate(100, 'Finalizado!');
      
      // Calculate efficiency
      const placedCount = result.length;
      const efficiency = totalPiecesToPlace > 0 ? (placedCount / totalPiecesToPlace) * 100 : 0;
      
      // Send success message with results
      this.sendMessage({
        status: 'complete',
        success: true,
        placedPieces: result,
        message: `Otimização completa: ${result.length} peças posicionadas`,
        stats: {
          totalPieces: totalPiecesToPlace,
          placedPieces: placedCount,
          efficiency: efficiency
        }
      });
    } catch (error) {
      this.handleError('Error during optimization', error);
    }
  }
  
  /**
   * Send a progress update to the main thread
   */
  private sendProgressUpdate(progress: number, message?: string): void {
    const now = Date.now();
    
    // Only send progress updates every 100ms to reduce communication overhead
    if (now - this.lastProgressTime > 100 || progress === 0 || progress === 100) {
      this.sendMessage({
        status: 'processing',
        progress,
        message
      });
      this.lastProgressTime = now;
    }
  }
  
  /**
   * Handle errors that occur during optimization
   */
  private handleError(contextMessage: string, error: any): void {
    console.error('Optimization worker error:', contextMessage, error);
    
    // Create appropriate error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Erro desconhecido na otimização';
    
    // Send error message back to main thread
    this.sendMessage({
      status: 'error',
      success: false,
      error: `${contextMessage}: ${errorMessage}`,
      details: error instanceof Error ? {
        name: error.name,
        stack: error.stack
      } : undefined
    });
  }
  
  /**
   * Send message to the main thread
   */
  private sendMessage(message: WorkerResponse): void {
    self.postMessage(message);
  }
}

// Create and initialize the worker
new OptimizationWorker();

