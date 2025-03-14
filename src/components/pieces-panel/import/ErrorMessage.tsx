
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  error: string | null;
}

export const ErrorMessage = ({ error }: ErrorMessageProps) => {
  if (!error) return null;
  
  return (
    <div className="bg-destructive/10 p-2 rounded flex items-start gap-2 text-destructive text-sm">
      <AlertCircle className="h-4 w-4 mt-0.5" />
      <span>{error}</span>
    </div>
  );
};
