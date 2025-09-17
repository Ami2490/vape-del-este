
import React from 'react';
// Corrected import path to be relative.
import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onCompare: (product: Product) => void;
  comparisonList: Product[];
  onViewDetails: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onCompare, comparisonList, onViewDetails }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 [perspective:1000px]">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onCompare={onCompare}
          isComparing={comparisonList.some(p => p.id === product.id)}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};