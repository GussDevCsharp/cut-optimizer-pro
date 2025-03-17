
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Piece } from '../../../hooks/useSheetData';
import { ErrorMessage } from './ErrorMessage';
import { TextInput } from './TextInput';
import { processTextContent, readTextFile } from '../../../utils/textImport';

interface TextImportTabProps {
  onImportSuccess: (pieces: Piece[]) => void;
}

export const TextImportTab = ({ onImportSuccess }: TextImportTabProps) => {
  const [textContent, setTextContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [textFile, setTextFile] = useState<File | null>(null);

  const clearError = () => setError(null);

  const handleSubmit = () => {
    try {
      if (!textContent.trim()) {
        setError('Nenhum texto inserido');
        return;
      }

      const { importedPieces, invalidLines } = processTextContent(textContent);
      
      if (importedPieces.length === 0) {
        setError('Nenhuma peça válida encontrada');
        return;
      }
      
      if (invalidLines.length > 0) {
        console.warn('Linhas inválidas:', invalidLines);
      }
      
      onImportSuccess(importedPieces);
      setTextContent('');
      setTextFile(null);
      setError(null);
    } catch (err) {
      setError(`Erro ao processar texto: ${err instanceof Error ? err.message : 'Formato inválido'}`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setTextFile(file);
    setError(null);
    
    try {
      const text = await readTextFile(file);
      setTextContent(text);
    } catch (err) {
      setError(`${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <TextInput 
        textContent={textContent}
        setTextContent={setTextContent}
        onFileUpload={handleFileUpload}
        clearError={clearError}
      />
      <ErrorMessage error={error} />
      <Button onClick={handleSubmit}>Importar do Texto</Button>
    </div>
  );
};

