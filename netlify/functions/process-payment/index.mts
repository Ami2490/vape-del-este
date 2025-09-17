// netlify/functions/process-payment/process-payment.mts

// Este es nuestro backend seguro. Se ejecuta en los servidores de Netlify.
import type { Handler } from "@netlify/functions";

// Definimos la estructura de datos que esperamos del frontend
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
  // Solo permitir peticiones POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Obtenemos el Access Token SECRETO desde las variables de entorno de Netlify
  const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!MERCADO_PAGO_ACCESS_TOKEN) {
    console.error("El Access Token de Mercado Pago no está configurado.");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "El procesador de pagos no está configurado correctamente." }),
    };
  }

  try {
    const formData = JSON.parse(event.body || "{}") as PaymentRequestBody;

    // Estos son los datos que enviaremos a la API de Mercado Pago
    const paymentData = {
      ...formData,
      description: "Compra en Vape del Este",
      statement_descriptor: "VAPEDELESTE",
    };
    
    // Hacemos la petición de pago real al servidor de Mercado Pago
    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Aquí usamos el Access Token SECRETO
        "Authorization": `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        "X-Idempotency-Key": Math.random().toString(36).substr(2, 9), // Previene pagos duplicados
      },
      body: JSON.stringify(paymentData),
    });

    const paymentResult = await response.json();

    if (!response.ok) {
      console.error("Error en la API de Mercado Pago:", paymentResult);
      throw new Error(paymentResult.message || "Error al procesar el pago");
    }

    // Enviamos el estado real del pago de vuelta al frontend
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: paymentResult.status,
        status_detail: paymentResult.status_detail,
        id: paymentResult.id,
      }),
    };
  } catch (error: any) {
    console.error("Error en la función process-payment:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Ocurrió un error interno en el servidor." }),
    };
  }
};

export { handler };