
import { useEffect, useRef } from 'react';
import { setupCanvas } from '../utils/drawingUtils';

export function useCanvasSetup(activeColor: string, lineWidth: number = 2) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Make the canvas responsive
    const resizeCanvas = () => {
      const ctx = setupCanvas(canvas, lineWidth);
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
  }, [lineWidth]);

  // Update stroke style when color changes
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = activeColor;
    }
  }, [activeColor]);

  // Update line width when it changes
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.lineWidth = lineWidth;
    }
  }, [lineWidth]);

  return { canvasRef, contextRef };
}
