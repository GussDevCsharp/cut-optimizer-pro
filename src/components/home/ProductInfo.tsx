
import React from 'react';
import { ProductInfo as ProductInfoType } from './types';

interface ProductInfoProps {
  product: ProductInfoType;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="mb-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
      <p className="mt-2 text-xl font-bold">{formatCurrency(product.price)}</p>
    </div>
  );
};

export default ProductInfo;
