import React, { useState } from 'react';
// Corrected import paths to be relative.
import { useCart } from '../contexts/CartContext';
import { ChevronLeftIcon } from './IconComponents';
import { useAuth } from '../contexts/AuthContext';
import { MercadoPagoPayment } from './MercadoPagoPayment';

interface CheckoutPageProps {
  onPlaceOrder: (customerDetails: { name: string, email: string }) => void;
  onReturnToShop: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onPlaceOrder, onReturnToShop }) => {
  const { cart, totalPrice } = useCart();
  const { user } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState('mp'); // Default to Mercado Pago
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [paymentError, setPaymentError] = useState<string | null>(null);


  const handleFinalizeSimulation = (e: React.FormEvent) => {
      e.preventDefault();
      if (cart.length > 0) {
          onPlaceOrder({ name: customerName, email: customerEmail });
      }
  };

  const handlePaymentSuccess = () => {
    if (cart.length > 0) {
      onPlaceOrder({ name: customerName, email: customerEmail });
    }
  };

  const handlePaymentFailure = (errorDetail: string) => {
    setPaymentError(errorDetail);
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    setPaymentError(null); // Clear errors when switching methods
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

        <form onSubmit={handleFinalizeSimulation} className="flex flex-col lg:flex-row gap-12">
            {/* Form Section */}
            <div className="flex-1 bg-dark-primary p-8 rounded-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6">Detalles de Pago</h2>
                 <div className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">Nombre Completo</label>
                        <input id="fullName" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-dark-secondary border border-gray-600 rounded-md p-2 text-white focus:ring-brand-purple focus:border-brand-purple" placeholder="Juan Pérez" required/>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input id="email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full bg-dark-secondary border border-gray-600 rounded-md p-2 text-white focus:ring-brand-purple focus:border-brand-purple" placeholder="juan.perez@email.com" required/>
                    </div>
                    <div className="pt-4 border-t border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Método de Pago</h3>
                        <div className="flex border-b border-gray-600 mb-4">
                            <button type="button" onClick={() => handlePaymentMethodChange('card')} className={`px-4 py-2 text-sm font-medium transition-colors ${paymentMethod === 'card' ? 'border-b-2 border-brand-purple text-white' : 'text-gray-400 hover:text-white'}`}>Tarjeta (Simulado)</button>
                            <button type="button" onClick={() => handlePaymentMethodChange('transfer')} className={`px-4 py-2 text-sm font-medium transition-colors ${paymentMethod === 'transfer' ? 'border-b-2 border-brand-purple text-white' : 'text-gray-400 hover:text-white'}`}>Transferencia (Simulado)</button>
                            <button type="button" onClick={() => handlePaymentMethodChange('mp')} className={`px-4 py-2 text-sm font-medium transition-colors ${paymentMethod === 'mp' ? 'border-b-2 border-brand-purple text-white' : 'text-gray-400 hover:text-white'}`}>Mercado Pago</button>
                        </div>
                        <div className="p-4 bg-dark-secondary rounded-md min-h-[100px]">
                            {paymentError && (
                                <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold p-3 rounded-lg mb-4">
                                    <p>Ocurrió un error al procesar el pago.</p>
                                    <p className="text-xs mt-1">{paymentError}</p>
                                </div>
                            )}
                            {paymentMethod === 'card' && <p className="text-gray-400 text-sm">Funcionalidad de pago con tarjeta próximamente. Por favor, complete los campos y presione "Realizar Pedido" para simular la compra.</p>}
                            {paymentMethod === 'transfer' && <p className="text-gray-400 text-sm">Datos para transferencia bancaria (simulado):<br/>Banco: Banco Ficticio<br/>N° Cuenta: 123-456-789</p>}
                            {paymentMethod === 'mp' && (
                                <MercadoPagoPayment 
                                    amount={totalPrice}
                                    customerEmail={customerEmail}
                                    onPaymentSuccess={handlePaymentSuccess}
                                    onPaymentFailure={handlePaymentFailure}
                                />
                            )}
                        </div>
                    </div>
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
                                <span className="text-white font-medium">$U {(parseFloat(item.product.price.replace('$U', '').replace('.', '')) * item.quantity).toLocaleString('es-UY')}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-600 space-y-3">
                        <div className="flex justify-between text-lg font-bold">
                            <span className="text-white">Total</span>
                            <span className="text-brand-blue-light">$U {totalPrice.toLocaleString('es-UY')}</span>
                        </div>
                    </div>
                     {paymentMethod !== 'mp' && (
                        <button type="submit" className="w-full mt-6 bg-brand-purple text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300">
                           Realizar Pedido
                       </button>
                     )}
                </div>
            </aside>
        </form>
    </div>
  );
};
