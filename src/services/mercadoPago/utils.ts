// Utility functions for Mercado Pago integration
import { ProductInfo as MPProductInfo } from './types';
import { ProductInfo as CheckoutProductInfo } from '@/components/checkout/CheckoutModal';

// Format CPF as user types (e.g. 123.456.789-00)
export const formatCPF = (value: string): string => {
  const v = value.replace(/\D/g, '');
  if (v.length <= 3) return v;
  if (v.length <= 6) return v.replace(/^(\d{3})(\d+)$/, '$1.$2');
  if (v.length <= 9) return v.replace(/^(\d{3})(\d{3})(\d+)$/, '$1.$2.$3');
  return v.replace(/^(\d{3})(\d{3})(\d{3})(\d+)$/, '$1.$2.$3-$4').substring(0, 14);
};

// Validate CPF
export const validateCPF = (cpf: string): boolean => {
  const cleanCpf = cpf.replace(/\D/g, '');
  if (cleanCpf.length !== 11 || /^(\d)\1{10}$/.test(cleanCpf)) return false;
  
  // Here would be actual CPF validation algorithm
  // Simplified for this example
  return cleanCpf.length === 11;
};

// Format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Convert from CheckoutModal.ProductInfo to MercadoPago.ProductInfo
export const convertToMPProductInfo = (product: any): MPProductInfo => {
  // Enhanced conversion ensuring all required fields are present
  return {
    id: product.id,
    title: product.name || product.title || '',
    description: product.description || '',
    unit_price: product.price || product.unit_price || 0,
    quantity: product.quantity || 1,
    currency_id: product.currency_id || 'BRL',
    // Keep original fields for backward compatibility
    name: product.name || product.title || '',
    price: product.price || product.unit_price || 0,
    image: product.image
  };
};
