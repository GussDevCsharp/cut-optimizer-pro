
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileSpreadsheet } from 'lucide-react';
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
      const data = window.XLSX.utils.sheet_to_json(worksheet);
      
      if (data.length === 0) {
        setError('Planilha vazia');
        return;
      }
      
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
      
      onImportSuccess(importedPieces);
      setExcelFile(null);
      setError(null);
    } catch (err) {
      setError(`Erro ao processar arquivo: ${err instanceof Error ? err.message : 'Formato inválido'}`);
    }
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
      <p className="text-xs text-muted-foreground">
        O arquivo deve conter colunas com: largura, altura e quantidade (opcional)
      </p>
      <ErrorMessage error={error} />
      <Button onClick={processExcelFile}>Importar do Excel</Button>
    </div>
  );
};
