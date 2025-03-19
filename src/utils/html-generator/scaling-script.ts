
import { Sheet } from '../../hooks/useSheetData';

export const getScalingScript = (sheet: Sheet): string => {
  return `
    function calculateScale() {
      // Get available print area (accounting for margins)
      const availableWidth = window.innerWidth - 100; // 50px margin on each side
      const availableHeight = window.innerHeight - 250; // Header + info + margins
      
      // Calculate scale to fit the sheet in the available area
      const sheetWidth = ${sheet.width};
      const sheetHeight = ${sheet.height};
      const widthScale = availableWidth / sheetWidth;
      const heightScale = availableHeight / sheetHeight;
      
      // Use the smaller scale to ensure the sheet fits entirely
      return Math.min(widthScale, heightScale, 1); // Cap at 1 to avoid enlarging small sheets
    }
    
    function applyScale() {
      const scale = calculateScale();
      const sheetContainers = document.querySelectorAll('.sheet-container');
      
      sheetContainers.forEach(container => {
        const originalWidth = ${sheet.width};
        const originalHeight = ${sheet.height};
        
        container.style.width = (originalWidth * scale) + 'px';
        container.style.height = (originalHeight * scale) + 'px';
        
        // Scale pieces within the sheet
        const pieces = container.querySelectorAll('.piece');
        pieces.forEach(piece => {
          const originalLeft = parseFloat(piece.getAttribute('data-x'));
          const originalTop = parseFloat(piece.getAttribute('data-y'));
          const originalPieceWidth = parseFloat(piece.getAttribute('data-width'));
          const originalPieceHeight = parseFloat(piece.getAttribute('data-height'));
          
          piece.style.left = (originalLeft * scale) + 'px';
          piece.style.top = (originalTop * scale) + 'px';
          piece.style.width = (originalPieceWidth * scale) + 'px';
          piece.style.height = (originalPieceHeight * scale) + 'px';
          
          // Adjust font size based on the scale
          const fontSize = Math.max(8 * scale, 6);
          piece.style.fontSize = fontSize + 'px';
          
          const dimensionElements = piece.querySelectorAll('.dimension-width, .dimension-height, .piece-label, .dimension-center');
          dimensionElements.forEach(el => {
            el.style.fontSize = fontSize + 'px';
          });
        });
      });
    }
    
    // Apply scaling when the page loads and when window is resized
    window.addEventListener('load', applyScale);
    window.addEventListener('resize', applyScale);
  `;
};
