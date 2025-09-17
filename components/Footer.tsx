
import React from 'react';
// Corrected import path for icon components to be a relative path.
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from './IconComponents';

interface FooterProps {
    onFilterChange: (filterType: 'category' | 'brand', value: string) => void;
    onNavClick: (e: React.MouseEvent, targetId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onFilterChange, onNavClick }) => {
  return (
    <footer className="bg-dark-primary text-dark-text">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Vape del Este</h3>
            <p className="text-gray-400">Vapeo con Conciencia y Calidad.</p>
            <p className="text-brand-blue-light mt-4 text-sm font-semibold">Producto para mayores de 18 años.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Tienda</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => onFilterChange('category', 'Recargable')} className="hover:text-white">Kits de Vapeo</button></li>
              <li><button onClick={() => onFilterChange('category', 'Líquido')} className="hover:text-white">E-Líquidos</button></li>
              <li><button onClick={() => onFilterChange('category', 'Accesorio')} className="hover:text-white">Accesorios</button></li>
              <li><a href="#shop" onClick={(e) => onNavClick(e, '#shop')} className="hover:text-white">Ofertas</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Información</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Sobre Nosotros</a></li>
              <li><a href="#" className="hover:text-white">Contacto</a></li>
              <li><a href="#faq" onClick={(e) => onNavClick(e, '#faq')} className="hover:text-white">Preguntas Frecuentes</a></li>
              <li><a href="#" className="hover:text-white">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-white">Términos y Condiciones</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><InstagramIcon className="h-6 w-6"/></a>
              <a href="#" className="text-gray-400 hover:text-white"><FacebookIcon className="h-6 w-6"/></a>
              <a href="#" className="text-gray-400 hover:text-white"><TwitterIcon className="h-6 w-6"/></a>
              <a href="#" className="text-gray-400 hover:text-white"><YoutubeIcon className="h-6 w-6"/></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Vape del Este. Todos los derechos reservados.</p>
          <p className="mt-2">Advertencia: Este producto contiene nicotina, una sustancia muy adictiva. No se recomienda su uso por no fumadores.</p>
        </div>
      </div>
    </footer>
  );
};
