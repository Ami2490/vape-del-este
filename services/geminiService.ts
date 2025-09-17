
import { GoogleGenAI, Type, Chat } from "@google/genai";
// Corrected import paths for types and constants to be relative.
import type { AdvisorAnswers, Recommendation, Product } from '../types';

// The API key is obtained from the Vite environment variable VITE_API_KEY.
const ai = new GoogleGenAI({ apiKey: (import.meta as any).env.VITE_API_KEY });

const recommendationSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        productName: {
          type: Type.STRING,
          description: 'The exact name of the recommended product from the provided list.',
        },
        productType: {
          type: Type.STRING,
          description: 'The category of the product (e.g., "Pod Desechable").'
        },
        reasoning: {
          type: Type.STRING,
          description: 'A brief, user-friendly explanation of why this product is a good fit for the user, based on their answers. Max 25 words.'
        },
        imageUrl: {
          type: Type.STRING,
          description: 'The URL of the product image from the provided list.'
        }
      },
      required: ["productName", "productType", "reasoning", "imageUrl"],
    },
};

export const getVapingRecommendation = async (answers: AdvisorAnswers, products: Product[]): Promise<Recommendation[]> => {
    const productList = products.map(p => `- ${p.name} (Categoría: ${p.category}, Precio: ${p.price}, Features: ${p.features?.join(', ')}, Imagen: ${p.imageUrl})`).join('\n');
    
    const prompt = `
        Eres un experto asesor de vapeo para la tienda online "Vape del Este". Tu objetivo es recomendar 3 vapes desechables de nuestra lista que mejor se adapten a las necesidades del cliente.

        Aquí está la información del cliente:
        - Hábito de fumar: "${answers.smokingHabit}"
        - Objetivo con el vapeo: "${answers.vapingGoal}"
        - Preferencia de dispositivo: "${answers.preference}"

        Y aquí está nuestra lista de productos disponibles (todos son vapes desechables):
        ${productList}

        Basado en las respuestas del cliente, analiza sus necesidades y recomienda exactamente 3 productos de la lista.
        - Si el cliente fuma mucho o busca una experiencia fuerte, recomienda vapes con alto número de puffs (más de 15,000) y un nivel de nicotina estándar (5% o 50mg). Marcas como ELFBAR o IGNITE son buenas opciones.
        - Si el cliente busca dejar de fumar, es crucial recomendar el "BALI 12 K Nicotina Free" como primera opción, ya que es el único sin nicotina. Luego puedes sugerir otros con bajo nivel de nicotina como los de LOST MARY (3mg).
        - Si el cliente valora la variedad de sabores o características únicas, considera el "IGNITE BLACK SHEEP 20K DUAL TANK" (sabor dual) o el "Smart YOOZ".
        - Para cada recomendación, proporciona el nombre exacto del producto, su tipo/categoría, una breve razón de por qué es una buena elección para este cliente (máximo 25 palabras) y la URL de la imagen.
        
        Asegúrate de que los nombres de los productos y las URLs de las imágenes coincidan EXACTAMENTE con los de la lista proporcionada.
        Devuelve tu respuesta en formato JSON, siguiendo el esquema proporcionado.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: recommendationSchema,
            },
        });

        const jsonResponse = response.text;
        
        if (!jsonResponse) {
            throw new Error('No response from AI.');
        }

        const recommendations: Recommendation[] = JSON.parse(jsonResponse);
        
        if (!Array.isArray(recommendations) || recommendations.length === 0) {
          throw new Error('La IA no pudo generar recomendaciones. Inténtalo de nuevo.');
        }

        return recommendations;

    } catch (error) {
        console.error("Error getting recommendation from Gemini API:", error);
        throw new Error('Hubo un problema al contactar a nuestro asesor de IA. Por favor, inténtalo de nuevo más tarde.');
    }
};

const singleRecommendationSchema = {
    type: Type.OBJECT,
    properties: {
      productName: {
        type: Type.STRING,
        description: 'The exact name of the recommended product from the provided list.',
      },
      productType: {
        type: Type.STRING,
        description: 'The category of the product (e.g., "Pod Desechable").'
      },
      reasoning: {
        type: Type.STRING,
        description: 'A brief, user-friendly explanation of why this product would be a good addition to the user\'s cart. Max 25 words.'
      },
      imageUrl: {
        type: Type.STRING,
        description: 'The URL of the product image from the provided list.'
      }
    },
    required: ["productName", "productType", "reasoning", "imageUrl"],
};

export const getUpsellSuggestion = async (cartItems: {name: string}[], availableProducts: Product[]): Promise<Recommendation | null> => {
    const cartProductNames = cartItems.map(item => item.name);
    // Filter out products already in the cart
    const potentialProducts = availableProducts.filter(p => !cartProductNames.includes(p.name));
    if (potentialProducts.length === 0) {
        return null; // No products to recommend
    }
    const potentialProductList = potentialProducts.map(p => `- ${p.name} (Categoría: ${p.category}, Precio: ${p.price}, Features: ${p.features?.join(', ')}, Imagen: ${p.imageUrl})`).join('\n');
    const cartList = cartProductNames.join(', ') || 'El carrito está vacío';

    const prompt = `
        Eres un experto asesor de ventas para la tienda online "Vape del Este". Tu objetivo es sugerir UN producto adicional que complemente los artículos que el cliente ya tiene en su carrito.

        Contenido del carrito del cliente:
        - ${cartList}

        Lista de productos disponibles para recomendar (excluyendo los que ya están en el carrito):
        ${potentialProductList}

        Analiza el carrito y sugiere UN solo producto de la lista de disponibles que sea una buena venta adicional o cruzada.
        - Si el carrito contiene un kit recargable, sugiere un líquido (sales de nicotina o base libre).
        - Si el carrito contiene solo líquidos, sugiere unas resistencias compatibles (ej. Vaporesso GTX) o una batería.
        - Si el carrito contiene pods desechables, sugiere otro sabor popular de una marca similar o un accesorio.
        - Si el carrito ya tiene una buena combinación, recomienda un producto popular de una categoría diferente, como las bolsitas de nicotina ZYN, para probar algo nuevo.
        - No recomiendes un producto que ya está en el carrito.

        Para tu recomendación, proporciona el nombre exacto del producto, su tipo/categoría, una breve razón de por qué es una buena elección (máximo 25 palabras) y la URL de la imagen.
        Asegúrate de que los nombres de los productos y las URLs de las imágenes coincidan EXACTAMENTE con los de la lista proporcionada.
        Devuelve tu respuesta en formato JSON, siguiendo el esquema proporcionado. Si no encuentras una buena recomendación, devuelve un JSON vacío {}.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: singleRecommendationSchema,
            },
        });

        const jsonResponse = response.text;
        
        if (!jsonResponse || jsonResponse.trim() === '{}' || jsonResponse.trim() === '') {
            console.log("AI returned no suggestion.");
            return null;
        }

        const recommendation: Recommendation = JSON.parse(jsonResponse);
        
        if (!recommendation.productName) {
            console.log("AI returned an invalid suggestion object.");
            return null;
        }

        return recommendation;

    } catch (error) {
        console.error("Error getting upsell suggestion from Gemini API:", error);
        // Don't throw, just return null so the UI can handle it gracefully.
        return null;
    }
};

