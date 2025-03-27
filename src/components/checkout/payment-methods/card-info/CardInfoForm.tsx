
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { formatCardNumber } from "@/services/mercadoPago";

interface CardInfoFormProps {
  cardNumber: string;
  setCardNumber: (value: string) => void;
  cardholderName: string;
  setCardholderName: (value: string) => void;
  expirationMonth: string;
  setExpirationMonth: (value: string) => void;
  expirationYear: string;
  setExpirationYear: (value: string) => void;
  securityCode: string;
  setSecurityCode: (value: string) => void;
  installments: string;
  setInstallments: (value: string) => void;
  installmentOptions: any[];
  errors: Record<string, string>;
  isLoading: boolean;
}

const CardInfoForm: React.FC<CardInfoFormProps> = ({
  cardNumber,
  setCardNumber,
  cardholderName,
  setCardholderName,
  expirationMonth,
  setExpirationMonth,
  expirationYear,
  setExpirationYear,
  securityCode,
  setSecurityCode,
  installments,
  setInstallments,
  installmentOptions,
  errors,
  isLoading
}) => {
  // Format card number as user types
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Dados do cartão</h4>
      
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Número do cartão</Label>
        <Input
          id="cardNumber"
          value={cardNumber}
          onChange={handleCardNumberChange}
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
          onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
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
              onValueChange={setExpirationMonth}
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
              onValueChange={setExpirationYear}
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
            onChange={(e) => setSecurityCode(e.target.value.replace(/\D/g, '').substring(0, 4))}
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
          onValueChange={setInstallments}
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
