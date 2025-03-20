
import React from 'react';
import { ScrapArea } from '../../utils/optimization/optimizationEngine';
import { getScrapAreaColor } from '../../utils/colorUtils';

interface ScrapAreaLabelProps {
  area: ScrapArea;
  scale: number;
  isMobile?: boolean;
  customColors?: boolean;
  showDimensions?: boolean;
}

export const ScrapAreaLabel = ({ 
  area, 
  scale, 
  isMobile, 
  customColors = true,
  showDimensions = true 
}: ScrapAreaLabelProps) => {
  // Calculate font size based on area dimensions and device
  const minDimension = Math.min(area.width, area.height) * scale;
  const fontSize = isMobile 
    ? Math.max(Math.min(minDimension / 8, 10), 6) // Smaller text on mobile
    : Math.max(Math.min(minDimension / 6, 12), 8);
  
  // Determine color index based on area properties for consistent colors
  const colorSeed = area.x + area.y + area.sheetIndex;
  
  // Get background and border colors
  const backgroundColor = customColors 
    ? getScrapAreaColor(colorSeed, 0.15)  // Light background
    : 'rgba(200,200,200,0.1)';            // Default light gray
    
  const borderColor = customColors
    ? getScrapAreaColor(colorSeed, 0.3)   // Slightly darker for border
    : 'rgba(0,0,0,0.2)';                  // Default dark gray
  
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
        border: `1px dashed ${borderColor}`,
        backgroundColor: backgroundColor,
        borderRadius: '2px',
      }}
    >
      {showDimensions && (
        <div 
          style={{ 
            fontSize: `${fontSize}px`, 
            color: 'rgba(0,0,0,0.6)', 
            fontWeight: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            background: 'rgba(255,255,255,0.8)',
            borderRadius: '3px',
            whiteSpace: 'nowrap',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          {area.width} × {area.height}
        </div>
      )}
    </div>
  );
};
