// netlify/functions/create-preference.ts
import { MercadoPagoConfig, Preference } from 'mercadopago';
import type { Handler } from "@netlify/functions";

interface CartItemPayload {
    // Fix: Changed id from 'string | number' to 'string' to match MercadoPago SDK type.
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
    currency_id: string;
}

interface RequestBody {
    items: CartItemPayload[];
    orderId: string;
}


const handler: Handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    // Use Netlify's deploy URL variables for robust redirection
    const DEPLOY_URL = process.env.DEPLOY_PRIME_URL || process.env.URL || 'http://localhost:8888';

    if (!MERCADO_PAGO_ACCESS_TOKEN) {
        console.error("Mercado Pago Access Token is not configured.");
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "El procesador de pagos no está configurado." }),
        };
    }

    try {
        const { items, orderId } = JSON.parse(event.body || '{}') as RequestBody;

        if (!items || items.length === 0 || !orderId) {
            return { 
                statusCode: 400, 
                body: JSON.stringify({ error: "Datos del carrito o ID de orden faltantes." }) 
            };
        }

        const client = new MercadoPagoConfig({ accessToken: MERCADO_PAGO_ACCESS_TOKEN });
        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items,
                external_reference: orderId, // Link our internal order ID to the MP payment
                back_urls: {
                    success: `${DEPLOY_URL}/success`,
                    failure: `${DEPLOY_URL}/failure`,
                    pending: `${DEPLOY_URL}/pending`,
                },
                auto_return: 'approved',
            },
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ init_point: result.init_point }),
        };

    } catch (error: any) {
        console.error("Error creating preference:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || "No se pudo crear la preferencia de pago." }),
        };
    }
};

export { handler };