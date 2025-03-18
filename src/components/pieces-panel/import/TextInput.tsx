
import { Textarea } from "@/components/ui/textarea";
import { FileText } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { ReactNode } from "react";

interface TextInputProps {
  textContent: string;
  setTextContent: (content: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearError: () => void;
  placeholder?: string;
  formatHint?: ReactNode;
}

export const TextInput = ({ 
  textContent, 
  setTextContent, 
  onFileUpload,
  clearError,
  placeholder = "100x200 (3)&#10;150x300&#10;400 600 5",
  formatHint
}: TextInputProps) => {
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
            onChange={onFileUpload} 
          />
        </div>
        <Textarea
          placeholder={placeholder}
          rows={6}
          value={textContent}
          onChange={(e) => {
            setTextContent(e.target.value);
            clearError();
          }}
        />
      </div>
      
      {formatHint && (
        <p className="text-xs text-muted-foreground">{formatHint}</p>
      )}
    </div>
  );
};
