import React, { useState } from 'react';
// Corrected import paths to be relative.
import type { Product, Review } from '../types';
import { XIcon, ShoppingCartIcon, StarIcon } from './IconComponents';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface ProductModalProps {
  product: Product;
  allProducts: Product[];
  onClose: () => void;
  onBuyNow: (product: Product) => void;
  onAddReview: (productId: number, review: Review) => void;
}

const StarRatingDisplay = ({ rating, size = 'h-5 w-5' }: { rating: number, size?: string }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={`${size} ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-600'}`} filled={i < Math.round(rating)} />
        ))}
    </div>
);

export const ProductModal: React.FC<ProductModalProps> = ({ product, allProducts, onClose, onBuyNow, onAddReview }) => {
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  
  const handleAddToCart = () => {
    addToCart(product);
    onClose();
  };

  const handleBuyNow = () => {
    onBuyNow(product);
  };
  
  const handleAddReviewSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (newRating > 0 && newComment.trim() !== '' && user) {
          const newReview: Review = {
              id: new Date().toISOString(),
              author: user.name,
              avatar: user.avatar,
              rating: newRating,
              comment: newComment,
              date: new Date().toLocaleDateString('es-UY'),
          };
          onAddReview(product.id, newReview);
          setNewRating(0);
          setNewComment('');
      }
  };

  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  // Effect to prevent body scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 font-sans animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }

        @keyframes slide-up {
            from { transform: translateY(20px) scale(0.98); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
      `}</style>
      <div 
        className="bg-dark-secondary rounded-xl shadow-2xl max-w-4xl w-full text-left relative max-h-[90vh] flex flex-col border border-gray-700 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-white z-20 p-2 rounded-full bg-dark-primary/50 hover:bg-dark-primary transition-colors" aria-label="Cerrar modal">
            <XIcon className="h-6 w-6" />
        </button>
        
        <div className="overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              {/* Image Column */}
              <div className="flex items-center justify-center bg-dark-primary rounded-lg p-4 h-full">
                <div className="overflow-hidden rounded-md group">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="max-h-[450px] w-auto object-contain transition-transform duration-300 ease-in-out group-hover:scale-125 cursor-zoom-in"
                  />
                </div>
              </div>

              {/* Details Column */}
              <div className="flex flex-col">
                <h2 className="text-3xl font-bold text-white mb-2">{product.name}</h2>
                <div className="flex items-center gap-2 mb-4">
                  <StarRatingDisplay rating={averageRating} />
                  <span className="text-sm text-gray-400">({product.reviews?.length || 0} reseñas)</span>
                </div>
                <p className="text-md font-semibold text-gray-400 mb-4">{product.category}</p>
                <p className="text-3xl font-bold text-brand-blue-light mb-6">{product.price}</p>
                
                <div className="text-gray-300 mb-6 space-y-2 text-sm">
                    <p>{product.description && product.description !== '(No se encontró descripción).' ? product.description : 'No hay descripción disponible para este producto.'}</p>
                </div>
                
                {product.features && product.features.length > 0 && (
                    <div className="mb-6">
                        <h4 className="font-semibold text-white mb-2">Características:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                            {product.features.map((feature, index) => <li key={index}>{feature}</li>)}
                        </ul>
                    </div>
                )}
                
                {/* Action Buttons */}
                <div className="mt-auto pt-6 border-t border-gray-700 flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={handleAddToCart}
                      className="w-full flex-1 bg-brand-purple text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-300 flex items-center justify-center text-md"
                    >
                        <ShoppingCartIcon className="h-5 w-5 mr-2" />
                        Añadir al Carrito
                    </button>
                     <button 
                      onClick={handleBuyNow}
                      className="w-full flex-1 bg-brand-blue-light text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-blue-dark transition-colors duration-300 text-md"
                    >
                        Comprar Ahora
                    </button>
                </div>
              </div>
            </div>
            
            {/* Reviews Section */}
            <div className="px-8 pb-8 border-t border-gray-700">
                <h3 className="text-2xl font-bold text-white mt-6 mb-4">Reseñas de Clientes</h3>
                 {isAuthenticated && user && (
                    <div className="bg-dark-primary p-4 rounded-lg border border-gray-600 mb-6">
                        <h4 className="font-semibold text-white mb-3">Deja tu reseña</h4>
                        <form onSubmit={handleAddReviewSubmit}>
                            <div className="flex items-center mb-3">
                                <span className="text-sm text-gray-400 mr-3">Tu calificación:</span>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button type="button" key={star} onClick={() => setNewRating(star)} className="text-2xl" aria-label={`Calificar con ${star} estrellas`}>
                                            <StarIcon className={`h-6 w-6 cursor-pointer transition-colors ${star <= newRating ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-300'}`} filled={star <= newRating} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <textarea value={newComment} onChange={e => setNewComment(e.target.value)} rows={3} className="w-full bg-dark-secondary border border-gray-600 rounded-md p-2.5 text-white focus:ring-brand-purple focus:border-brand-purple" placeholder={`¿Qué te pareció el ${product.name}?`} required></textarea>
                            <button type="submit" disabled={!newRating || !newComment.trim()} className="mt-3 bg-brand-purple text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed">Enviar Reseña</button>
                        </form>
                    </div>
                )}
                <div className="space-y-6 max-h-72 overflow-y-auto pr-2">
                    {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map(review => (
                            <div key={review.id} className="flex items-start gap-4">
                                <img src={review.avatar} alt={review.author} className="h-10 w-10 rounded-full object-cover" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-1">
                                        <p className="font-bold text-white">{review.author}</p>
                                        <StarRatingDisplay rating={review.rating} size="h-4 w-4" />
                                    </div>
                                    <p className="text-xs text-gray-500 mb-1">{review.date}</p>
                                    <p className="text-sm text-gray-300">{review.comment}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">Aún no hay reseñas para este producto. ¡Sé el primero!</p>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};