
import React from 'react';
import { ScrapArea } from '../../utils/optimization/optimizationEngine';

interface ScrapAreaLabelProps {
  area: ScrapArea;
  scale: number;
  isMobile?: boolean;
}

export const ScrapAreaLabel = ({ area, scale, isMobile }: ScrapAreaLabelProps) => {
  // Calculate font size based on area dimensions and device
  const minDimension = Math.min(area.width, area.height) * scale;
  const fontSize = isMobile 
    ? Math.max(Math.min(minDimension / 8, 10), 6) // Smaller text on mobile
    : Math.max(Math.min(minDimension / 6, 12), 8);
  
  return (
    <div
      style={{
        position: 'absolute',
        left: area.x * scale,
        top: area.y * scale,
        width: area.width * scale,
        height: area.height * scale,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        border: '1px dashed rgba(0,0,0,0.2)',
        backgroundColor: 'rgba(200,200,200,0.1)',
      }}
    >
      <div 
        style={{ 
          fontSize: `${fontSize}px`, 
          color: 'rgba(0,0,0,0.5)', 
          fontWeight: 500,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px',
          background: 'rgba(255,255,255,0.7)',
          borderRadius: '3px',
          whiteSpace: 'nowrap',
        }}
      >
        {area.width} × {area.height}
      </div>
    </div>
  );
};
