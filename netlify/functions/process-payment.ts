// This file is our secure backend.
// It runs on Netlify's servers, not in the user's browser.

import type { Handler } from "@netlify/functions";

// Define the structure of the data we expect from the frontend
interface PaymentRequestBody {
  token: string;
  issuer_id: string;
  payment_method_id: string;
  transaction_amount: number;
  installments: number;
  payer: {
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
}

const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Get the secret Access Token from Netlify's environment variables
  const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!MERCADO_PAGO_ACCESS_TOKEN) {
    console.error("Mercado Pago Access Token is not configured.");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "El procesador de pagos no está configurado correctamente." }),
    };
  }

  try {
    const formData = JSON.parse(event.body || "{}") as PaymentRequestBody;

    // Log received data for debugging (without sensitive info)
    console.log(`Processing payment for amount: ${formData.transaction_amount} with payment method: ${formData.payment_method_id}`);

    // This is the data we send to Mercado Pago's API
    const paymentData = {
      ...formData,
      description: "Compra en Vape del Este",
      statement_descriptor: "VAPEDELESTE",
    };
    
    // Make the actual payment request to Mercado Pago's server
    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Here we use the SECRET Access Token
        "Authorization": `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        "X-Idempotency-Key": Math.random().toString(36).substring(2, 11), // Prevents duplicate payments
      },
      body: JSON.stringify(paymentData),
    });

    const paymentResult = await response.json();

    if (!response.ok) {
      // Log the full error from Mercado Pago for debugging on the server
      console.error("Mercado Pago API error:", JSON.stringify(paymentResult, null, 2));
      
      // Create a more descriptive error message for the frontend
      const cause = paymentResult.cause?.[0];
      const errorMessage = cause ? `Error ${cause.code}: ${cause.description}` : (paymentResult.message || "Error al procesar el pago. Revisa los datos de la tarjeta.");
      
      throw new Error(errorMessage);
    }

    // Send the real status back to the frontend
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: paymentResult.status,
        status_detail: paymentResult.status_detail,
        id: paymentResult.id,
      }),
    };
  } catch (error: any) {
    console.error("Error in process-payment function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Ocurrió un error interno en el servidor." }),
    };
  }
};

export { handler };