
import React from 'react';
import { ScrapArea } from '../../utils/optimization/optimizationEngine';

interface ScrapAreaLabelProps {
  area: ScrapArea;
  scale: number;
  isMobile?: boolean;
}

// Array of pastel colors for scrap areas
const scrapAreaColors = [
  'rgba(214, 188, 250, 0.15)', // Light purple (lilac)
  'rgba(253, 225, 211, 0.15)', // Soft peach
  'rgba(211, 228, 253, 0.15)', // Soft blue
  'rgba(242, 252, 226, 0.15)', // Soft green
  'rgba(254, 247, 205, 0.15)', // Soft yellow
  'rgba(229, 222, 255, 0.15)', // Soft purple
  'rgba(255, 222, 226, 0.15)', // Soft pink
  'rgba(254, 198, 161, 0.15)', // Soft orange
  'rgba(241, 240, 251, 0.15)', // Soft gray
];

export const ScrapAreaLabel = ({ area, scale, isMobile }: ScrapAreaLabelProps) => {
  // Calculate font size based on area dimensions and device
  const minDimension = Math.min(area.width, area.height) * scale;
  const fontSize = isMobile 
    ? Math.max(Math.min(minDimension / 8, 10), 6) // Smaller text on mobile
    : Math.max(Math.min(minDimension / 6, 12), 8);
  
  // Get a color based on the area's position to ensure consistent coloring
  const colorIndex = (area.x + area.y + area.sheetIndex) % scrapAreaColors.length;
  const backgroundColor = scrapAreaColors[colorIndex];
  
  // Determine border color - slightly darker version of the background
  const borderColor = backgroundColor.replace('0.15', '0.3');
  
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
    </div>
  );
};
