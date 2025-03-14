
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileSpreadsheet, FileText, AlertCircle } from 'lucide-react';
import { Piece } from '../../hooks/useSheetData';
import { v4 as uuidv4 } from 'uuid';

interface ImportPiecesFormProps {
  onImportPieces: (pieces: Piece[]) => void;
}

export const ImportPiecesForm = ({ onImportPieces }: ImportPiecesFormProps) => {
  const [open, setOpen] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Generate random colors for pieces
  const getRandomColor = () => {
    const colors = [
      '#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9', '#C5CAE9', 
      '#BBDEFB', '#B3E5FC', '#B2EBF2', '#B2DFDB', '#C8E6C9', 
      '#DCEDC8', '#F0F4C3', '#FFF9C4', '#FFECB3', '#FFE0B2'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const processExcelFile = async () => {
    if (!excelFile) {
      setError('Nenhum arquivo selecionado');
      return;
    }

    try {
      // Read the file as array buffer
      const buffer = await excelFile.arrayBuffer();
      
      // Import xlsx from CDN if not available
      if (!window.XLSX) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load XLSX library'));
          document.head.appendChild(script);
        });
      }
      
      // Parse the Excel file
      const workbook = window.XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = window.XLSX.utils.sheet_to_json(worksheet);
      
      if (data.length === 0) {
        setError('Planilha vazia');
        return;
      }
      
      // Map the data to pieces
      const importedPieces: Piece[] = data.map((row: any) => {
        const width = parseInt(row.width || row.Width || row.largura || row.Largura);
        const height = parseInt(row.height || row.Height || row.altura || row.Altura);
        const quantity = parseInt(row.quantity || row.Quantity || row.quantidade || row.Quantidade || 1);
        const canRotate = row.canRotate === undefined ? true : Boolean(row.canRotate);
        
        if (isNaN(width) || isNaN(height)) {
          throw new Error('Formato inválido: largura ou altura não encontradas');
        }
        
        return {
          id: uuidv4(),
          width,
          height,
          quantity: isNaN(quantity) ? 1 : quantity,
          canRotate,
          color: getRandomColor()
        };
      });
      
      onImportPieces(importedPieces);
      setOpen(false);
      setExcelFile(null);
      setError(null);
    } catch (err) {
      setError(`Erro ao processar arquivo: ${err instanceof Error ? err.message : 'Formato inválido'}`);
    }
  };

  const processTextContent = () => {
    if (!textContent.trim()) {
      setError('Nenhum texto inserido');
      return;
    }

    try {
      // Split by lines and process each line
      const lines = textContent.trim().split('\n');
      const importedPieces: Piece[] = [];
      
      for (const line of lines) {
        // Skip empty lines
        if (!line.trim()) continue;
        
        // Try to match different formats
        // Format 1: 100x200 (3)  - width x height (quantity)
        // Format 2: 100 200 3    - width height quantity
        let width, height, quantity = 1;
        
        const xMatch = line.match(/(\d+)\s*[xX]\s*(\d+)(?:\s*\((\d+)\))?/);
        if (xMatch) {
          width = parseInt(xMatch[1]);
          height = parseInt(xMatch[2]);
          quantity = xMatch[3] ? parseInt(xMatch[3]) : 1;
        } else {
          const spacesMatch = line.match(/(\d+)\s+(\d+)(?:\s+(\d+))?/);
          if (spacesMatch) {
            width = parseInt(spacesMatch[1]);
            height = parseInt(spacesMatch[2]);
            quantity = spacesMatch[3] ? parseInt(spacesMatch[3]) : 1;
          } else {
            throw new Error(`Linha mal formatada: ${line}`);
          }
        }
        
        if (width > 0 && height > 0 && quantity > 0) {
          importedPieces.push({
            id: uuidv4(),
            width,
            height,
            quantity,
            canRotate: true,
            color: getRandomColor()
          });
        }
      }
      
      if (importedPieces.length === 0) {
        setError('Nenhuma peça válida encontrada');
        return;
      }
      
      onImportPieces(importedPieces);
      setOpen(false);
      setTextContent('');
      setError(null);
    } catch (err) {
      setError(`Erro ao processar texto: ${err instanceof Error ? err.message : 'Formato inválido'}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 mb-4">
          <Upload size={16} />
          Importar Peças
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Peças</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="excel" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="excel">Excel</TabsTrigger>
            <TabsTrigger value="text">Texto</TabsTrigger>
          </TabsList>
          
          <TabsContent value="excel" className="py-4">
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
              <p className="text-xs text-muted-foreground">
                O arquivo deve conter colunas com: largura, altura e quantidade (opcional)
              </p>
              {error && (
                <div className="bg-destructive/10 p-2 rounded flex items-start gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              <Button onClick={processExcelFile}>Importar do Excel</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="text" className="py-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Texto</span>
              </div>
              <Textarea
                placeholder="100x200 (3)&#10;150x300&#10;400 600 5"
                rows={6}
                value={textContent}
                onChange={(e) => {
                  setTextContent(e.target.value);
                  setError(null);
                }}
              />
              <p className="text-xs text-muted-foreground">
                Formatos aceitos por linha:
                <br />• 100x200 (3) - largura x altura (quantidade)
                <br />• 100 200 3 - largura altura quantidade
              </p>
              {error && (
                <div className="bg-destructive/10 p-2 rounded flex items-start gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              <Button onClick={processTextContent}>Importar do Texto</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
