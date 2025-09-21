
import React from 'react';

interface FilterSidebarProps {
    price: number;
    onPriceChange: (price: number) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ price, onPriceChange }) => {
  return (
    <aside className="w-full lg:w-64 bg-dark-primary p-6 rounded-lg shadow-lg h-fit border border-gray-800">
      <h3 className="text-xl font-bold mb-6 text-white">Filtros</h3>
      
      <div>
        <h4 className="font-semibold mb-3 text-gray-300">Rango de Precio</h4>
        <div className="flex flex-col space-y-2">
            <label className="flex items-center">
                <input 
                    type="range" 
                    min="500" 
                    max="4000" 
                    step="50"
                    value={price}
                    onChange={(e) => onPriceChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-blue-light"
                />
            </label>
            <div className="flex justify-between text-sm text-gray-400">
                <span>$U 500</span>
                <span className="font-bold text-brand-blue-light">$U {price}</span>
                <span>$U 4000</span>
            </div>
        </div>
      </div>
    </aside>
  );
};