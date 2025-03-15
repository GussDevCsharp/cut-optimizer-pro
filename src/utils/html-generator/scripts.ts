
export const getScriptHtml = (): string => {
  return `
    <script>
      function calculateMaxScale() {
        // We want to use the maximum available space while maintaining aspect ratio
        const contentArea = document.querySelector('.sheet-container');
        if (!contentArea) return 1;
        
        // Get the parent container's width (available width)
        const containerWidth = window.innerWidth - 40;
        
        // Calculate scale based on sheet dimensions
        const sheetWidth = ${'{sheet.width}'};
        const sheetHeight = ${'{sheet.height}'};
        
        // Calculate the aspect ratio of the sheet
        const sheetRatio = sheetWidth / sheetHeight;
        
        // Allow the sheet to be up to 95% of the available width
        const maxWidth = containerWidth * 0.95;
        
        // Calculate the height based on the aspect ratio and max width
        const expectedHeight = maxWidth / sheetRatio;
        
        // Check if the expected height fits within the available height
        // If not, we'll need to scale based on height instead
        const availableHeight = window.innerHeight - 350; // Account for header, info, etc.
        
        if (expectedHeight > availableHeight) {
          // Scale based on height
          return (availableHeight / sheetHeight);
        } else {
          // Scale based on width
          return (maxWidth / sheetWidth);
        }
      }
      
      function applyMaxScale() {
        const scale = calculateMaxScale();
        const sheetContainers = document.querySelectorAll('.sheet-container');
        
        sheetContainers.forEach(container => {
          const originalWidth = ${'{sheet.width}'};
          const originalHeight = ${'{sheet.height}'};
          
          // Scale the container to fit the available space
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
            
            // Adjust font size based on the scale but ensure it's readable
            const fontSize = Math.max(Math.min(10 * scale, 16), 6);
            piece.style.fontSize = fontSize + 'px';
            
            const dimensionElements = piece.querySelectorAll('.dimension-width, .dimension-height');
            dimensionElements.forEach(el => {
              el.style.fontSize = fontSize + 'px';
            });
          });
        });
      }
      
      // Apply scaling when the page loads and when window is resized
      window.addEventListener('load', applyMaxScale);
      window.addEventListener('resize', applyMaxScale);
      
      // Additionally trigger a resize after a brief delay to ensure everything is loaded
      setTimeout(applyMaxScale, 300);
    </script>
  `;
};
