
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Piece } from '@/hooks/useSheetData';
import { generateId } from '@/lib/utils';
import { ImportDialog } from './ImportDialog';
import { useToast } from "@/hooks/use-toast";

interface ImportSectionProps {
  onImportPieces: (pieces: Piece[]) => void;
}

export const ImportSection: React.FC<ImportSectionProps> = ({ onImportPieces }) => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setCsvFile(file);

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          setCsvData(e.target.result.toString());
        }
      };
      reader.readAsText(file);
      setIsImportDialogOpen(true);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {
      'text/csv': ['.csv']
    }
  });

  const handleImportCSV = () => {
    if (!csvData) {
      toast({
        title: "Erro",
        description: "Nenhum dado CSV para importar.",
        variant: "destructive",
      });
      return;
    }

    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    const nameIndex = headers.findIndex(header => header.toLowerCase() === 'name');
    const widthIndex = headers.findIndex(header => header.toLowerCase() === 'width');
    const heightIndex = headers.findIndex(header => header.toLowerCase() === 'height');
    const quantityIndex = headers.findIndex(header => header.toLowerCase() === 'quantity');

    if (nameIndex === -1 || widthIndex === -1 || heightIndex === -1) {
      toast({
        title: "Erro",
        description: "O arquivo CSV deve conter colunas 'Name', 'Width' e 'Height'.",
        variant: "destructive",
      });
      return;
    }

    const newPieces: Piece[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(value => value.trim());

      if (values.length === headers.length) {
        const name = values[nameIndex] || 'Peça';
        const width = parseFloat(values[widthIndex]);
        const height = parseFloat(values[heightIndex]);
        const quantity = quantityIndex !== -1 ? parseInt(values[quantityIndex], 10) : 1;

        if (!isNaN(width) && !isNaN(height) && quantity > 0) {
          for (let j = 0; j < quantity; j++) {
            const newPiece: Piece = {
              id: generateId(),
              name,
              width,
              height,
              quantity: 1, // Individual pieces have quantity 1
              canRotate: true,
            };
            newPieces.push(newPiece);
          }
        }
      }
    }

    onImportPieces(newPieces);
    setIsImportDialogOpen(false);
    resetImportData();
  };

  const handleCancelImport = () => {
    setIsImportDialogOpen(false);
    resetImportData();
  };

  const resetImportData = () => {
    setCsvFile(null);
    setCsvData('');
  };

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Importar Peças</h2>
      <div {...getRootProps()} className="border-2 border-dashed rounded-md p-4 cursor-pointer">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-gray-500">Solte o arquivo aqui...</p>
        ) : (
          <p className="text-gray-500">Arraste e solte um arquivo CSV aqui, ou clique para selecionar um arquivo.</p>
        )}
      </div>
      <Button variant="outline" size="sm" className="mt-2" onClick={() => fileInputRef.current?.click()}>
        <Upload className="h-4 w-4 mr-2" />
        Importar CSV
        <input
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files) {
              onDrop(Array.from(e.target.files));
            }
          }}
        />
      </Button>

      <ImportDialog 
        isOpen={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onImport={handleImportCSV}
        onCancel={handleCancelImport}
      />
    </div>
  );
};
