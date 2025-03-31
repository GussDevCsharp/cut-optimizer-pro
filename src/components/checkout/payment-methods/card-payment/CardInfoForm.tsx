
import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { getInstallmentOptions } from "@/services/mercadoPagoService";

interface CardInfoFormProps {
  cardNumber: string;
  cardholderName: string;
  expirationMonth: string;
  expirationYear: string;
  securityCode: string;
  installments: string;
  onCardNumberChange: (value: string) => void;
  onCardholderNameChange: (value: string) => void;
  onExpirationMonthChange: (value: string) => void;
  onExpirationYearChange: (value: string) => void;
  onSecurityCodeChange: (value: string) => void;
  onInstallmentsChange: (value: string) => void;
  errors: Record<string, string>;
  isLoading: boolean;
  productPrice: number;
}

const CardInfoForm: React.FC<CardInfoFormProps> = ({
  cardNumber,
  cardholderName,
  expirationMonth,
  expirationYear,
  securityCode,
  installments,
  onCardNumberChange,
  onCardholderNameChange,
  onExpirationMonthChange,
  onExpirationYearChange,
  onSecurityCodeChange,
  onInstallmentsChange,
  errors,
  isLoading,
  productPrice
}) => {
  const [installmentOptions, setInstallmentOptions] = useState<any[]>([]);

  // Generate installment options when component mounts
  useEffect(() => {
    const options = getInstallmentOptions(productPrice);
    setInstallmentOptions(options);
  }, [productPrice]);

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Dados do cartão</h4>
      
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Número do cartão</Label>
        <Input
          id="cardNumber"
          value={cardNumber}
          onChange={(e) => onCardNumberChange(e.target.value)}
          placeholder="0000 0000 0000 0000"
          maxLength={19} // 16 digits + 3 spaces
          disabled={isLoading}
        />
        {errors.cardNumber && <p className="text-xs text-destructive">{errors.cardNumber}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cardholderName">Nome no cartão</Label>
        <Input
          id="cardholderName"
          value={cardholderName}
          onChange={(e) => onCardholderNameChange(e.target.value.toUpperCase())}
          placeholder="NOME COMO ESTÁ NO CARTÃO"
          disabled={isLoading}
        />
        {errors.cardholderName && <p className="text-xs text-destructive">{errors.cardholderName}</p>}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiration">Validade</Label>
          <div className="grid grid-cols-2 gap-2">
            <Select 
              value={expirationMonth} 
              onValueChange={onExpirationMonthChange}
              disabled={isLoading}
            >
              <SelectTrigger id="expiration-month">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => {
                  const month = (i + 1).toString().padStart(2, '0');
                  return (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Select 
              value={expirationYear} 
              onValueChange={onExpirationYearChange}
              disabled={isLoading}
            >
              <SelectTrigger id="expiration-year">
                <SelectValue placeholder="AA" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = (new Date().getFullYear() + i).toString().substring(2);
                  return (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          {errors.expiration && <p className="text-xs text-destructive">{errors.expiration}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="securityCode">Código de segurança</Label>
          <Input
            id="securityCode"
            value={securityCode}
            onChange={(e) => onSecurityCodeChange(e.target.value.replace(/\D/g, '').substring(0, 4))}
            placeholder="CVV"
            maxLength={4}
            disabled={isLoading}
          />
          {errors.securityCode && <p className="text-xs text-destructive">{errors.securityCode}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="installments">Parcelas</Label>
        <Select 
          value={installments} 
          onValueChange={onInstallmentsChange}
          disabled={isLoading}
        >
          <SelectTrigger id="installments">
            <SelectValue placeholder="Selecione o número de parcelas" />
          </SelectTrigger>
          <SelectContent>
            {installmentOptions.map((option) => (
              <SelectItem key={option.installments} value={option.installments.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CardInfoForm;
