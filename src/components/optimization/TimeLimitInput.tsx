
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from '@/hooks/use-debounce';

interface TimeLimitInputProps {
  optimizationTimeLimit: number;
  setOptimizationTimeLimit: (value: number) => void;
}

export const TimeLimitInput: React.FC<TimeLimitInputProps> = ({
  optimizationTimeLimit,
  setOptimizationTimeLimit,
}) => {
  const { toast } = useToast();
  const [inputTimeLimit, setInputTimeLimit] = React.useState(optimizationTimeLimit.toString());
  const debouncedTimeLimit = useDebounce(inputTimeLimit, 500);

  // Update the time limit when the debounced value changes
  React.useEffect(() => {
    const newTimeLimit = parseInt(debouncedTimeLimit, 10);
    if (!isNaN(newTimeLimit) && newTimeLimit !== optimizationTimeLimit) {
      setOptimizationTimeLimit(newTimeLimit);
    }
  }, [debouncedTimeLimit, setOptimizationTimeLimit, optimizationTimeLimit]);

  const handleTimeLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setInputTimeLimit(value);
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, insira apenas números.",
      });
    }
  };

  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="time-limit">Tempo Limite (segundos)</Label>
      <Input
        type="number"
        id="time-limit"
        placeholder="Tempo Limite"
        value={inputTimeLimit}
        onChange={handleTimeLimitChange}
        className="w-32 text-right"
        min="1"
      />
    </div>
  );
};
