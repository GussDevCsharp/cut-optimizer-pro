
import React from 'react';
import { ProductInfo } from '../CheckoutModal';
import { formatCurrency } from '@/services/mercadoPago/utils';

interface ProductSummaryProps {
  product: ProductInfo;
}

const ProductSummary: React.FC<ProductSummaryProps> = ({ product }) => {
  return (
    <div className="p-6 border-b">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
      <p className="mt-2 text-xl font-bold">{formatCurrency(product.price)}</p>
    </div>
  );
};

export default ProductSummary;
