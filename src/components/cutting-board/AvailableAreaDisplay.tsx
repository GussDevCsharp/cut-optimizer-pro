
import React from 'react';
import { AvailableArea } from '../../utils/optimization/availableSpaceFinder';

interface AvailableAreaDisplayProps {
  area: AvailableArea;
  scale: number;
  isMobile?: boolean;
  colorIndex?: number;
}

// Create an array of distinct colors for scraps
const scrapColors = [
  'rgba(200, 255, 200, 0.2)',  // Light green
  'rgba(200, 200, 255, 0.2)',  // Light blue
  'rgba(255, 200, 200, 0.2)',  // Light red
  'rgba(255, 255, 200, 0.2)',  // Light yellow
  'rgba(255, 200, 255, 0.2)',  // Light magenta
  'rgba(200, 255, 255, 0.2)',  // Light cyan
  'rgba(235, 220, 255, 0.2)',  // Light lavender
  'rgba(255, 235, 200, 0.2)',  // Light peach
  'rgba(220, 255, 220, 0.2)',  // Pale green
  'rgba(255, 220, 220, 0.2)',  // Pale red
];

// Create matching border colors (slightly darker)
const scrapBorderColors = [
  'rgba(0, 150, 0, 0.3)',      // Green border
  'rgba(0, 0, 150, 0.3)',      // Blue border
  'rgba(150, 0, 0, 0.3)',      // Red border
  'rgba(150, 150, 0, 0.3)',    // Yellow border
  'rgba(150, 0, 150, 0.3)',    // Magenta border
  'rgba(0, 150, 150, 0.3)',    // Cyan border
  'rgba(130, 100, 180, 0.3)',  // Lavender border
  'rgba(180, 130, 80, 0.3)',   // Peach border
  'rgba(100, 180, 100, 0.3)',  // Pale green border
  'rgba(180, 100, 100, 0.3)',  // Pale red border
];

export const AvailableAreaDisplay = ({ area, scale, isMobile, colorIndex = 0 }: AvailableAreaDisplayProps) => {
  // Calculate font size based on area dimensions and device
  const minDimension = Math.min(area.width, area.height) * scale;
  const fontSize = isMobile 
    ? Math.max(Math.min(minDimension / 10, 10), 6) // Smaller text on mobile
    : Math.max(Math.min(minDimension / 8, 12), 7);
  
  // Different styling for scrap areas vs regular available areas
  const isScrap = area.isScrap === true;
  
  // Calculate area to display
  const areaSize = area.width * area.height;
  
  // Determine the color for this scrap area
  const colorIdx = colorIndex % scrapColors.length;
  const backgroundColor = isScrap ? scrapColors[colorIdx] : 'rgba(200, 200, 255, 0.05)';
  const borderColor = isScrap ? scrapBorderColors[colorIdx] : 'rgba(0,0,0,0.2)';
  
  // Determine label position based on the colorIndex to avoid overlapping
  // This will stagger the labels: top-left, top-right, bottom-left, bottom-right
  let labelPosition;
  switch (colorIndex % 4) {
    case 0:
      labelPosition = { top: '10%', left: '10%', transform: 'none' };
      break;
    case 1:
      labelPosition = { top: '10%', right: '10%', transform: 'none' };
      break;
    case 2:
      labelPosition = { bottom: '10%', left: '10%', transform: 'none' };
      break;
    case 3:
    default:
      labelPosition = { bottom: '10%', right: '10%', transform: 'none' };
  }
  
  return (
    <div
      style={{
        position: 'absolute',
        left: area.x * scale,
        top: area.y * scale,
        width: area.width * scale,
        height: area.height * scale,
        border: isScrap ? `2px dashed ${borderColor}` : '1px dashed rgba(0,0,0,0.2)',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        zIndex: 5, // Below pieces but above the sheet
        backgroundColor: backgroundColor
      }}
    >
      <div
        className="flex flex-col items-center justify-center p-1 rounded absolute"
        style={{
          backgroundColor: isScrap ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.6)',
          fontSize: `${fontSize}px`,
          color: isScrap ? 'rgba(0, 0, 0, 0.9)' : 'rgba(100, 100, 100, 0.9)',
          fontWeight: isScrap ? 600 : 500,
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          padding: '2px 4px',
          ...labelPosition,
        }}
      >
        <span>{area.width} x {area.height}</span>
        {isScrap && areaSize >= 400 && <span style={{ fontSize: `${fontSize * 0.8}px` }}>Sobra</span>}
      </div>
    </div>
  );
};