export const startChat = (products: Product[]): Chat => {
    const productList = products.map(p => `- ${p.name} (Categoría: ${p.category}, Precio: ${p.price})`).join('\n');

    const systemInstruction = `
        Eres un amigable y experto asistente de ventas para "Vape del Este", una tienda online de vapes en Uruguay. Tu nombre es 'EsteBot'.
        Tu objetivo es ayudar a los clientes con sus preguntas sobre productos, envíos, y dar recomendaciones.
        
        Información Clave de la Tienda:
        - Edad mínima para comprar: 18 años.
        - Envíos: A todo Uruguay, costos y tiempos varían.
        - Pagos: Aceptamos tarjetas y transferencias (actualmente es una simulación).
        - Productos disponibles:
        ${productList}

        Reglas de Conversación:
        1. Sé siempre amable, profesional y usa un tono cercano. Usa emojis apropiados para hacer la conversación más amigable.
        2. Mantén tus respuestas concisas y fáciles de entender.
        3. Si no sabes una respuesta, sé honesto y sugiere hablar con un humano.
        4. No des consejos médicos ni de salud.
        
        Regla de Traspaso a Humano (MUY IMPORTANTE):
        Si el cliente expresa frustración, pregunta por un problema con un pedido específico, o pide explícitamente hablar con una persona ("hablar con un humano", "necesito ayuda de una persona", etc.), debes iniciar el proceso de traspaso.
        Para hacerlo, primero resume cortésmente la consulta del cliente en una frase. Luego, OBLIGATORIAMENTE, termina tu mensaje con el token especial: [HANDOFF]
        
        Ejemplo de traspaso:
        Cliente: "Mi pedido no ha llegado y estoy molesto."
        Tu respuesta: "Entiendo tu frustración con el pedido. Un miembro de nuestro equipo te ayudará a resolverlo de inmediato. He preparado un resumen de tu consulta para que no tengas que repetirte. 👍 [HANDOFF]"
        
        Ejemplo de conversación normal:
        Cliente: "Hola, ¿tienen vapes sin nicotina?"
        Tu respuesta: "¡Hola! 👋 Claro que sí. Tenemos el 'BALI 12 K Nicotina Free', que es una excelente opción sin nada de nicotina. ¿Te gustaría saber más sobre él?"
    `;

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
    });

    return chat;
};