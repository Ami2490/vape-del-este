// Fix: The 'vite/client' type reference was removed as it could not be resolved.
// A type assertion is used on `import.meta` as a workaround for the missing TypeScript types.
// This assumes the Vite build process correctly substitutes these environment variables.
import React, { useEffect, useState, useRef } from 'react';

interface MercadoPagoPaymentProps {
    amount: number;
    customerEmail: string;
    onPaymentSuccess: (paymentId: string) => void;
    onPaymentFailure: (errorDetail: string) => void;
}

declare global {
    interface Window {
        MercadoPago: any;
    }
}

const MP_PUBLIC_KEY = (import.meta as any).env.VITE_MERCADO_PAGO_PUBLIC_KEY;
const BRICK_CONTAINER_ID = 'paymentBrick_container';

export const MercadoPagoPayment: React.FC<MercadoPagoPaymentProps> = ({ amount, customerEmail, onPaymentSuccess, onPaymentFailure }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const brickInstance = useRef<any>(null);

    useEffect(() => {
        let isComponentMounted = true; 

        if (!MP_PUBLIC_KEY) {
            console.error("Mercado Pago public key is not configured.");
            onPaymentFailure("La configuración de pagos no está disponible.");
            setIsLoading(false);
            return;
        }

        const renderBrick = async () => {
            try {
                const mp = new window.MercadoPago(MP_PUBLIC_KEY, { locale: 'es-UY' });
                const bricksBuilder = mp.bricks();

                const settings = {
                    initialization: {
                        amount: amount,
                        payer: { email: customerEmail },
                        entityType: 'individual', // Fix: Added required entityType
                    },
                    customization: {
                        visual: { style: { theme: 'dark' } },
                        paymentMethods: {
                            creditCard: 'all',
                            debitCard: 'all',
                        },
                    },
                    callbacks: {
                        onReady: () => {
                            if (isComponentMounted) setIsLoading(false);
                        },
                        onSubmit: async ({ formData }: any) => {
                            setIsProcessing(true);
                            onPaymentFailure(""); // Clear previous errors
                            try {
                                // The URL /api/process-payment works thanks to the redirect rule in netlify.toml
                                const response = await fetch('/api/process-payment', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(formData),
                                });
                                
                                const responseText = await response.text();
                                if (!response.ok) {
                                    // Try to parse error from JSON, otherwise use the text
                                    try {
                                        const errorResult = JSON.parse(responseText);
                                        throw new Error(errorResult.error || `Error ${response.status}: ${response.statusText}`);
                                    } catch (e) {
                                        throw new Error(`Error ${response.status}: El servidor devolvió una respuesta inesperada.`);
                                    }
                                }

                                const result = JSON.parse(responseText);

                                if (result.status === 'approved') {
                                    onPaymentSuccess(result.id);
                                } else {
                                    // Handle rejected or pending payments
                                    onPaymentFailure(`Pago ${result.status}: ${result.status_detail}`);
                                }

                            } catch (error: any) {
                                console.error("Payment processing error:", error);
                                onPaymentFailure(error.message || 'No se pudo conectar con el servidor de pagos.');
                            } finally {
                                if (isComponentMounted) setIsProcessing(false);
                            }
                        },
                        onError: (error: any) => {
                            console.error("Mercado Pago Brick error:", error);
                            if (isComponentMounted) onPaymentFailure("Error en el formulario de pago. Revisa los datos.");
                        },
                    },
                };

                if (brickInstance.current) {
                    brickInstance.current.unmount();
                }

                const container = document.getElementById(BRICK_CONTAINER_ID);
                if (container) {
                    container.innerHTML = ''; // Clear previous instances
                    const instance = await bricksBuilder.create('payment', BRICK_CONTAINER_ID, settings);
                    if (isComponentMounted) {
                        brickInstance.current = instance;
                    }
                }
            } catch (err) {
                console.error("Failed to render Mercado Pago brick", err);
                if (isComponentMounted) {
                    onPaymentFailure("No se pudo cargar el formulario de pago.");
                    setIsLoading(false);
                }
            }
        };

        // Only render if amount is valid
        if (amount > 0) {
            renderBrick();
        } else {
             setIsLoading(false);
        }

        return () => {
            isComponentMounted = false;
            if (brickInstance.current) {
                try {
                  brickInstance.current.unmount();
                } catch (unmountError) {
                  console.warn("Error unmounting Mercado Pago brick:", unmountError);
                }
                brickInstance.current = null;
            }
        };
    }, [amount, customerEmail, onPaymentSuccess, onPaymentFailure]);

    return (
        <div>
            {isLoading && <p className="text-center text-gray-400 animate-pulse">Cargando método de pago seguro...</p>}
            {isProcessing && <p className="text-center text-brand-blue-light font-semibold animate-pulse">Procesando pago...</p>}
            <div id={BRICK_CONTAINER_ID} style={{ display: isLoading || isProcessing ? 'none' : 'block' }}></div>
        </div>
    );
};