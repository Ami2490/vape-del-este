
import React from 'react';
// Corrected import paths to be relative.
import type { Product } from '../types';
import { XIcon } from './IconComponents';

interface ComparisonModalProps {
  products: Product[];
  onClose: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ products, onClose }) => {
    const staticFeatures = ['category', 'price', 'description'];
    
    const dynamicFeatures = Array.from(
        new Set(products.flatMap(p => p.features?.map(f => f.split(':')[0].trim()) || []))
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-dark-secondary rounded-lg shadow-2xl p-8 max-w-4xl w-full text-left relative max-h-[90vh] flex flex-col border border-gray-700">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white z-10">
            <XIcon className="h-6 w-6" />
        </button>
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Comparativa de Productos</h2>
        <div className="overflow-x-auto overflow-y-auto">
            <table className="w-full border-collapse min-w-[600px]">
                <thead>
                    <tr className="border-b-2 border-gray-600">
                        <th className="p-3 font-semibold text-left sticky top-0 bg-dark-secondary text-white">Característica</th>
                        {products.map(product => (
                            <th key={product.id} className="p-3 text-center sticky top-0 bg-dark-secondary">
                                <img src={product.imageUrl} alt={product.name} className="h-20 w-20 object-contain rounded-md mx-auto mb-2" />
                                <span className="font-bold text-brand-blue-light">{product.name}</span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="text-gray-300">
                    {staticFeatures.map(feature => (
                        <tr key={feature} className="border-b border-gray-700">
                            <td className="p-3 font-semibold capitalize text-gray-400">{feature === 'category' ? 'Categoría' : feature === 'price' ? 'Precio' : 'Descripción'}</td>
                            {products.map(product => (
                                <td key={product.id} className="p-3 text-center text-sm">
                                    {String(product[feature as keyof Product] || 'N/A')}
                                </td>
                            ))}
                        </tr>
                    ))}
                    <tr className="bg-dark-primary">
                        <td colSpan={products.length + 1} className="p-2 font-bold text-center text-white">
                            Especificaciones
                        </td>
                    </tr>
                    {dynamicFeatures.map(featureKey => (
                        <tr key={featureKey} className="border-b border-gray-700">
                            <td className="p-3 font-semibold text-gray-400">{featureKey}</td>
                            {products.map(product => {
                                const feature = product.features?.find(f => f.startsWith(featureKey));
                                const featureValue = feature ? feature.split(':')[1].trim() : '❌';
                                return (
                                  <td key={product.id} className="p-3 text-center">
                                      {featureValue !== '❌' ? (
                                          <span className="text-green-400">{featureValue}</span>
                                      ) : (
                                          <span className="text-red-500">{featureValue}</span>
                                      )}
                                  </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};