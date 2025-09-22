
import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
  onAskBot: (prompt: string) => void;
  comparisonList: string[];
  onToggleCompare: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onAskBot, comparisonList, onToggleCompare }) => {
  if (products.length === 0) {
    return <p className="text-center text-slate-500">No products found for this category.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {products.map((product) => (
        <ProductCard 
            key={product.id} 
            product={product} 
            onAskBot={onAskBot} 
            isSelectedForCompare={comparisonList.includes(product.id)}
            onToggleCompare={onToggleCompare}
        />
      ))}
    </div>
  );
};

export default ProductList;