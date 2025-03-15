
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileSpreadsheet, Download } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Piece } from '../../../hooks/useSheetData';
import { ErrorMessage } from './ErrorMessage';
import { getRandomColor } from '../../../utils/colorUtils';

interface ExcelImportTabProps {
  onImportSuccess: (pieces: Piece[]) => void;
}

export const ExcelImportTab = ({ onImportSuccess }: ExcelImportTabProps) => {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processExcelFile = async () => {
    if (!excelFile) {
      setError('Nenhum arquivo selecionado');
      return;
    }

    try {
      const buffer = await excelFile.arrayBuffer();
      
      if (!window.XLSX) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load XLSX library'));
          document.head.appendChild(script);
        });
      }
      
      const workbook = window.XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = window.XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
      
      if (data.length === 0) {
        setError('Planilha vazia');
        return;
      }
      
      const importedPieces: Piece[] = [];
      const headers = findHeaderRow(data);
      const columnIndexes = getColumnIndexes(headers);
      
      if (!columnIndexes.width || !columnIndexes.height) {
        setError('Colunas de largura e altura não encontradas na planilha');
        return;
      }
      
      // Start processing from the row after the headers
      const startRow = headers.rowIndex + 1;
      
      for (let i = startRow; i < data.length; i++) {
        const row: any[] = data[i];
        
        // Skip empty rows
        if (row.every(cell => !cell)) continue;
        
        const width = parseNumberFromCell(row[columnIndexes.width]);
        const height = parseNumberFromCell(row[columnIndexes.height]);
        const quantity = columnIndexes.quantity !== undefined 
          ? parseNumberFromCell(row[columnIndexes.quantity]) || 1 
          : 1;
        
        const canRotate = columnIndexes.canRotate !== undefined
          ? Boolean(row[columnIndexes.canRotate])
          : true;
        
        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
          console.warn(`Ignorando linha ${i + 1}: dados de dimensão inválidos`);
          continue;
        }
        
        // Create individual pieces based on quantity
        for (let q = 0; q < quantity; q++) {
          importedPieces.push({
            id: uuidv4(),
            width,
            height,
            quantity: 1, // Each piece now has quantity 1
            canRotate,
            color: getRandomColor()
          });
        }
      }
      
      if (importedPieces.length === 0) {
        setError('Nenhuma peça válida encontrada na planilha');
        return;
      }
      
      onImportSuccess(importedPieces);
      setExcelFile(null);
      setError(null);
    } catch (err) {
      setError(`Erro ao processar arquivo: ${err instanceof Error ? err.message : 'Formato inválido'}`);
      console.error(err);
    }
  };

  // Helper functions for parsing Excel data
  const findHeaderRow = (data: any[][]): { rowIndex: number, headers: string[] } => {
    // Look for a row that might contain headers
    for (let i = 0; i < Math.min(10, data.length); i++) {
      const row = data[i];
      const potentialHeaders = row.map(String).map(h => h.toLowerCase());
      
      // Check if this row contains any of our expected header keywords
      if (potentialHeaders.some(h => 
        h.includes('larg') || h.includes('width') || 
        h.includes('alt') || h.includes('height') ||
        h.includes('quant')
      )) {
        return { rowIndex: i, headers: row.map(String) };
      }
    }
    
    // If no header row found, assume the first row is headers
    return { rowIndex: 0, headers: data[0].map(String) };
  };
  
  const getColumnIndexes = (headerInfo: { headers: string[] }) => {
    const result: { width?: number, height?: number, quantity?: number, canRotate?: number } = {};
    
    headerInfo.headers.forEach((header, index) => {
      const headerLower = String(header).toLowerCase();
      
      if (headerLower.includes('larg') || headerLower.includes('width')) {
        result.width = index;
      }
      else if (headerLower.includes('alt') || headerLower.includes('height')) {
        result.height = index;
      }
      else if (headerLower.includes('quant')) {
        result.quantity = index;
      }
      else if (headerLower.includes('rot')) {
        result.canRotate = index;
      }
    });
    
    return result;
  };
  
  const parseNumberFromCell = (cell: any): number => {
    if (cell === undefined || cell === null || cell === '') return NaN;
    
    if (typeof cell === 'number') {
      return cell;
    }
    
    // Try to extract a number from a string
    const numberMatch = String(cell).match(/(\d+(\.\d+)?)/);
    return numberMatch ? parseFloat(numberMatch[1]) : NaN;
  };

  const downloadExampleFile = () => {
    try {
      if (!window.XLSX) {
        // Load XLSX if not already loaded
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
        script.onload = createAndDownloadExample;
        document.head.appendChild(script);
      } else {
        createAndDownloadExample();
      }
    } catch (err) {
      setError(`Erro ao gerar exemplo: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  };

  const createAndDownloadExample = () => {
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium">Arquivo Excel</span>
      </div>
      <Input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => {
          setExcelFile(e.target.files?.[0] || null);
          setError(null);
        }}
      />
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2" 
        onClick={downloadExampleFile}
      >
        <Download className="h-4 w-4" />
        Baixar exemplo
      </Button>
      <p className="text-xs text-muted-foreground">
        O arquivo deve conter colunas com: largura, altura e quantidade (opcional)
      </p>
      <ErrorMessage error={error} />
      <Button onClick={processExcelFile}>Importar do Excel</Button>
    </div>
  );
};
