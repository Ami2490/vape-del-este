import React from 'react';
// Corrected import paths to be relative.
import { useCart } from '../contexts/CartContext';
import { XIcon } from './IconComponents';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToCheckout: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, onGoToCheckout }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-60 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-dark-primary text-dark-text shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
        hidden={!isOpen}
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 id="cart-heading" className="text-2xl font-bold text-white">Tu Carrito</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Cerrar carrito">
              <XIcon className="h-6 w-6" />
            </button>
          </header>
          
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <p className="text-gray-400 text-center mt-8">Tu carrito está vacío.</p>
            ) : (
              <ul className="space-y-4">
                {cart.map(item => (
                  <li key={item.product.id} className="flex items-center gap-4">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-contain rounded-md bg-white p-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm">{item.product.name}</h3>
                      <p className="text-brand-blue-light text-sm">{item.product.price}</p>
                      <div className="flex items-center mt-2">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2 py-1 bg-gray-700 rounded-l-md hover:bg-gray-600">-</button>
                        <span className="px-3 text-sm bg-dark-secondary">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 py-1 bg-gray-700 rounded-r-md hover:bg-gray-600">+</button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-gray-500 hover:text-red-500 text-xs">Quitar</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cart.length > 0 && (
            <footer className="p-6 border-t border-gray-700 space-y-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Subtotal:</span>
                <span className="text-white">$U {totalPrice.toLocaleString('es-UY')}</span>
              </div>
              <button onClick={onGoToCheckout} className="w-full bg-brand-purple text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-300">
                Finalizar Compra
              </button>
              <button onClick={clearCart} className="w-full text-center text-gray-500 hover:text-red-500 text-sm mt-2">
                Vaciar Carrito
              </button>
            </footer>
          )}
        </div>
      </div>
    </>
  );
};