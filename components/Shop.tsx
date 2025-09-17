import React, { useState } from 'react';
// Corrected import paths to be relative.
import type { Product, Review } from '../types';
import { FilterSidebar } from './FilterSidebar';
import { ProductGrid } from './ProductGrid';
import { ComparisonBar } from './ComparisonBar';
import { ComparisonModal } from './ComparisonModal';
import { ProductModal } from './ProductModal';

interface ShopProps {
    products: Product[]; // Filtered products
    allProducts: Product[]; // All available products
    priceFilter: number;
    onPriceChange: (price: number) => void;
    onBuyNow: (product: Product) => void;
    onAddReview: (productId: number, review: Review) => void;
}

export const Shop: React.FC<ShopProps> = ({ products, allProducts, priceFilter, onPriceChange, onBuyNow, onAddReview }) => {
    const [comparisonList, setComparisonList] = useState<Product[]>([]);
    const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleCompare = (product: Product) => {
        setComparisonList(prevList => {
            if (prevList.some(p => p.id === product.id)) {
                return prevList.filter(p => p.id !== product.id);
            }
            if (prevList.length < 3) {
                return [...prevList, product];
            }
            alert("Puedes comparar un máximo de 3 productos.");
            return prevList;
        });
    };
    
    const handleRemoveFromCompare = (productId: number) => {
        setComparisonList(prevList => prevList.filter(p => p.id !== productId));
    };

    const handleClearCompare = () => {
        setComparisonList([]);
    };

    const handleViewDetails = (product: Product) => {
        setSelectedProduct(product);
    };
    
    return (
        <section className="container mx-auto px-6 py-12">
            <h2 className="text-4xl font-black text-center mb-10 text-white uppercase">Nuestros Productos</h2>
            <div className="flex flex-col lg:flex-row gap-8">
                <FilterSidebar 
                    price={priceFilter}
                    onPriceChange={onPriceChange}
                />
                <main className="flex-1">
                    {products.length > 0 ? (
                        <ProductGrid 
                            products={products} 
                            onCompare={handleCompare} 
                            comparisonList={comparisonList} 
                            onViewDetails={handleViewDetails}
                        />
                    ) : (
                        <div className="text-center py-16">
                            <h3 className="text-2xl font-semibold text-gray-300">No se encontraron productos</h3>
                            <p className="text-gray-500 mt-2">Intenta ajustar tus filtros o búsqueda.</p>
                        </div>
                    )}
                </main>
            </div>
            {comparisonList.length > 0 && (
                <ComparisonBar 
                    products={comparisonList} 
                    onRemove={handleRemoveFromCompare}
                    onClear={handleClearCompare}
                    onCompareClick={() => setIsComparisonModalOpen(true)}
                />
            )}
            {isComparisonModalOpen && (
                <ComparisonModal 
                    products={comparisonList} 
                    onClose={() => setIsComparisonModalOpen(false)}
                />
            )}
            {selectedProduct && (
                <ProductModal 
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onBuyNow={onBuyNow}
                    onAddReview={onAddReview}
                    allProducts={allProducts}
                />
            )}
        </section>
    );
};