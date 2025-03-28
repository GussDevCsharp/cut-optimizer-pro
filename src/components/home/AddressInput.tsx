
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from 'react-hook-form';
import { UserFormValues } from './CTAButtonLogic';

interface AddressInputProps {
  control: Control<UserFormValues>;
}

const AddressInput: React.FC<AddressInputProps> = ({ control }) => {
  return (
    <>
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço</FormLabel>
            <FormControl>
              <Input placeholder="Seu endereço completo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default AddressInput;
