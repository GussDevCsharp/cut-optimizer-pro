
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from 'lucide-react';

interface SheetDimensionInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  id: string;
}

export const SheetDimensionInput = ({ label, value, onChange, id }: SheetDimensionInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-r-none h-10"
          onClick={() => onChange(Math.max(1, value - 10))}
        >
          <Minus size={16} />
        </Button>
        <Input
          id={id}
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="rounded-none text-center h-10"
        />
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-l-none h-10"
          onClick={() => onChange(value + 10)}
        >
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
};
