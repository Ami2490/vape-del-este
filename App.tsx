import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { FeaturedGrid } from './components/FeaturedGrid';
import { VapingAdvisor } from './components/VapingAdvisor';
import { Shop } from './components/Shop';
import { Footer } from './components/Footer';
import { AgeVerificationModal } from './components/AgeVerificationModal';
import { CartSidebar } from './components/CartSidebar';
import { LoginModal } from './components/LoginModal';
import { RegisterModal } from './components/RegisterModal';
import { ProfilePage } from './components/ProfilePage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmationPage } from './components/OrderConfirmationPage';
import { IntroAnimation } from './components/IntroAnimation';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ChatbotWidget } from './components/ChatbotWidget';
import { UpsellModal } from './components/UpsellModal';
import { CartProvider, useCart } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { allProducts as initialProducts } from './constants';
import { getProducts, seedProducts, updateProduct } from './services/productService';
import type { Product, Order, Review } from './types';

type View = 'shop' | 'checkout' | 'confirmation' | 'profile' | 'adminLogin' | 'adminPanel';
type AuthModal = 'login' | 'register' | null;

const faqData = [
  {
    question: '¿Cuál es la edad mínima para comprar?',
    answer: 'Debes tener 18 años o más para comprar cualquiera de nuestros productos. Realizamos una verificación de edad en la entrada del sitio y nos reservamos el derecho de solicitar una identificación adicional.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Actualmente, el proceso de pago es una simulación. Aceptamos tarjetas de crédito/débito, transferencias bancarias y Mercado Pago de forma simulada para que puedas probar el flujo de compra.',
  },
  {
    question: '¿Realizan envíos a todo el país?',
    answer: 'Sí, realizamos envíos a todo el Uruguay. Los costos y tiempos de entrega pueden variar según tu ubicación. Esta información se detallará durante el proceso de compra (actualmente simulado).',
  },
  {
    question: '¿Cuál es la diferencia entre un Pod Desechable y un Kit Recargable?',
    answer: 'Los Pods Desechables son de un solo uso; vienen precargados con líquido y una batería no recargable. Son ideales por su comodidad. Los Kits Recargables tienen una batería que se recarga y utilizan pods o tanques que puedes rellenar con el líquido de tu elección, siendo una opción más económica y ecológica a largo plazo.',
  },
  {
    question: '¿Qué son las sales de nicotina?',
    answer: 'Las sales de nicotina son una forma de nicotina que se encuentra naturalmente en la hoja de tabaco. Permiten una absorción más rápida y suave en el cuerpo en comparación con la nicotina de "base libre" tradicional, lo que las hace populares en dispositivos de baja potencia para una sensación similar a la de un cigarrillo.',
  },
  {
    question: '¿Tienen opciones sin nicotina?',
    answer: '¡Sí! Contamos con opciones como el "BALI 12 K Nicotina Free" que no contienen nicotina. Son perfectos para quienes buscan disfrutar del sabor y la experiencia del vapeo sin nicotina, o para quienes están en la etapa final de dejar de fumar.',
  },
];

const FaqItem: React.FC<{ faq: { question: string, answer: string }, isOpen: boolean, onClick: () => void }> = ({ faq, isOpen, onClick }) => (
  <div className="border-b border-gray-700">
    <h2>
      <button
        type="button"
        className="flex justify-between items-center w-full p-6 text-left font-semibold text-white hover:bg-gray-800"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span>{faq.question}</span>
        <svg
          className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
    </h2>
    <div
      className={`grid grid-rows-[0fr] transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : ''}`}
    >
      <div className="overflow-hidden">
        <div className="p-6 pt-0 text-gray-400">
          {faq.answer}
        </div>
      </div>
    </div>
  </div>
);

const Faq: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="container mx-auto px-6">
            <h2 className="text-4xl font-black text-center mb-10 text-white uppercase">Preguntas Frecuentes</h2>
            <div className="max-w-3xl mx-auto bg-dark-primary rounded-lg shadow-lg border border-gray-700">
                {faqData.map((faq, index) => (
                    <FaqItem 
                        key={index} 
                        faq={faq} 
                        isOpen={openIndex === index} 
                        onClick={() => handleToggle(index)}
                    />
                ))}
            </div>
        </div>
    );
};


