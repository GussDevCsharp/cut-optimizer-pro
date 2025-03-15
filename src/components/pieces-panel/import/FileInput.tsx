
import { FileSpreadsheet } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface FileInputProps {
  onChange: (file: File | null) => void;
}

export const FileInput = ({ onChange }: FileInputProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium">Arquivo Excel</span>
      </div>
      <Input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
      <p className="text-xs text-muted-foreground">
        O arquivo deve conter colunas com: largura, altura e quantidade (opcional)
      </p>
    </div>
  );
};
