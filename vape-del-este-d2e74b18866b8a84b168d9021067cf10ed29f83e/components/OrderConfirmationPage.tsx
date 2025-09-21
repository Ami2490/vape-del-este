import React, { useEffect, useRef } from 'react';
// Corrected import paths to be relative.
import { useCart } from '../contexts/CartContext';
import { CartItem } from '../types';

interface OrderConfirmationPageProps {
  orderId: string;
  onReturnToShop: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderId, onReturnToShop }) => {
    const { cart, totalPrice, clearCart } = useCart();
    
    // Capture cart state at the moment of order to display it even after cart is cleared.
    const orderedItemsRef = useRef<CartItem[]>(cart);
    const orderedTotalRef = useRef<number>(totalPrice);

    useEffect(() => {
        // Clear the cart only once when the component mounts
        clearCart();
    }, [clearCart]);

    const orderedItems = orderedItemsRef.current;
    const orderedTotal = orderedTotalRef.current;

    return (
        <div className="container mx-auto px-6 py-20 text-center animate-fade-in" style={{animation: 'fade-in 0.5s ease-out'}}>
             <h1 className="text-4xl font-black text-white mb-4">¡Gracias por tu compra!</h1>
             <p className="text-gray-400 mb-2">Tu pedido ha sido realizado con éxito.</p>
             <p className="text-lg text-brand-blue-light font-bold mb-8">Número de Pedido: {orderId}</p>

             <div className="max-w-md mx-auto bg-dark-primary p-6 rounded-lg border border-gray-700 text-left">
                <h2 className="text-xl font-bold text-white mb-4">Resumen del Pedido</h2>
                 <div className="space-y-2">
                     {orderedItems.map(item => (
                        <div key={item.product.id} className="flex justify-between text-sm">
                            <span className="text-gray-300 flex-1 truncate pr-2">{item.product.name} x{item.quantity}</span>
                            <span className="text-white">$U {(parseFloat(item.product.price.replace('$U', '').replace('.', '')) * item.quantity).toLocaleString('es-UY')}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-600 flex justify-between font-bold">
                    <span className="text-white">Total Pagado:</span>
                    <span className="text-white">$U {orderedTotal.toLocaleString('es-UY')}</span>
                </div>
             </div>
             
             <button onClick={onReturnToShop} className="mt-10 bg-brand-purple text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors">
                Seguir Comprando
            </button>
        </div>
    );
};