const AppContent: React.FC = () => {
    const [isAgeVerified, setIsAgeVerified] = useState(localStorage.getItem('ageVerified') === 'true');
    const [showIntro, setShowIntro] = useState(!isAgeVerified);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isUpsellModalOpen, setIsUpsellModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState<View>('shop');
    const [authModal, setAuthModal] = useState<AuthModal>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    
    const [whatsappClickCount, setWhatsappClickCount] = useState(0);
    const whatsappClickTimer = useRef<number | null>(null);

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [brandFilter, setBrandFilter] = useState<string | null>(null);
    const [priceFilter, setPriceFilter] = useState<number>(4000);

    const { isAuthenticated, user, addOrder } = useAuth();
    const { cart, totalPrice, addToCart } = useCart();
    
    const fetchProducts = useCallback(async () => {
        setIsLoadingProducts(true);
        try {
            let productsFromDb = await getProducts();
            if (productsFromDb.length === 0) {
                console.log("Database is empty. Seeding with initial products...");
                await seedProducts(initialProducts);
                productsFromDb = await getProducts();
            }
            setProducts(productsFromDb);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsLoadingProducts(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        if (!isAgeVerified || showIntro) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isAgeVerified, showIntro]);
    
    const handleWhatsAppSecretClick = () => {
        if (whatsappClickTimer.current) {
            clearTimeout(whatsappClickTimer.current);
        }

        const newCount = whatsappClickCount + 1;
        setWhatsappClickCount(newCount);

        if (newCount === 5) {
            setCurrentView('adminLogin');
            setWhatsappClickCount(0);
        } else {
            whatsappClickTimer.current = window.setTimeout(() => {
                setWhatsappClickCount(0); 
            }, 2000);
        }
    };

    const handleAgeVerify = () => {
        localStorage.setItem('ageVerified', 'true');
        setIsAgeVerified(true);
    };
    
    const handleIntroFinish = () => {
        setShowIntro(false);
    };

    const handleFilterChange = useCallback((filterType: 'category' | 'brand', value: string) => {
        const targetElement = document.getElementById('shop');
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
        if (filterType === 'category') {
            setCategoryFilter(value);
            setBrandFilter(null);
        } else { // brand
            setBrandFilter(value);
            setCategoryFilter(null);
        }
    }, []);

    const handleNavClick = (e: React.MouseEvent, targetId: string) => {
        e.preventDefault();
        setCurrentView('shop');
        setTimeout(() => {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 0);
    };
    
    const handlePlaceOrder = (customerDetails: { name: string, email: string }) => {
        const newOrderId = Math.random().toString(36).substr(2, 9).toUpperCase();
        setOrderId(newOrderId);
        
        const newOrder: Order = {
            id: newOrderId,
            date: new Date().toLocaleDateString('es-UY'),
            customerName: customerDetails.name,
            customerEmail: customerDetails.email,
            items: cart.map(item => ({ product: item.product, quantity: item.quantity })),
            total: totalPrice,
            status: 'Pending',
        };

        if (isAuthenticated) {
            addOrder(newOrder);
        }

        setCurrentView('confirmation');
        window.scrollTo(0, 0);
    };
    
    const handleReturnToShop = () => {
        setCurrentView('shop');
        setOrderId(null);
    };

    const handleAddReview = async (productId: number, review: Review) => {
        const productToUpdate = products.find(p => p.id === productId);
        if (productToUpdate) {
            const existingReviews = productToUpdate.reviews || [];
            const updatedProduct = { ...productToUpdate, reviews: [review, ...existingReviews] };
            
            try {
                await updateProduct(updatedProduct);
                setProducts(products.map(p => p.id === productId ? updatedProduct : p));
            } catch (error) {
                console.error("Error adding review:", error);
            }
        }
    };

    const handleProceedToCheckout = () => {
        setIsCartOpen(false);
        setIsUpsellModalOpen(true);
    };

    const handleUpsellCloseAndCheckout = () => {
        setIsUpsellModalOpen(false);
        setCurrentView('checkout');
        window.scrollTo(0, 0);
    };

    const filteredProducts = products.filter(product => {
        const priceValue = parseInt(product.price.replace('$U ', '').replace('.', ''));
        const categoryMatch = !categoryFilter || product.category === categoryFilter;
        const brandMatch = !brandFilter || product.name.toUpperCase().includes(brandFilter.toUpperCase());
        const priceMatch = priceValue <= priceFilter;
        return categoryMatch && brandMatch && priceMatch;
    });

    const handleAuthClick = () => {
        if (!isAuthenticated) {
            setAuthModal('login');
        } else {
            setCurrentView('profile');
        }
    };
    
    const handleViewProduct = (productName: string) => {
        const product = products.find(p => p.name === productName);
        if(product) {
            const brand = product.name.split(' ')[0];
            handleFilterChange('brand', brand);
        }
        const targetElement = document.getElementById('shop');
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const handleBuyNow = (product: Product) => {
        addToCart(product);
        setCurrentView('checkout');
        window.scrollTo(0, 0);
    };
    
    const handleAdminLogin = (credentials: { user: string; pass: string }) => {
        if (credentials.user === 'admin' && credentials.pass === 'admin') {
            setIsAdminAuthenticated(true);
            setCurrentView('adminPanel');
        } else {
            alert('Credenciales de administrador incorrectas.');
        }
    };
    
    const handleAdminLogout = () => {
        setIsAdminAuthenticated(false);
        setCurrentView('shop');
    }

    if (!isAgeVerified) return <AgeVerificationModal onVerify={handleAgeVerify} />;
    if (showIntro) return <IntroAnimation onFinished={handleIntroFinish} />;
    if (currentView === 'adminLogin') return <AdminLogin onLogin={handleAdminLogin} />;
    if (currentView === 'adminPanel' && isAdminAuthenticated) return <AdminPanel onLogout={handleAdminLogout} products={products} refetchProducts={fetchProducts} />;
    if (currentView === 'adminPanel' && !isAdminAuthenticated) {
        setCurrentView('adminLogin');
        return <AdminLogin onLogin={handleAdminLogin} />;
    }

    return (
        <div className="bg-dark-secondary font-sans text-dark-text">
            <Header
                onFilterChange={handleFilterChange}
                onNavClick={handleNavClick}
                onCartClick={() => setIsCartOpen(true)}
                onAuthClick={handleAuthClick}
                onProfileClick={() => setCurrentView('profile')}
            />

            <main>
                {currentView === 'shop' && (
                    <>
                        <HeroBanner onNavClick={handleNavClick} />
                        <FeaturedGrid onFilterChange={handleFilterChange} />
                        <section id="advisor" className="py-20 bg-dark-primary">
                            <VapingAdvisor onViewProduct={handleViewProduct} products={products} />
                        </section>
                        <section id="shop">
                             {isLoadingProducts ? (
                                <div className="text-center py-20">Cargando productos...</div>
                            ) : (
                                <Shop 
                                    products={filteredProducts} 
                                    priceFilter={priceFilter}
                                    onPriceChange={setPriceFilter}
                                    onBuyNow={handleBuyNow}
                                    onAddReview={handleAddReview}
                                    allProducts={products}
                                />
                            )}
                        </section>
                        <section id="faq" className="py-20 bg-dark-secondary">
                          <Faq />
                        </section>
                    </>
                )}
                {currentView === 'checkout' && <CheckoutPage onPlaceOrder={handlePlaceOrder} onReturnToShop={handleReturnToShop} />}
                {currentView === 'confirmation' && orderId && <OrderConfirmationPage orderId={orderId} onReturnToShop={handleReturnToShop} />}
                {currentView === 'profile' && <ProfilePage onClose={handleReturnToShop} />}
            </main>
            
            <Footer onFilterChange={handleFilterChange} onNavClick={handleNavClick} />

            <CartSidebar 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)}
                onGoToCheckout={handleProceedToCheckout}
            />

            {authModal === 'login' && <LoginModal onClose={() => setAuthModal(null)} onSwitchToRegister={() => setAuthModal('register')} />}
            {authModal === 'register' && <RegisterModal onClose={() => setAuthModal(null)} onSwitchToLogin={() => setAuthModal('login')} />}
            
            {isUpsellModalOpen && <UpsellModal onClose={handleUpsellCloseAndCheckout} allProducts={products} />}

            <WhatsAppButton onClick={() => {
                setIsChatbotOpen(true);
                handleWhatsAppSecretClick();
            }} />
            <ChatbotWidget isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} products={products} />
        </div>
    );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;