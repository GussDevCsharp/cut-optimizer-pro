
import React from 'react';

interface ProductDisplayProps {
  productName: string;
  productDescription: string;
  productPrice: number;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({
  productName,
  productDescription,
  productPrice
}) => {
  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-6 border-b">
      <h3 className="text-lg font-semibold">{productName}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{productDescription}</p>
      <p className="mt-2 text-xl font-bold">{formatCurrency(productPrice)}</p>
    </div>
  );
};

export default ProductDisplay;
