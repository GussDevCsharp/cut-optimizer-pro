import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Piece } from '../../../hooks/useSheetData';
import { ErrorMessage } from './ErrorMessage';
import { ExampleDownloader } from './ExampleDownloader';
import { FileInput } from './FileInput';
import { loadXLSXLibrary, processExcelData } from '../../../utils/excel';

interface ExcelImportTabProps {
  onImportSuccess: (pieces: Piece[]) => void;
}

export const ExcelImportTab = ({ onImportSuccess }: ExcelImportTabProps) => {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    setExcelFile(file);
    setError(null);
  };

  const processExcelFile = async () => {
    if (!excelFile) {
      setError('Nenhum arquivo selecionado');
      return;
    }

    try {
      const buffer = await excelFile.arrayBuffer();
      
      // Load XLSX library if not already loaded
      await loadXLSXLibrary();
      
      const workbook = window.XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = window.XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
      
      // Log data for debugging
      console.log('Excel data:', data);
      
      const importedPieces = processExcelData(data);
      
      if (importedPieces.length === 0) {
        setError('Nenhuma peça válida encontrada na planilha');
        return;
      }
      
      console.log(`Successfully imported ${importedPieces.length} pieces`);
      onImportSuccess(importedPieces);
      setExcelFile(null);
      setError(null);
    } catch (err) {
      console.error('Error processing Excel file:', err);
      setError(`Erro ao processar arquivo: ${err instanceof Error ? err.message : 'Formato inválido'}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <FileInput onChange={handleFileChange} />
      <ExampleDownloader />
      <ErrorMessage error={error} />
      <Button onClick={processExcelFile}>Importar do Excel</Button>
    </div>
  );
};
