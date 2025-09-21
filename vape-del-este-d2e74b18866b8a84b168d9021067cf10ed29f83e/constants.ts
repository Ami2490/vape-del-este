// Corrected import path for types to be a relative path.
import type { Product, NavLink, Review } from './types';

export const allProducts: Product[] = [
  // Pods Desechables (existentes)
  {
    id: 1,
    name: 'BALI 12 K Nicotina Free',
    category: 'Pod Desechable',
    price: '$U 1.450',
    stock: 50,
    imageUrl: 'https://static.wixstatic.com/media/597880_0cc6d090c2c0424495599a8cae70b9c7~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg',
    description: 'Los vapers Bali sin nicotina, como el modelo de 12k, han recibido diversas opiniones en cuanto a su duración y sabor. Generalmente, los usuarios los consideran una opción atractiva debido a su variedad de sabores y la comodidad de ser desechables.',
    features: ['Puffs: 12,000', 'Nicotina: 0%', 'Sabor: Varios']
  },
  {
    id: 2,
    name: 'ELFBAR 14k Touch',
    category: 'Pod Desechable',
    price: '$U 1.100',
    stock: 75,
    imageUrl: 'https://static.wixstatic.com/media/597880_18bbca73b77d41e6bd63a5dcae35077f~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    description: 'El Elf Bar 14K Touch es un vape desechable que ofrece hasta 14,000 inhalaciones (puffs) y viene con una variedad de sabores. Cuenta con una capacidad de e-líquido de 14 ml, una concentración de nicotina de 50mg/ml, una batería de 620 mAh y carga tipo C.',
    features: ['Puffs: 14,000', 'Nicotina: 50mg/ml', 'Líquido: 14ml'],
    reviews: [
        {
            id: '1',
            author: 'Carlos V.',
            avatar: 'https://ui-avatars.com/api/?name=Carlos+V&background=8e44ad&color=FFFFFF',
            rating: 5,
            comment: '¡Increíble duración y el sabor es espectacular! La pantalla táctil es un plus que no esperaba. Muy recomendado.',
            date: '12/08/2024'
        },
        {
            id: '2',
            author: 'Ana G.',
            avatar: 'https://ui-avatars.com/api/?name=Ana+G&background=3498db&color=FFFFFF',
            rating: 4,
            comment: 'Buen producto, dura bastante. El sabor de sandía es mi favorito. Le doy 4 estrellas porque el diseño podría ser un poco más compacto.',
            date: '10/08/2024'
        }
    ]
  },
  {
    id: 3,
    name: 'ELFBAR 20.000 TOUCH',
    category: 'Pod Desechable',
    price: '$U 1.300',
    stock: 80,
    imageUrl: 'https://static.wixstatic.com/media/597880_d6fda2d7a4dd464aab7bc8c1e6da87cf~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    description: 'Vape descartable y enchufable. Contiene 5 mg de nicotina. Se trata de un producto muy moderno, mundialmente conocido por la calidad de sus sabores intensos. Brinda una sensación de mucho humo con una duración extensa.',
    features: ['Puffs: 20,000', 'Nicotina: 5mg', 'Sabor: Varios']
  },
  {
    id: 4,
    name: 'ELFBAR 40K ICE KING',
    category: 'Pod Desechable',
    price: '$U 1.800',
    stock: 30,
    imageUrl: 'https://static.wixstatic.com/media/597880_dff362317e884e5aab39f43dc40efa6a~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    description: 'El Elfbar 40K es un dispositivo de vapeo que se destaca por su duración, ofreciendo hasta 40,000 inhalaciones. Algunas versiones, como el Ice King, presentan niveles ajustables de frescor. Cuenta con una batería recargable de 850 mAh para un rendimiento duradero.',
    features: ['Puffs: 40,000', 'Nicotina: 5%', 'Sabor: Ice']
  },
  {
    id: 5,
    name: 'ELFBAR GH 23.000 PUFFS',
    category: 'Pod Desechable',
    price: '$U 1.400',
    stock: 45,
    imageUrl: 'https://static.wixstatic.com/media/597880_7360d8d2ca754f09b284a38298e8b1a2~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg',
    description: 'Vape descartable y enchufable. Contiene 5 mg de nicotina. Se trata de un producto muy moderno, mundialmente conocido por la calidad de sus sabores intensos. Brinda una sensación de mucho humo con una duración extensa.',
    features: ['Puffs: 23,000', 'Nicotina: 5mg', 'Sabor: Varios']
  },
  {
    id: 6,
    name: 'IGNITE BLACK SHEEP 20K DUAL TANK',
    category: 'Pod Desechable',
    price: '$U 1.500',
    stock: 60,
    imageUrl: 'https://static.wixstatic.com/media/597880_3010e4e6561c4a179418864a4e06a887~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpeg',
    description: 'Revoluciona tu experiencia de vapeo. Con una función única que te permite cambiar el sabor del dispositivo a tu gusto, este producto se adapta a tus preferencias en cada inhalación.',
    features: ['Puffs: 20,000', 'Nicotina: 5%', 'Sabor: Dual']
  },
  {
    id: 7,
    name: 'IGNITE SEX ADDICT S280 28.000 Puff',
    category: 'Pod Desechable',
    price: '$U 1.600',
    stock: 25,
    imageUrl: 'https://static.wixstatic.com/media/597880_e8ed757e33b04fd7a92800de368619c0~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    description: 'Vaper "Sex Addict" con un diseño moderno y atractivo. Ofrece una variedad de sabores, siendo el "Grape Kiwi Ice" uno de los más populares. Con una capacidad de hasta 28,000 inhalaciones, es ideal para quienes buscan un dispositivo de larga duración.',
    features: ['Puffs: 28,000', 'Nicotina: 5%', 'Sabor: Grape Kiwi Ice']
  },
  {
    id: 8,
    name: 'IGNITE V120 12.000 Puff',
    category: 'Pod Desechable',
    price: '$U 1.200',
    stock: 90,
    imageUrl: 'https://static.wixstatic.com/media/597880_276112ba1e17430faaf3773a76556d35~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    description: 'El Ignite V120 es el dispositivo especialmente premium más nuevo, basado en el famoso v80 pero ahora con pantalla, diseñado para ofrecer una experiencia de vapeo duradera y de alto rendimiento. Con unas impresionantes 12,000 caladas, es perfecto para quienes buscan comodidad y potencia.',
    features: ['Puffs: 12,000', 'Nicotina: 5%', 'Sabor: Varios']
  },
  {
    id: 9,
    name: 'IGNITE V150 15.000 Puff',
    category: 'Pod Desechable',
    price: '$U 1.400',
    stock: 85,
    imageUrl: 'https://static.wixstatic.com/media/597880_3a86e5f532064b2bb413a3269d25ba33~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    description: 'Ignite V150 Premium Pod. Diseñado para una experiencia de vapeo excepcional, este pod ofrece una concentración del 5% de nicotina. Su diseño elegante y compacto lo convierte en el compañero perfecto, mientras que su batería de larga duración garantiza hasta 15,000 inhalaciones por pod.',
    features: ['Puffs: 15,000', 'Nicotina: 5%', 'Sabor: Varios']
  },
  {
    id: 10,
    name: 'IGNITE V250 25.000 Puff',
    category: 'Pod Desechable',
    price: '$U 1.600',
    stock: 40,
    imageUrl: 'https://static.wixstatic.com/media/597880_1ee929428e0d4d4785b5e6a1dd2aed13~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    description: 'Pod descartable Ignite V250 Potencia y practicidad para sesiones largas! Diseñado pensando en la ligereza y la portabilidad, el Ignite V250 impresiona por su capacidad de hasta 25.000 caladas.',
    features: ['Puffs: 25,000', 'Nicotina: 5%', 'Sabor: Varios']
  },
  {
    id: 11,
    name: 'KIT LIFE PODS',
    category: 'Pod Desechable',
    price: '$U 1.200',
    stock: 55,
    imageUrl: 'https://static.wixstatic.com/media/597880_2e00803783ed420d97498c27abad5a26~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    description: 'El dispositivo tiene una batería recargable. Los cartuchos desechables brindan hasta 10000 puff con diferentes sabores disponibles para reemplazar.',
    features: ['Puffs: 10,000', 'Nicotina: 5%', 'Sabor: Varios']
  },
  {
    id: 12,
    name: 'Life Pod 10K',
    category: 'Pod Desechable',
    price: '$U 900',
    stock: 120,
    imageUrl: 'https://static.wixstatic.com/media/597880_87957c1f9d524b74b1348af956ba0f89~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    description: 'Este sistema de vapeo cuenta con un pod cerrado que permite aproximadamente 10,000 caladas y tiene una capacidad de 15 ml, con una concentración de 5% de sal de nicotina (50 mg/ml).',
    features: ['Puffs: 10,000', 'Nicotina: 5%', 'Líquido: 15ml']
  },
  {
    id: 13,
    name: 'LIFE PODS 10K (B)',
    category: 'Pod Desechable',
    price: '$U 800',
    stock: 150,
    imageUrl: 'https://static.wixstatic.com/media/597880_ef4b2e72b7734fb7a7d2fda19155a60d~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    description: '(No se encontró descripción).',
    features: ['Puffs: 10,000', 'Nicotina: 5%', 'Sabor: Varios']
  },
  {
    id: 14,
    name: 'Life Pod 8000',
    category: 'Pod Desechable',
    price: '$U 700',
    stock: 0,
    imageUrl: 'https://static.wixstatic.com/media/597880_87957c1f9d524b74b1348af956ba0f89~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    description: 'El Life Pod 8000 es un sistema de vapeo que ofrece una gran variedad de sabores. Este dispositivo cuenta con un pod cerrado que permite aproximadamente 8,000 caladas y tiene una capacidad de 15 ml, con una concentración de 5% de sal de nicotina (50 mg/ml).',
    features: ['Puffs: 8,000', 'Nicotina: 5%', 'Líquido: 15ml']
  },
  {
    id: 15,
    name: 'LOST ANGEL 20K',
    category: 'Pod Desechable',
    price: '$U 1.200',
    stock: 65,
    imageUrl: 'https://static.wixstatic.com/media/597880_fffa2dcb7ac2466ca795797131e9c5c9~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    description: 'El Lost Angel Pro Max 20,000 Puffs es un dispositivo de vapeo desechable de alto rendimiento. Batería Recargable. Bobinas de malla doble para un sabor y una salida de vapor superiores.',
    features: ['Puffs: 20,000', 'Nicotina: 5%', 'Líquido: 16ml']
  },
  {
    id: 16,
    name: 'LOST MARY 10.000 Puff',
    category: 'Pod Desechable',
    price: '$U 1.200',
    stock: 70,
    imageUrl: 'https://static.wixstatic.com/media/597880_9972908517f34ad6948273daefad10f9~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg',
    description: 'Vape descartable y enchufable. Contiene 3 mg nicotina. Se trata de un aparato estéticamente hermoso, muy practico ofreciendo un sinfín de sabores todos ellos muy intensos y disfrutables. Su pequeño tamaño lo hace muy versátil.',
    features: ['Puffs: 10,000', 'Nicotina: 3mg', 'Sabor: Varios']
  },
  {
    id: 17,
    name: 'LOST MARY 20.000 Puff',
    category: 'Pod Desechable',
    price: '$U 1.400',
    stock: 50,
    imageUrl: 'https://static.wixstatic.com/media/597880_68a13c0f241c4087a7c08a34b54bdbf9~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    description: 'Vape descartable y enchufable. Contiene 3 mg nicotina. Su pequeño tamaño lo hace muy versátil para tenerlo siempre a mano cuando nos den ganas de disfrutar de un vapeo de calidad.',
    features: ['Puffs: 20,000', 'Nicotina: 3mg', 'Sabor: Varios']
  },
  {
    id: 18,
    name: 'LOST MARY MIXER 30K DUAL',
    category: 'Pod Desechable',
    price: '$U 1.600',
    stock: 35,
    imageUrl: 'https://static.wixstatic.com/media/597880_f29d94aea3ef4f6b99a4e61f9bd37f26~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    description: 'Lost Mary Mixer 30K es un vape desechable de larga duración que ofrece un sistema de doble sabor, permitiendo combinar opciones como cereza y limón. Contiene nicotina de sal al 5% (50 mg/ml) y posee una batería recargable.',
    features: ['Puffs: 30,000', 'Nicotina: 5%', 'Sabor: Dual']
  },
  {
    id: 19,
    name: 'OXBAR 30.000 Puffs',
    category: 'Pod Desechable',
    price: '$U 1.400',
    stock: 40,
    imageUrl: 'https://static.wixstatic.com/media/597880_1c0c2ed5980e42968281876167a02a68~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg',
    description: 'Se trata de un dispositivo de vapeo descartable y enchufable. Contiene 5 mg de nicotina. Un producto que ofrece una duración extrema con 30000 bocanadas. Su diseño con indicadores electrónicos es realmente atractivo y moderno.',
    features: ['Puffs: 30,000', 'Nicotina: 5mg', 'Sabor: Varios']
  },
  {
    id: 20,
    name: 'OXBAR MAGIC SU 10.000 Puffs',
    category: 'Pod Desechable',
    price: '$U 1.100',
    stock: 60,
    imageUrl: 'https://static.wixstatic.com/media/597880_71551d2b90f7446d8aeea627cf15ffc7~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg',
    description: 'Se trata de un dispositivo de vapeo descartable y enchufable. Contiene 5 mg de nicotina. Su diseño con indicadores electrónicos es realmente atractivo y moderno. Ofrece 15 sabores diferentes.',
    features: ['Puffs: 10,000', 'Nicotina: 5mg', 'Sabor: Varios']
  },
  {
    id: 21,
    name: 'Phennom 6 MG THC+A. Hongos',
    category: 'Pod Desechable',
    price: '$U 3.600',
    stock: 8,
    imageUrl: 'https://static.wixstatic.com/media/597880_6a949550fb6b4c34b16bfef41ea79a55~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    description: '(No se encontró descripción).',
    features: ['Puffs: 6,000', 'Nicotina: THC', 'Sabor: N/A']
  },
  {
    id: 22,
    name: 'PHENNOM 6000 MG',
    category: 'Pod Desechable',
    price: '$U 2.900',
    stock: 20,
    imageUrl: 'https://static.wixstatic.com/media/597880_9c80d4ea16194815b93cf019355f7b23~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp',
    description: '(No se encontró descripción).',
    features: ['Puffs: 6,000', 'Nicotina: THC', 'Sabor: N/A']
  },
  {
    id: 23,
    name: 'PHENNOM 8000 MG',
    category: 'Pod Desechable',
    price: '$U 3.400',
    stock: 18,
    imageUrl: 'https://static.wixstatic.com/media/597880_6fd780cbff834ad0ba0ae1a94cc0727d~mv2.webp/v1/fit/w_500,h_500,q_90/file.webp',
    description: '(No se encontró descripción).',
    features: ['Puffs: 8,000', 'Nicotina: THC', 'Sabor: N/A']
  },
  {
    id: 24,
    name: 'Smart YOOZ',
    category: 'Pod Desechable',
    price: '$U 1.400',
    stock: 5,
    imageUrl: 'https://static.wixstatic.com/media/597880_a54b2d316d574f059f76c7eeac8c527a~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    description: 'Nueva tecnología, SMART YOOZ. Podrás recibir llamadas, jugar y vapear al mismo tiempo.',
    features: ['Puffs: 10,000', 'Nicotina: 5%', 'Sabor: Varios']
  },

  // Vaporizadores Recargables (Nuevos)
  {
    id: 25,
    name: 'ELFBAR Kit Recargable BC10000',
    category: 'Kit Recargable',
    price: '$U 2.100',
    stock: 40,
    imageUrl: 'https://vapepy.com/wp-content/uploads/2023/10/elf-bar-bc10000-disposable-vape-device-my-vpro.jpg',
    description: 'Kit de inicio recargable de ELFBAR. Combina la comodidad de los pods con la sostenibilidad de una batería recargable. Potencia y sabor constantes.',
    features: ['Batería: 650mAh', 'Tipo: Pod System', 'Carga: USB-C'],
    reviews: [
        {
            id: '3',
            author: 'Martín R.',
            avatar: 'https://ui-avatars.com/api/?name=Martin+R&background=2980b9&color=FFFFFF',
            rating: 5,
            comment: 'Excelente alternativa a los desechables. La batería dura todo el día y el sabor es muy puro. El diseño es muy cómodo.',
            date: '05/09/2024'
        }
    ]
  },
  {
    id: 26,
    name: 'LOST MARY Kit Recargable MT15000',
    category: 'Kit Recargable',
    price: '$U 2.350',
    stock: 35,
    imageUrl: 'https://www.lostmary.com/storage/images/product/1703054178_MT15000_TURBO_KV_PC.png',
    description: 'El kit recargable de Lost Mary ofrece un diseño elegante y una experiencia de vapeo superior. Batería de larga duración y pods intercambiables de sabores intensos.',
    features: ['Batería: 1100mAh', 'Tipo: Pod System', 'Potencia: Ajustable']
  },
  {
    id: 27,
    name: 'IGNITE Kit Recargable ONE',
    category: 'Kit Recargable',
    price: '$U 1.900',
    stock: 50,
    imageUrl: 'https://vape-smart.com/wp-content/uploads/2022/02/Ignite-One-Rechargeable-Vape-Pen-Device.jpg',
    description: 'El sistema de pods recargables de IGNITE es la opción perfecta para quienes buscan estilo y rendimiento. Activación por calada y carga rápida.',
    features: ['Batería: 400mAh', 'Tipo: Pod System', 'Material: Aluminio']
  },
  {
    id: 28,
    name: 'PHENOM Kit Recargable Pro',
    category: 'Kit Recargable',
    price: '$U 2.800',
    stock: 25,
    imageUrl: 'https://cdn.shopify.com/s/files/1/0553/7978/4983/products/product-image-1961556019_1024x1024.jpg?v=1646294717',
    description: 'Un kit avanzado para entusiastas. El Phenom Pro ofrece control de temperatura, pantalla OLED y una construcción robusta para una experiencia de vapeo personalizada.',
    features: ['Batería: 1500mAh', 'Tipo: Mod-Pod', 'Pantalla: OLED']
  },

  // Otros Insumos (Nuevos)
  {
    id: 29,
    name: 'Baterías Samsung 25R (Par)',
    category: 'Batería',
    price: '$U 950',
    stock: 100,
    imageUrl: 'https://www.18650batterystore.com/cdn/shop/products/Samsung-25R-18650-Battery-2-scaled_1024x1024.jpg?v=1614713745',
    description: 'Par de baterías Samsung 25R 18650, reconocidas por su fiabilidad y rendimiento. Ideales para mods electrónicos que requieren alta descarga.',
    features: ['Capacidad: 2500mAh', 'Tipo: 18650', 'Descarga: 20A']
  },
  {
    id: 30,
    name: 'Salt Nicotina 30ml (Varios Sabores)',
    category: 'Líquido',
    price: '$U 650',
    stock: 200,
    imageUrl: 'https://i.ebayimg.com/images/g/Vw4AAOSw~NBk~t1k/s-l1200.webp',
    description: 'E-líquido de sales de nicotina de 30ml. Disponible en concentraciones de 25mg y 50mg. Elige tu sabor favorito para una experiencia suave y satisfactoria.',
    features: ['Volumen: 30ml', 'Tipo: Sales de Nicotina', 'Sabores: Frutales, Mentolados']
  },
  {
    id: 31,
    name: 'Líquido Free Base 60ml (Varios Sabores)',
    category: 'Líquido',
    price: '$U 750',
    stock: 180,
    imageUrl: 'https://images-cdn.ubuy.co.in/634d1059f0e1394a1f1e1a5a-sadboy-e-liquid-ejuice-60ml-100ml.jpg',
    description: 'E-líquido de base libre en botella de 60ml. Perfecto para grandes nubes de vapor. Disponible en 0mg, 3mg y 6mg de nicotina.',
    features: ['Volumen: 60ml', 'Tipo: Base Libre', 'VG/PG: 70/30']
  },
  {
    id: 32,
    name: 'Resistencias Vaporesso GTX (Pack 5)',
    category: 'Accesorio',
    price: '$U 800',
    stock: 150,
    imageUrl: 'https://www.vaporesso.com/uploads/images/product/gtx-coils-1.jpg',
    description: 'Pack de 5 resistencias de malla Vaporesso GTX. Compatibles con una amplia gama de dispositivos para un sabor puro y una producción de vapor densa.',
    features: ['Tipo: Malla', 'Cantidad: 5 unidades', 'Compatibilidad: Vaporesso']
  },
  {
    id: 33,
    name: 'Bolsitas de Nicotina ZYN (Cool Mint)',
    category: 'Insumo',
    price: '$U 450',
    stock: 300,
    imageUrl: 'https://www.northerner.com/uploads/images/product/main_image/2358/large_webp_ZYN_Cool_Mint_6mg_strong.webp',
    description: 'Lata de bolsitas de nicotina ZYN sabor menta. Una alternativa sin humo y sin vapor para disfrutar de la nicotina de forma discreta.',
    features: ['Sabor: Cool Mint', 'Concentración: 6mg', 'Cantidad: 15 bolsitas']
  },
  {
    id: 34,
    name: 'Chicles de Nicotina (4mg)',
    category: 'Insumo',
    price: '$U 550',
    stock: 250,
    imageUrl: 'https://www.zonaglobal.com.uy/wp-content/uploads/2022/11/nicorette-freshfruit-gums-4mg-30-unidades.jpg',
    description: 'Chicles de nicotina para ayudar a controlar la ansiedad. Una herramienta efectiva para quienes buscan reducir o dejar el consumo de tabaco.',
    features: ['Concentración: 4mg', 'Uso: Terapia de reemplazo', 'Cantidad: 24 unidades']
  },
  {
    id: 35,
    name: 'Tabaco para Narguille Al Fakher (50g)',
    category: 'Insumo',
    price: '$U 350',
    stock: 400,
    imageUrl: 'https://www.distribuidorajm.com/wp-content/uploads/2021/04/menta.png',
    description: 'Tabaco de 50g para Narguille de la reconocida marca Al Fakher. Sabor intenso y humo denso para una sesión perfecta. Varios sabores disponibles.',
    features: ['Marca: Al Fakher', 'Peso: 50g', 'Origen: Emiratos Árabes']
  }
];

