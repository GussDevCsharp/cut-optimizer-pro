
import { useEffect, useRef } from 'react';
import { setupCanvas } from '../utils/drawingUtils';

export function useCanvasSetup(activeColor: string) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Make the canvas responsive
    const resizeCanvas = () => {
      const ctx = setupCanvas(canvas);
      if (ctx) {
        ctx.strokeStyle = activeColor;
        contextRef.current = ctx;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Update stroke style when color changes
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = activeColor;
    }
  }, [activeColor]);

  return { canvasRef, contextRef };
}
