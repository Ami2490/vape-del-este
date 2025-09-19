import React, { useState } from 'react';
// Corrected import paths to be relative.
import { useCart } from '../contexts/CartContext';
import { ChevronLeftIcon } from './IconComponents';
import { useAuth } from '../contexts/AuthContext';
import type { Order } from '../types';

interface CheckoutPageProps {
  onReturnToShop: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onReturnToShop }) => {
  const { cart, totalPrice } = useCart();
  const { user, isAuthenticated, addOrder } = useAuth();
  
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleCheckoutPro = async () => {
    if (!customerName || !customerEmail) {
        setPaymentError("Por favor, completa tu nombre y email antes de pagar.");
        return;
    }
    
    setIsRedirecting(true);
    setPaymentError(null);

    const newOrderId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const newOrder: Order = {
      id: newOrderId,
      date: new Date().toLocaleDateString('es-UY'),
      customerName: customerName,
      customerEmail: customerEmail,
      items: cart.map(item => ({ product: item.product, quantity: item.quantity })),
      total: totalPrice,
      status: 'Pending',
    };

    if (isAuthenticated) {
      addOrder(newOrder);
    }
    sessionStorage.setItem(`pendingOrder-${newOrderId}`, JSON.stringify(newOrder));

    const preferenceItems = cart.map(item => ({
      id: String(item.product.id),
      title: item.product.name,
      quantity: item.quantity,
      unit_price: parseFloat(item.product.price.replace('$U ', '').replace('.', '')),
      currency_id: 'UYU',
    }));

    try {
        const res = await fetch('/.netlify/functions/create-preference', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: preferenceItems, orderId: newOrderId })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'No se pudo generar el link de pago.');
        }

        const data = await res.json();
        if (data.init_point) {
            window.location.href = data.init_point;
        } else {
            throw new Error('Respuesta inválida del servidor.');
        }
    } catch (error: any) {
        setPaymentError(error.message);
        setIsRedirecting(false);
    }
  };

  if (cart.length === 0) {
    return (
        <div className="container mx-auto px-6 py-20 text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Tu carrito está vacío</h1>
            <p className="text-gray-400 mb-6">Añade productos a tu carrito antes de finalizar la compra.</p>
            <button onClick={onReturnToShop} className="bg-brand-purple text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700">
                Volver a la Tienda
            </button>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 animate-fade-in" style={{animation: 'fade-in 0.5s ease-out'}}>
        
        <button onClick={onReturnToShop} className="flex items-center gap-2 text-brand-blue-light hover:underline mb-6">
            <ChevronLeftIcon className="h-5 w-5" />
            Volver a la tienda
        </button>

        <h1 className="text-4xl font-black text-center mb-10 text-white uppercase">Finalizar Compra</h1>

        <div className="flex flex-col lg:flex-row gap-12">
            {/* Form & Payment Section */}
            <div className="flex-1 bg-dark-primary p-8 rounded-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6">1. Tus Datos de Contacto</h2>
                 <div className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">Nombre Completo</label>
                        <input id="fullName" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-dark-secondary border border-gray-600 rounded-md p-2.5 text-white focus:ring-brand-purple focus:border-brand-purple" placeholder="Juan Pérez" required/>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input id="email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full bg-dark-secondary border border-gray-600 rounded-md p-2.5 text-white focus:ring-brand-purple focus:border-brand-purple" placeholder="juan.perez@email.com" required/>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700">
                    <h2 className="text-2xl font-bold text-white mb-4">2. Pago Seguro con Mercado Pago</h2>
                     {paymentError && (
                        <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold p-3 rounded-lg mb-4">
                            <p>Ocurrió un error: {paymentError}</p>
                        </div>
                    )}
                    <p className="text-gray-400 mb-4 text-sm">
                        Al hacer clic en el botón de pago, serás redirigido al sitio seguro de Mercado Pago para completar tu compra. Aceptamos todos los medios de pago disponibles en su plataforma.
                    </p>
                    <button 
                        type="button" 
                        onClick={handleCheckoutPro}
                        disabled={isRedirecting || !customerName || !customerEmail}
                        className="w-full bg-[#009ee3] text-white font-bold py-4 px-6 rounded-lg hover:bg-[#0089cc] transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                    >
                        <img src="https://logospng.org/download/mercado-pago/logo-mercado-pago-256.png" alt="Mercado Pago" className="h-6 w-auto mr-3" />
                        {isRedirecting ? 'Redirigiendo...' : `Pagar $U ${totalPrice.toLocaleString('es-UY')}`}
                    </button>
                </div>
            </div>

            {/* Order Summary */}
            <aside className="w-full lg:w-96">
                <div className="bg-dark-primary p-8 rounded-lg border border-gray-700 sticky top-24">
                    <h3 className="text-xl font-bold text-white mb-6">Resumen del Pedido</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                         {cart.map(item => (
                            <div key={item.product.id} className="flex justify-between items-center text-sm">
                                <span className="text-gray-300 flex-1 truncate pr-2">{item.product.name} x{item.quantity}</span>
                                <span className="text-white font-medium">$U {(parseFloat(item.product.price.replace('$U ', '').replace('.', '')) * item.quantity).toLocaleString('es-UY')}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-600 space-y-3">
                        <div className="flex justify-between text-lg font-bold">
                            <span className="text-white">Total</span>
                            <span className="text-brand-blue-light">$U {totalPrice.toLocaleString('es-UY')}</span>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </div>
  );
};