export const categoryNavLinks: NavLink[] = [
    { name: 'Tienda', href: '#shop' },
    { 
        name: 'Marcas', 
        href: '#',
        megaMenu: [
            {
                title: 'Principales Marcas',
                filterType: 'brand',
                links: [
                    { name: 'BALI', href: '#', filterValue: 'BALI' },
                    { name: 'ELFBAR', href: '#', filterValue: 'ELFBAR' },
                    { name: 'IGNITE', href: '#', filterValue: 'IGNITE' },
                    { name: 'LIFE POD', href: '#', filterValue: 'LIFE' },
                    { name: 'LOST ANGEL', href: '#', filterValue: 'LOST ANGEL' },
                    { name: 'LOST MARY', href: '#', filterValue: 'LOST MARY' },
                    { name: 'OXBAR', href: '#', filterValue: 'OXBAR' },
                    { name: 'Phennom', href: '#', filterValue: 'Phennom' },
                    { name: 'YOOZ', href: '#', filterValue: 'YOOZ' },
                ]
            }
        ]
    },
    { 
        name: 'Vaporizadores Descartables', 
        href: '#',
        isFilter: true,
        filterValue: 'Pod Desechable',
        filterType: 'category'
    },
    { 
        name: 'Vaporizadores Recargables / Otros', 
        href: '#',
        megaMenu: [
            {
                title: 'Kits y Equipos',
                filterType: 'category',
                links: [
                    { name: 'Kits Recargables', href: '#', filterValue: 'Kit Recargable' },
                ]
            },
            {
                title: 'Insumos y Accesorios',
                filterType: 'category',
                links: [
                    { name: 'Líquidos', href: '#', filterValue: 'Líquido' },
                    { name: 'Baterías', href: '#', filterValue: 'Batería' },
                    { name: 'Resistencias y Accesorios', href: '#', filterValue: 'Accesorio' },
                    { name: 'Otros Insumos', href: '#', filterValue: 'Insumo' },
                ]
            }
        ]
    },
    { name: 'Preguntas Frecuentes', href: '#faq' },
];

export const socialLinks = {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    pinterest: 'https://pinterest.com',
};