import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

const preference = new Preference(client);

export async function handler(event: any) {
  try {
    const result = await preference.create({
      body: {
        items: [
          {
            title: 'Producto Vape',
            quantity: 1,
            unit_price: 1000,
          },
        ],
        back_urls: {
          success: 'https://friendly-sundae-cccb6b.netlify.app/success',
          failure: 'https://friendly-sundae-cccb6b.netlify.app/failure',
          pending: 'https://friendly-sundae-cccb6b.netlify.app/pending',
        },
        auto_return: 'approved',
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ init_point: result.init_point }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
