import React from 'react';
// Corrected import paths to be relative.
import type { Product } from '../types';
import { ShoppingCartIcon, StarIcon } from './IconComponents';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  onCompare: (product: Product) => void;
  isComparing: boolean;
  onViewDetails: (product: Product) => void;
}

const StarRating = ({ rating, reviewCount }: { rating: number, reviewCount: number }) => {
    if (reviewCount === 0) {
        return <div className="text-xs text-gray-500 h-5 flex items-center justify-center">Sin reseñas</div>;
    }
    return (
        <div className="flex items-center justify-center gap-1 h-5">
            {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={`h-4 w-4 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-600'}`} filled={i < Math.round(rating)} />
            ))}
            <span className="text-xs text-gray-400 ml-1">({reviewCount})</span>
        </div>
    );
};


export const ProductCard: React.FC<ProductCardProps> = ({ product, onCompare, isComparing, onViewDetails }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCompare(product);
  }

  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  return (
    <div 
      className="group [transform-style:preserve-3d] transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer"
      onClick={() => onViewDetails(product)}
    >
      <div className="border border-gray-800 bg-dark-primary rounded-lg p-4 flex flex-col text-center shadow-lg relative h-full transition-all duration-300 ease-in-out group-hover:shadow-brand-purple/40 group-hover:shadow-2xl">
        <div className="[transform-style:preserve-3d] transition-transform duration-500 ease-in-out group-hover:[transform:translateZ(20px)] flex flex-col h-full">
            <img src={product.imageUrl} alt={product.name} className="w-40 h-40 object-contain rounded-md mb-4 self-center"/>
            <h4 className="font-bold text-lg text-white flex-grow flex items-center justify-center min-h-[3.5rem]">{product.name}</h4>
            <div className="my-2">
              <StarRating rating={averageRating} reviewCount={product.reviews?.length || 0} />
            </div>
            <p className="text-sm font-semibold text-gray-400 mb-2">{product.category}</p>
            <p className="text-xl font-bold text-brand-blue-light mb-4">{product.price}</p>
            <div className="mt-auto">
              <button 
                  onClick={handleAddToCart}
                  className="w-full bg-brand-purple text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-300 text-sm flex items-center justify-center">
                <ShoppingCartIcon className="h-4 w-4 mr-2" />
                Añadir al Carrito
              </button>
              <button 
                onClick={handleCompareClick}
                className={`w-full mt-2 text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-300 ${
                  isComparing 
                    ? 'bg-red-700 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {isComparing ? 'Quitar de Comparar' : 'Comparar'}
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};
