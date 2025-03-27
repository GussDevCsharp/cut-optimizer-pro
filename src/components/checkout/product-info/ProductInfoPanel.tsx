
import React from 'react';
import { ProductInfo } from '../CheckoutModal';

interface ProductInfoPanelProps {
  product: ProductInfo;
}

const ProductInfoPanel: React.FC<ProductInfoPanelProps> = ({ product }) => {
  // Format price to Brazilian currency
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="p-6 border-b">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
      <p className="mt-2 text-xl font-bold">{formatPrice(product.price)}</p>
    </div>
  );
};

export default ProductInfoPanel;
