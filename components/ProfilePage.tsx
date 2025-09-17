import React, { useState, useRef, ChangeEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
// Corrected import paths for icon components and types.
import { UserIcon, CameraIcon, PackageIcon } from './IconComponents';
import type { User, Order } from '../types';

interface ProfilePageProps {
  onClose: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onClose }) => {
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  if (!user) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  const ProfileEditor = () => {
    const [editedUser, setEditedUser] = useState<User>(user);
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPreviewAvatar(base64String);
                setEditedUser(prev => ({ ...prev, avatar: base64String }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSave = () => {
        setSaveStatus('saving');
        updateUser(editedUser);
        setTimeout(() => {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }, 1000);
    };

    return (
        <div className="text-left">
            <div className="relative w-32 h-32 mx-auto mb-4">
                <img src={previewAvatar || user.avatar} alt="Avatar" className="h-32 w-32 rounded-full object-cover border-4 border-brand-blue-light" />
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 bg-dark-secondary p-2 rounded-full text-white hover:bg-brand-purple transition-colors border-2 border-brand-blue-light"
                    aria-label="Cambiar foto de perfil"
                >
                    <CameraIcon className="h-5 w-5" />
                </button>
            </div>
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Nombre</label>
                    <input type="text" id="name" name="name" value={editedUser.name} onChange={handleInputChange} className="w-full bg-dark-secondary border border-gray-600 rounded-md p-2.5 text-white focus:ring-brand-purple focus:border-brand-purple" />
                </div>
                 <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <input type="email" id="email" name="email" value={editedUser.email} onChange={handleInputChange} className="w-full bg-dark-secondary border border-gray-600 rounded-md p-2.5 text-white focus:ring-brand-purple focus:border-brand-purple" />
                </div>
                <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-400 mb-1">Moneda Preferida</label>
                    <select id="currency" name="currency" value={editedUser.currency} onChange={handleInputChange} className="w-full bg-dark-secondary border border-gray-600 rounded-md p-2.5 text-white focus:ring-brand-purple focus:border-brand-purple">
                        <option value="UYU">Pesos Uruguayos ($U)</option>
                        <option value="USD">Dólares Americanos (USD)</option>
                    </select>
                </div>
                <div className="pt-4">
                    <button onClick={handleSave} className="w-full bg-brand-blue-light text-white font-bold py-3 rounded-lg hover:bg-brand-blue-dark transition-colors duration-300">
                        {saveStatus === 'idle' && 'Guardar Cambios'}
                        {saveStatus === 'saving' && 'Guardando...'}
                        {saveStatus === 'saved' && '¡Guardado!'}
                    </button>
                </div>
            </div>
        </div>
    );
  };
  
  const PurchasesHistory = () => {
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    const toggleOrderDetails = (orderId: string) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };

    if (!user.orders || user.orders.length === 0) {
        return <div className="text-center text-gray-400 py-8">No has realizado ninguna compra todavía.</div>;
    }

    return (
        <div className="space-y-4">
            {user.orders.slice().reverse().map((order: Order) => (
                <div key={order.id} className="bg-dark-secondary border border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-bold text-white">Orden #{order.id}</p>
                            <p className="text-sm text-gray-400">Fecha: {order.date}</p>
                        </div>
                        <div className="text-right">
                           <p className="font-semibold text-brand-blue-light">$U {order.total.toLocaleString('es-UY')}</p>
                           <button onClick={() => toggleOrderDetails(order.id)} className="text-sm text-brand-blue-light hover:underline">
                                {expandedOrderId === order.id ? 'Ocultar Detalles' : 'Ver Detalles'}
                           </button>
                        </div>
                    </div>
                    {expandedOrderId === order.id && (
                        <div className="mt-4 pt-4 border-t border-gray-600">
                            <h4 className="font-semibold text-white mb-2">Artículos:</h4>
                            <ul className="space-y-2">
                                {order.items.map(item => (
                                    <li key={item.product.id} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                          <img src={item.product.imageUrl} alt={item.product.name} className="w-8 h-8 object-contain rounded bg-white p-0.5" />
                                          <span className="text-gray-300">{item.product.name} x{item.quantity}</span>
                                        </div>
                                        <span className="text-gray-300">$U {(parseFloat(item.product.price.replace('$U ', '').replace('.', '')) * item.quantity).toLocaleString('es-UY')}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
  };

  return (
    <div className="container mx-auto px-6 py-12 animate-fade-in" style={{animation: 'fade-in 0.5s ease-out'}}>
        <h1 className="text-4xl font-black text-center mb-10 text-white uppercase">Mi Cuenta</h1>
        <div className="max-w-2xl mx-auto bg-dark-primary p-8 rounded-lg border border-gray-700">
            <div className="border-b border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'profile' ? 'border-brand-purple text-brand-purple' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
                    >
                        <UserIcon className="h-5 w-5" /> Mi Perfil
                    </button>
                     <button
                        onClick={() => setActiveTab('purchases')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'purchases' ? 'border-brand-purple text-brand-purple' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
                    >
                        <PackageIcon className="h-5 w-5" /> Mis Compras
                    </button>
                </nav>
            </div>

            <div>
                {activeTab === 'profile' ? <ProfileEditor /> : <PurchasesHistory />}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row gap-4">
                <button 
                    onClick={handleLogout}
                    className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                    Cerrar Sesión
                </button>
                 <button 
                    onClick={onClose}
                    className="flex-1 bg-gray-700 text-gray-200 font-bold py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                    Volver a la Tienda
                </button>
            </div>
        </div>
    </div>
  );
};