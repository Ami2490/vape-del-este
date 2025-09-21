import React, { useState, useEffect } from 'react';
// Corrected import paths to be relative.
import { useCart } from '../contexts/CartContext';
import { getUpsellSuggestion } from '../services/geminiService';
import type { Recommendation, Product } from '../types';
import { ShoppingCartIcon } from './IconComponents';

interface UpsellModalProps {
  onClose: () => void;
  allProducts: Product[];
}

export const UpsellModal: React.FC<UpsellModalProps> = ({ onClose, allProducts }) => {
  const { cart, addToCart } = useCart();
  const [suggestion, setSuggestion] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestion = async () => {
      setLoading(true);
      const cartProductInfo = cart.map(item => ({ name: item.product.name }));
      const result = await getUpsellSuggestion(cartProductInfo, allProducts);
      setSuggestion(result);
      setLoading(false);
    };
    if (allProducts.length > 0) {
        fetchSuggestion();
    }
  }, [cart, allProducts]);

  const handleAddToCart = () => {
    const productToAdd = allProducts.find(p => p.name === suggestion?.productName);
    if (productToAdd) {
      addToCart(productToAdd);
    }
    onClose();
  };
  
  const productDetails = suggestion ? allProducts.find(p => p.name === suggestion.productName) : null;

  return (
     <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] p-4 font-sans animate-fade-in" onClick={onClose} style={{animation: 'fade-in 0.3s ease-out forwards'}}>
        <div className="bg-dark-secondary rounded-xl shadow-2xl max-w-lg w-full text-center p-8 border border-gray-700 animate-slide-up" onClick={(e) => e.stopPropagation()} style={{animation: 'slide-up 0.4s ease-out forwards'}}>
           <h2 className="text-2xl font-bold text-white mb-2">¡Espera! Un último detalle...</h2>
           <p className="text-gray-400 mb-6">Nuestros expertos sugieren que también te podría gustar:</p>

            {loading && <div className="text-brand-blue-light animate-pulse h-64 flex items-center justify-center">Buscando una recomendación...</div>}

            {!loading && suggestion && productDetails && (
                <div className="space-y-4">
                    <img src={suggestion.imageUrl} alt={suggestion.productName} className="w-40 h-40 object-contain rounded-md mx-auto mb-4 bg-white p-2"/>
                    <h3 className="text-xl font-bold text-brand-blue-light">{suggestion.productName}</h3>
                    <p className="text-gray-300 italic">"{suggestion.reasoning}"</p>
                    <p className="text-2xl font-bold text-white">{productDetails.price}</p>
                </div>
            )}
            
            {!loading && !suggestion && <div className="text-gray-500 h-64 flex items-center justify-center">No hemos encontrado una sugerencia extra por ahora.</div>}

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                {suggestion && (
                    <button onClick={handleAddToCart} className="flex-1 bg-brand-purple text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                        <ShoppingCartIcon className="h-5 w-5 inline mr-2"/>Añadir y Finalizar
                    </button>
                )}
                 <button onClick={onClose} className="flex-1 bg-gray-700 text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors">
                    {suggestion ? 'No, gracias' : 'Finalizar Compra'}
                </button>
            </div>
        </div>
     </div>
  );
};