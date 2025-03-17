
/**
 * Utilities for Excel file operations
 */

// Load XLSX library dynamically
export const loadXLSXLibrary = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (window.XLSX) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load XLSX library'));
    document.head.appendChild(script);
  });
};

// Create and download example Excel file
export const createAndDownloadExampleFile = () => {
  if (!window.XLSX) {
    throw new Error('XLSX library not loaded');
  }

  // Create sample data
  const exampleData = [
    { largura: 100, altura: 200, quantidade: 3 },
    { largura: 150, altura: 300, quantidade: 1 },
    { largura: 400, altura: 600, quantidade: 5 }
  ];

  // Create a new workbook
  const wb = window.XLSX.utils.book_new();
  const ws = window.XLSX.utils.json_to_sheet(exampleData);
  
  // Add the worksheet to the workbook
  window.XLSX.utils.book_append_sheet(wb, ws, "Peças");

  // Write the workbook and trigger a download
  window.XLSX.writeFile(wb, "exemplo_importacao_pecas.xlsx");
};
