import React, { useEffect } from 'react';
import { useCart } from '../contexts/CartContext';

interface PaymentStatusPageProps {
  status: 'success' | 'failure' | 'pending';
  params: URLSearchParams;
  onReturnToShop: () => void;
}

export const PaymentStatusPage: React.FC<PaymentStatusPageProps> = ({ status, params, onReturnToShop }) => {
    const { clearCart } = useCart();
    const orderId = params.get('external_reference');

    useEffect(() => {
        if (status === 'success') {
            clearCart();
            // Clean up the temporary pending order from session storage
            if (orderId) {
                sessionStorage.removeItem(`pendingOrder-${orderId}`);
            }
        }
    }, [status, clearCart, orderId]);

    const statusInfo = {
        success: {
            title: "¡Gracias por tu compra!",
            message: `Tu pedido ha sido realizado con éxito y está siendo procesado.`,
            orderText: `Número de Pedido: ${orderId}`,
            color: "text-brand-blue-light"
        },
        failure: {
            title: "Hubo un problema con tu pago",
            message: "El pago fue rechazado. Por favor, intenta con otro método de pago o contacta a tu banco.",
            orderText: `Intento de pedido: ${orderId}`,
            color: "text-red-500"
        },
        pending: {
            title: "Tu pago está pendiente",
            message: "Estamos esperando la confirmación del pago. Te notificaremos por email cuando se complete el proceso.",
            orderText: `Pedido: ${orderId}`,
            color: "text-yellow-400"
        }
    };

    const currentStatus = statusInfo[status];

    return (
        <div className="container mx-auto px-6 py-20 text-center animate-fade-in" style={{animation: 'fade-in 0.5s ease-out'}}>
             <h1 className="text-4xl font-black text-white mb-4">{currentStatus.title}</h1>
             <p className="text-gray-400 mb-2">{currentStatus.message}</p>
             {orderId && <p className={`text-lg font-bold mb-8 ${currentStatus.color}`}>{currentStatus.orderText}</p>}
             
             <button onClick={onReturnToShop} className="mt-10 bg-brand-purple text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors">
                Seguir Comprando
            </button>
        </div>
    );
};
