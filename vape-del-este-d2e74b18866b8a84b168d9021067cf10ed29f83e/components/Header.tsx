
import React, { useState } from 'react';
// Corrected import paths to be relative.
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCartIcon, UserIcon, MenuIcon, XIcon } from './IconComponents';
import type { NavLink } from '../types';
import { categoryNavLinks } from '../constants';

interface HeaderProps {
    onFilterChange: (filterType: 'category' | 'brand', value: string) => void;
    onNavClick: (e: React.MouseEvent, targetId: string) => void;
    onCartClick: () => void;
    onAuthClick: () => void;
    onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onFilterChange, onNavClick, onCartClick, onAuthClick, onProfileClick }) => {
    const { itemCount } = useCart();
    const { isAuthenticated, user } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const renderMegaMenu = (navLink: NavLink) => (
        <div className="absolute top-full left-0 hidden group-hover:block bg-dark-primary shadow-lg p-6 w-max border border-gray-800 rounded-b-lg">
            <div className="flex gap-8">
                {navLink.megaMenu?.map(item => (
                    <div key={item.title}>
                        <h4 className="font-bold text-white mb-3">{item.title}</h4>
                        <ul className="space-y-2">
                            {item.links.map(link => (
                                <li key={link.name}>
                                    <button onClick={() => onFilterChange(item.filterType, link.filterValue)} className="text-gray-400 hover:text-brand-blue-light transition-colors">
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
    
    const navItems = (
        <>
            {categoryNavLinks.map(link => (
                <li key={link.name} className="group relative">
                    {link.isFilter ? (
                         <button onClick={() => onFilterChange(link.filterType!, link.filterValue!)} className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                             {link.name}
                         </button>
                    ) : (
                         <a href={link.href} onClick={(e) => onNavClick(e, link.href)} className="px-4 py-2 text-gray-300 hover:text-white transition-colors flex items-center">
                             {link.name}
                             {link.megaMenu && <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>}
                         </a>
                    )}
                    {link.megaMenu && renderMegaMenu(link)}
                </li>
            ))}
        </>
    );

    return (
        <header className="bg-dark-primary/80 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-800">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    <a href="#home" onClick={(e) => onNavClick(e, '#home')} className="flex items-center">
                        <img src="https://firebasestorage.googleapis.com/v0/b/zona-clic-admin.firebasestorage.app/o/vape%20del%20este%2FWhatsApp_Image_2025-09-07_at_12.56.29_PM-removebg-preview.png?alt=media&token=ee1cd9e3-7bf7-448c-a418-3b3133ef1097" alt="Vape del Este" className="h-14 w-auto" />
                        <span className="text-xl font-bold text-white ml-2 hidden sm:block">Vape del Este</span>
                    </a>
                    
                    <nav className="hidden lg:flex">
                        <ul className="flex items-center space-x-2 font-semibold">
                            {navItems}
                        </ul>
                    </nav>

                    <div className="flex items-center gap-4">
                        <button onClick={onCartClick} className="relative text-gray-300 hover:text-white transition-colors" aria-label={`Carrito de compras con ${itemCount} artículos`}>
                            <ShoppingCartIcon className="h-6 w-6" />
                            {itemCount > 0 && <span className="absolute -top-2 -right-2 bg-brand-purple text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{itemCount}</span>}
                        </button>
                        {isAuthenticated && user ? (
                             <button onClick={onProfileClick} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group">
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Avatar de usuario" className="h-8 w-8 rounded-full object-cover border-2 border-gray-600 group-hover:border-brand-blue-light transition-colors" />
                                ) : (
                                    <UserIcon className="h-6 w-6" />
                                )}
                                <span className="hidden sm:inline font-semibold">{user.name}</span>
                            </button>
                        ) : (
                             <button onClick={onAuthClick} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                                <UserIcon className="h-6 w-6" />
                                <span className="hidden sm:inline font-semibold">Acceder</span>
                            </button>
                        )}
                         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-gray-300 hover:text-white transition-colors">
                            {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-dark-primary border-t border-gray-800">
                    <ul className="flex flex-col items-center py-4 space-y-4 font-semibold">
                       {navItems}
                    </ul>
                </div>
            )}
        </header>
    );
};