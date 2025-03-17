
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { materialService } from '@/services/material';
import { useToast } from '@/hooks/use-toast';
import type { Material, MaterialFormValues } from '@/types/material';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Schema for form validation
const formSchema = z.object({
  description: z.string().min(2, 'Description must be at least 2 characters'),
  thickness: z.coerce.number().positive('Thickness must be positive'),
  width: z.coerce.number().positive('Width must be positive'),
  height: z.coerce.number().positive('Height must be positive'),
});

interface MaterialFormProps {
  material?: Material;
  onSuccess: () => void;
}

export function MaterialForm({ material, onSuccess }: MaterialFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prepare default values for the form
  const defaultValues: MaterialFormValues = {
    description: material?.description || '',
    thickness: material?.thickness || 15,
    width: material?.width || 2750,
    height: material?.height || 1830,
  };

  // Initialize the form with react-hook-form
  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: MaterialFormValues) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication error',
        description: 'You must be logged in to save materials',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // If material exists, update it; otherwise, create a new one
      const response = material
        ? await materialService.updateMaterial(material.id, data)
        : await materialService.createMaterial({ ...data, user_id: user.id });

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: material ? 'Material updated' : 'Material created',
        description: 'Your material has been saved successfully.',
      });

      onSuccess();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to save material',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="MDF 15mm Branco" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="thickness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Espessura (mm)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Largura (mm)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Altura (mm)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSuccess()}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⚪</span>
                Salvando...
              </>
            ) : material ? (
              'Atualizar'
            ) : (
              'Salvar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
