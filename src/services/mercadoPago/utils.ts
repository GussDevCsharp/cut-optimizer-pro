
// Helper functions for formatting and validation

// Format CPF with proper separators
export const formatCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Format card number in groups of 4 for readability
export const formatCardNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{4})(\d{4})?(\d{4})?(\d{4})?/, '$1 $2 $3 $4').trim();
};

// Basic CPF validation
export const validateCPF = (cpf: string): boolean => {
  const strCPF = cpf.replace(/\D/g, '');
  if (strCPF.length !== 11) return false;
  
  // Check if all digits are the same
  if (/^(\d)\1+$/.test(strCPF)) return false;
  
  // Simple validation - in a real app you would use a more robust validation
  return true;
};

// Calculate and return installment options
export const getInstallmentOptions = (amount: number, maxInstallments = 12) => {
  const options = [];
  
  // Calculate installments with interest
  for (let i = 1; i <= maxInstallments; i++) {
    // Apply mock interest rates
    const interestRate = i === 1 ? 0 : i <= 3 ? 0.0199 : i <= 6 ? 0.0299 : 0.0399;
    const installmentValue = i === 1 
      ? amount 
      : (amount * Math.pow(1 + interestRate, i)) / i;
    
    const totalAmount = installmentValue * i;
    
    options.push({
      installments: i,
      installmentAmount: installmentValue,
      totalAmount: totalAmount,
      interestRate: interestRate,
      label: `${i}x de ${formatCurrency(installmentValue)}${i > 1 ? ` (${formatCurrency(totalAmount)})` : ''}`
    });
  }
  
  return options;
};

// Format number as Brazilian currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
