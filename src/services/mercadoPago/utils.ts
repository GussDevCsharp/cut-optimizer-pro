
// Helper functions for validation and formatting

// Format CPF
export const formatCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Validate CPF
export const validateCPF = (cpf: string): boolean => {
  const strCPF = cpf.replace(/\D/g, '');
  if (strCPF.length !== 11) return false;
  
  // Check if all digits are the same
  if (/^(\d)\1+$/.test(strCPF)) return false;
  
  // Simple validation - in a real app you would use a more robust validation
  return true;
};

// Format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
