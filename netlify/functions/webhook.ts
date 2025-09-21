// netlify/functions/webhook.ts
import type { Handler } from "@netlify/functions";
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";

// Initialize Firebase
// Ensure these environment variables are set in your Netlify project settings.
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const updateOrderStatusInDb = async (orderId: string, status: 'Processing' | 'Cancelled') => {
    const orderRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(orderRef);
    if (docSnap.exists()) {
      await updateDoc(orderRef, { status, lastUpdated: serverTimestamp() });
      console.log(`Order ${orderId} status updated to ${status}.`);
    } else {
      console.error(`Order ${orderId} not found in database.`);
    }
};

const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Ensure these are set in Netlify environment variables
    const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    const MERCADO_PAGO_WEBHOOK_SECRET = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

    if (!MERCADO_PAGO_ACCESS_TOKEN || !MERCADO_PAGO_WEBHOOK_SECRET) {
        console.error("Mercado Pago environment variables are not configured.");
        return { statusCode: 500, body: JSON.stringify({ error: "Server configuration error." }) };
    }

    try {
        // In a production environment, you MUST validate the webhook signature.
        // This is a complex process and has been omitted here for brevity,
        // but it's crucial for security.
        
        const body = JSON.parse(event.body || '{}');
        
        // Process only payment-related webhooks
        if (body.type === 'payment') {
            const paymentId = body.data.id;
            console.log(`Received webhook for payment ID: ${paymentId}`);

            const client = new MercadoPagoConfig({ accessToken: MERCADO_PAGO_ACCESS_TOKEN });
            const payment = new Payment(client);
            const paymentInfo = await payment.get({ id: paymentId });
            
            if (paymentInfo && paymentInfo.external_reference) {
                const orderId = paymentInfo.external_reference;
                if (paymentInfo.status === 'approved') {
                    await updateOrderStatusInDb(orderId, 'Processing');
                } else if (['cancelled', 'rejected', 'refunded'].includes(paymentInfo.status || '')) {
                    await updateOrderStatusInDb(orderId, 'Cancelled');
                }
            } else {
                console.log(`Payment info for ID ${paymentId} does not contain an external_reference.`);
            }
        } else {
            console.log(`Received webhook of type ${body.type}, which is not processed.`);
        }
        
        // Acknowledge receipt of the webhook to Mercado Pago
        return { statusCode: 200, body: 'OK' };

    } catch (error: any) {
        console.error("Error processing webhook:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Webhook processing failed." }),
        };
    }
};

export { handler };
