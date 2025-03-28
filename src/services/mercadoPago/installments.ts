
import { formatCurrency } from './utils';

// Get available installment options
export const getInstallmentOptions = (amount: number) => {
  const minInstallmentValue = 5; // Minimum installment value in BRL
  const maxInstallments = 12;
  const options = [];
  
  // Calculate maximum number of installments based on minimum value
  const possibleInstallments = Math.min(Math.floor(amount / minInstallmentValue), maxInstallments);
  
  // Start with 1x installment (no interest)
  options.push({
    installments: 1,
    installmentAmount: amount,
    totalAmount: amount,
    label: `1x de ${formatCurrency(amount)} (sem juros)`
  });
  
  // Add installment options (simulate some interest rates)
  for (let i = 2; i <= possibleInstallments; i++) {
    // Apply interest rate for installments > 6
    const hasInterest = i > 6;
    const interestRate = hasInterest ? 0.019 * (i - 6) : 0; // 1.9% interest per month beyond 6 months
    const totalWithInterest = hasInterest ? amount * (1 + interestRate) : amount;
    const installmentAmount = totalWithInterest / i;
    
    options.push({
      installments: i,
      installmentAmount,
      totalAmount: totalWithInterest,
      label: `${i}x de ${formatCurrency(installmentAmount)}${!hasInterest ? ' (sem juros)' : ''}`
    });
  }
  
  return options;
};
