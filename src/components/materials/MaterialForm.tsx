
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { materialService } from '@/services/materialService';
import type { Material, MaterialFormValues } from '@/types/material';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';

// Validation schema for the material form
const formSchema = z.object({
  description: z.string().min(3, {
    message: 'Descrição deve ter pelo menos 3 caracteres',
  }),
  thickness: z.coerce.number().min(0.1, {
    message: 'Espessura deve ser maior que 0',
  }),
  width: z.coerce.number().min(1, {
    message: 'Largura deve ser maior que 0',
  }),
  height: z.coerce.number().min(1, {
    message: 'Altura deve ser maior que 0',
  }),
});

interface MaterialFormProps {
  material?: Material;
  onSuccess?: (material: Material) => void;
}

export function MaterialForm({ material, onSuccess }: MaterialFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Initialize form with default values or existing material data
  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: material ? {
      description: material.description,
      thickness: material.thickness,
      width: material.width,
      height: material.height,
    } : {
      description: '',
      thickness: 15, // Default MDF thickness
      width: 1220, // Default width
      height: 2440, // Default height
    },
  });

  const onSubmit = async (data: MaterialFormValues) => {
    setLoading(true);
    try {
      let response;
      
      if (material?.id) {
        // Update existing material
        response = await materialService.updateMaterial(material.id, data);
      } else {
        // Create new material
        response = await materialService.createMaterial(data);
      }
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (response.data) {
        toast({
          title: material?.id ? 'Material atualizado' : 'Material cadastrado',
          description: `${data.description} foi ${material?.id ? 'atualizado' : 'cadastrado'} com sucesso.`,
        });
        
        if (onSuccess) {
          onSuccess(response.data);
        }
        
        if (!material?.id) {
          // Reset form after successful creation
          form.reset({
            description: '',
            thickness: 15,
            width: 1220,
            height: 2440,
          });
        }
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao salvar o material.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ex: MDF Ultra Branco" 
                  {...field} 
                />
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
                  <Input
                    type="number"
                    min="0.1"
                    step="0.1"
                    {...field}
                  />
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
                  <Input
                    type="number"
                    min="1"
                    {...field}
                  />
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
                  <Input
                    type="number"
                    min="1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" disabled={loading} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          {loading ? 'Salvando...' : (material?.id ? 'Atualizar' : 'Cadastrar')} Material
        </Button>
      </form>
    </Form>
  );
}
