// netlify/functions/create-preference.ts
import { MercadoPagoConfig, Preference } from 'mercadopago';
import type { Handler } from "@netlify/functions";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase securely
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

const createOrderInFirestore = async (order: any): Promise<void> => {
    const orderRef = doc(db, "orders", order.id);
    await setDoc(orderRef, order);
};

interface CartItemPayload {
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
    currency_id: string;
}

interface RequestBody {
    items: CartItemPayload[];
    order: any; // Full order object
}

const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    const DEPLOY_URL = process.env.DEPLOY_PRIME_URL || process.env.URL || 'http://localhost:8888';

    if (!MERCADO_PAGO_ACCESS_TOKEN) {
        console.error("Mercado Pago Access Token is not configured.");
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "El procesador de pagos no está configurado." }),
        };
    }

    try {
        const { items, order } = JSON.parse(event.body || '{}') as RequestBody;

        if (!items || items.length === 0 || !order || !order.id) {
            return { 
                statusCode: 400, 
                body: JSON.stringify({ error: "Datos del carrito o del pedido faltantes." }) 
            };
        }

        // Create the pending order in our database first
        await createOrderInFirestore(order);

        const client = new MercadoPagoConfig({ accessToken: MERCADO_PAGO_ACCESS_TOKEN });
        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items,
                external_reference: order.id,
                notification_url: `${DEPLOY_URL}/.netlify/functions/webhook`,
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