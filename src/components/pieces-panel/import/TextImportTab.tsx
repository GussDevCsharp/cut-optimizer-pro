
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileText, Upload } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Piece } from '../../../hooks/useSheetData';
import { ErrorMessage } from './ErrorMessage';
import { getRandomColor } from '../../../utils/colorUtils';

interface TextImportTabProps {
  onImportSuccess: (pieces: Piece[]) => void;
}

export const TextImportTab = ({ onImportSuccess }: TextImportTabProps) => {
  const [textContent, setTextContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [textFile, setTextFile] = useState<File | null>(null);

  const processTextContent = (content: string) => {
    if (!content.trim()) {
      setError('Nenhum texto inserido');
      return;
    }

    try {
      const lines = content.trim().split('\n');
      const importedPieces: Piece[] = [];
      
      for (const line of lines) {
        if (!line.trim()) continue;
        
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
      
      onImportSuccess(importedPieces);
      setTextContent('');
      setTextFile(null);
      setError(null);
    } catch (err) {
      setError(`Erro ao processar texto: ${err instanceof Error ? err.message : 'Formato inválido'}`);
    }
  };

  const handleSubmit = () => {
    processTextContent(textContent);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setTextFile(file);
    setError(null);
    
    try {
      const text = await file.text();
      setTextContent(text);
    } catch (err) {
      setError(`Erro ao ler arquivo: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium">Texto</span>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Ou importe de um arquivo:</span>
          <Input 
            type="file" 
            accept=".txt" 
            className="max-w-xs"
            onChange={handleFileUpload} 
          />
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
      </div>
      
      <p className="text-xs text-muted-foreground">
        Formatos aceitos por linha:
        <br />• 100x200 (3) - largura x altura (quantidade)
        <br />• 100 200 3 - largura altura quantidade
      </p>
      <ErrorMessage error={error} />
      <Button onClick={handleSubmit}>Importar do Texto</Button>
    </div>
  );
};
