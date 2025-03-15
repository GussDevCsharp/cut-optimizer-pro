import { Sheet, PlacedPiece } from '../../hooks/useSheetData';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PrinterServiceProps {
  sheet: Sheet;
  placedPieces: PlacedPiece[];
  sheetCount: number;
  sheets: number[];
  projectName: string;
}

export const usePrinterService = ({ sheet, placedPieces, sheetCount, sheets, projectName }: PrinterServiceProps) => {
  const { toast } = useToast();

  const generateHtmlContent = () => {
    return `
      <html>
        <head>
          <title>Plano de Corte - ${projectName || 'Sem nome'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .print-header { margin-bottom: 20px; }
            .print-header h1 { margin: 0 0 10px 0; }
            .print-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
            .print-info-item { display: flex; justify-content: space-between; }
            .print-info-label { color: #666; }
            .print-info-value { font-weight: bold; }
            .sheet-container { 
              border: 1px solid #ccc; 
              margin-bottom: 40px; 
              position: relative; 
              page-break-after: always; 
              box-sizing: border-box;
            }
            .sheet-page {
              page-break-after: always;
              padding-bottom: 30px;
            }
            .sheet-page:last-child {
              page-break-after: avoid;
            }
            .sheet-title { font-weight: bold; margin-bottom: 10px; }
            .piece { position: absolute; border: 1px solid rgba(0,0,0,0.2); display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 12px; box-sizing: border-box; overflow: hidden; }
            .dimension-width { position: absolute; bottom: 2px; width: 100%; text-align: center; font-size: 10px; }
            .dimension-height { position: absolute; left: 2px; height: 100%; writing-mode: vertical-lr; transform: rotate(180deg); display: flex; align-items: center; font-size: 10px; }
            @media print {
              @page { margin: 0.5cm; }
              body { margin: 1cm; }
              .sheet-page { page-break-after: always; }
              .sheet-page:last-child { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Plano de Corte${projectName ? ': ' + projectName : ''}</h1>
            <div>Data: ${new Date().toLocaleDateString()}</div>
          </div>
          
          <div class="print-info">
            <div class="print-info-item">
              <span class="print-info-label">Dimensões da chapa:</span>
              <span class="print-info-value">${sheet.width}×${sheet.height}mm</span>
            </div>
            <div class="print-info-item">
              <span class="print-info-label">Total de peças:</span>
              <span class="print-info-value">${placedPieces.length}</span>
            </div>
            <div class="print-info-item">
              <span class="print-info-label">Número de chapas:</span>
              <span class="print-info-value">${sheetCount}</span>
            </div>
            <div class="print-info-item">
              <span class="print-info-label">Largura de corte:</span>
              <span class="print-info-value">${sheet.cutWidth}mm</span>
            </div>
          </div>
          
          <script>
            function calculateScale() {
              // Get available print area (accounting for margins)
              const availableWidth = window.innerWidth - 80; // 40px margin on each side
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
                  
                  const dimensionElements = piece.querySelectorAll('.dimension-width, .dimension-height');
                  dimensionElements.forEach(el => {
                    el.style.fontSize = fontSize + 'px';
                  });
                });
              });
            }
            
            // Apply scaling when the page loads and when window is resized
            window.addEventListener('load', applyScale);
            window.addEventListener('resize', applyScale);
          </script>
          
          ${sheets.map(sheetIndex => {
            const sheetPieces = placedPieces.filter(p => p.sheetIndex === sheetIndex);
            return `
              <div class="sheet-page">
                <div class="sheet-title">Chapa ${sheetIndex + 1}</div>
                <div class="sheet-container">
                  ${sheetPieces.map((piece) => `
                    <div class="piece" 
                      data-x="${piece.x}"
                      data-y="${piece.y}"
                      data-width="${piece.width}"
                      data-height="${piece.height}"
                      style="
                        left: ${piece.x}px; 
                        top: ${piece.y}px; 
                        width: ${piece.width}px; 
                        height: ${piece.height}px; 
                        background-color: ${piece.color}; 
                        transform: rotate(${piece.rotated ? '90deg' : '0deg'});
                        transform-origin: center;
                      "
                    >
                      <span class="dimension-width">${piece.width}</span>
                      <span class="dimension-height">${piece.height}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </body>
      </html>
    `;
  };

  const generatePdf = async (): Promise<Blob> => {
    // Create a temporary container for the HTML content
    const container = document.createElement('div');
    container.innerHTML = generateHtmlContent();
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);
    
    // Wait for images/fonts to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create PDF document with A4 size
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    try {
      // Get all sheet pages
      const sheetPages = container.querySelectorAll('.sheet-page');
      
      // Process each sheet page
      for (let i = 0; i < sheetPages.length; i++) {
        const page = sheetPages[i] as HTMLElement;
        
        // Use html2canvas to render each page
        const canvas = await html2canvas(page, {
          scale: 2, // Higher resolution
          logging: false,
          useCORS: true,
          allowTaint: true
        });
        
        // Calculate the aspect ratio to fit the page
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdfWidth - 20; // 10mm margin on each side
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add new page for each sheet (except the first one)
        if (i > 0) {
          pdf.addPage();
        }
        
        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      }
      
      // Clean up
      document.body.removeChild(container);
      
      // Return as Blob for sharing
      return pdf.output('blob');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      document.body.removeChild(container);
      throw error;
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Erro",
        description: "Não foi possível abrir a janela de impressão.",
        variant: "destructive",
      });
      return;
    }
    
    printWindow.document.write(generateHtmlContent());
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      setTimeout(() => printWindow.close(), 1000);
    }, 500);
  };

  const handleSharePdf = async () => {
    toast({
      title: "Preparando arquivo",
      description: "Gerando PDF para compartilhamento...",
    });
    
    try {
      // Generate the PDF blob
      const pdfBlob = await generatePdf();
      
      // Use Web Share API for mobile
      if (navigator.share) {
        const file = new File([pdfBlob], `plano-de-corte-${projectName || 'sem-nome'}.pdf`, { 
          type: 'application/pdf' 
        });
        
        await navigator.share({
          title: `Plano de Corte ${projectName ? '- ' + projectName : ''}`,
          text: 'Confira este plano de corte',
          files: [file]
        });
        
        toast({
          title: "Compartilhado",
          description: "Seu plano de corte foi compartilhado com sucesso.",
        });
      } else {
        // Fallback for non-supporting browsers
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `plano-de-corte-${projectName || 'sem-nome'}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        
        toast({
          title: "Download iniciado",
          description: "O PDF foi gerado e está sendo baixado.",
        });
      }
    } catch (error) {
      console.error('Error sharing PDF:', error);
      toast({
        title: "Erro ao compartilhar",
        description: "Não foi possível gerar ou compartilhar o PDF.",
        variant: "destructive",
      });
    }
  };

  const handleEmailPdf = async (email: string): Promise<boolean> => {
    toast({
      title: "Preparando email",
      description: "Gerando PDF para envio...",
    });
    
    try {
      // Generate the PDF blob
      const pdfBlob = await generatePdf();
      
      // This is a mock implementation since we don't have a backend
      // In a real app, you would send the PDF to a server endpoint that would email it
      console.log(`Would email PDF to ${email}`);
      
      // This simulates the API call delay
      return new Promise((resolve) => {
        setTimeout(() => {
          // Return success for demo purposes
          resolve(true);
        }, 1500);
      });
    } catch (error) {
      console.error('Error generating PDF for email:', error);
      return false;
    }
  };

  return { 
    handlePrint,
    handleSharePdf,
    handleEmailPdf
  };
};
