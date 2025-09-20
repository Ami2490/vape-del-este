// netlify/functions/webhook.ts
import type { Handler } from "@netlify/functions";
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createHmac } from 'crypto';
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

// Firebase Config - must be managed by environment variables in Netlify
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase securely to avoid re-initialization on hot reloads
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to update an order's status in Firestore
const updateOrderStatusInFirestore = async (orderId: string, status: OrderStatus): Promise<void> => {
    const orderRef = doc(db, "orders", orderId);
    await setDoc(orderRef, { status: status }, { merge: true });
};

const handler: Handler = async (event) => {
    // MercadoPago sends a test request with GET
    if (event.httpMethod === 'GET') {
        return { statusCode: 200, body: 'Webhook endpoint is active.' };
    }
    
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { MERCADO_PAGO_ACCESS_TOKEN, MERCADO_PAGO_WEBHOOK_SECRET } = process.env;

    if (!MERCADO_PAGO_ACCESS_TOKEN || !MERCADO_PAGO_WEBHOOK_SECRET) {
        console.error("Server configuration error: Missing Mercado Pago credentials.");
        return { statusCode: 500, body: JSON.stringify({ error: "Internal server error." }) };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        
        // --- 1. Validate Signature (if present) ---
        const signature = event.headers['x-signature'];
        if (signature) {
            const requestId = event.headers['x-request-id'];
            const [ts, receivedHash] = signature.split(',').map(part => part.split('=')[1]);
            const manifest = `id:${body.data.id};request-id:${requestId};ts:${ts};`;
            const hmac = createHmac('sha256', MERCADO_PAGO_WEBHOOK_SECRET).update(manifest).digest('hex');

            if (hmac !== receivedHash) {
                console.error('Invalid signature');
                return { statusCode: 403, body: 'Invalid signature' };
            }
        } else {
             console.warn('Request received without x-signature header. Proceeding without validation (not recommended for production).');
        }


        // --- 2. Process Payment Notification ---
        if (body.type === 'payment' && body.data?.id) {
            const paymentId = body.data.id;

            const client = new MercadoPagoConfig({ accessToken: MERCADO_PAGO_ACCESS_TOKEN });
            const payment = new Payment(client);

            const paymentInfo = await payment.get({ id: paymentId });
            
            if (paymentInfo && paymentInfo.external_reference && paymentInfo.status === 'approved') {
                const orderId = paymentInfo.external_reference;
                await updateOrderStatusInFirestore(orderId, 'Processing');
                console.log(`Order ${orderId} successfully updated to 'Processing'.`);
            } else {
                console.log(`Payment ${paymentId} received but status is not 'approved' or no external reference found.`);
            }
        }

        // Always return 200 to MercadoPago to acknowledge receipt
        return { statusCode: 200, body: 'OK' };

    } catch (error: any) {
        console.error("Webhook processing error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || "Webhook processing failed." }),
        };
    }
};

export { handler };