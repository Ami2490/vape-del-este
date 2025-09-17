
import React from 'react';
// Corrected import paths to be relative.
import type { Product } from '../types';
import { XIcon } from './IconComponents';

interface ComparisonBarProps {
  products: Product[];
  onRemove: (productId: number) => void;
  onClear: () => void;
  onCompareClick: () => void;
}

export const ComparisonBar: React.FC<ComparisonBarProps> = ({ products, onRemove, onClear, onCompareClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-primary text-white p-4 shadow-2xl-top z-40 border-t border-gray-800">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
            <h4 className="font-bold text-lg hidden sm:block">Comparar Productos</h4>
            <div className="flex flex-wrap gap-2">
                {products.map(product => (
                    <div key={product.id} className="bg-gray-700 rounded-full pl-3 pr-2 py-1 flex items-center text-sm">
                        <span>{product.name}</span>
                        <button onClick={() => onRemove(product.id)} className="ml-2 text-gray-400 hover:text-white">
                            <XIcon className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
        <div className="flex items-center gap-4">
            <button 
                onClick={onCompareClick} 
                disabled={products.length < 2}
                className="bg-brand-blue-light text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-blue-dark transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed">
                Comparar ({products.length})
            </button>
            <button onClick={onClear} className="text-gray-400 hover:text-white text-sm">Limpiar</button>
        </div>
      </div>
    </div>
  );
};