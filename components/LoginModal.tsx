import React, { useState } from 'react';
// Corrected import paths to be relative.
import { XIcon } from './IconComponents';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login by extracting name from email
    const name = email.split('@')[0];
    login(name, email);
    onClose();
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 font-sans animate-fade-in"
      onClick={onClose}
      style={{animation: 'fade-in 0.3s ease-out forwards'}}
    >
      <div 
        className="bg-dark-secondary rounded-xl shadow-2xl max-w-md w-full p-8 border border-gray-700 relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{animation: 'slide-up 0.4s ease-out forwards'}}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white z-10" aria-label="Cerrar modal">
            <XIcon className="h-6 w-6" />
        </button>
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-dark-primary border border-gray-600 rounded-md p-2.5 text-white focus:ring-brand-purple focus:border-brand-purple" placeholder="tu@email.com" required/>
            </div>
            <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
                <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-dark-primary border border-gray-600 rounded-md p-2.5 text-white focus:ring-brand-purple focus:border-brand-purple" placeholder="********" required/>
            </div>
            <div className="pt-2">
                 <button type="submit" className="w-full bg-brand-purple text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-300">
                    Acceder
                </button>
            </div>
        </form>
         <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
                ¿No tienes cuenta?{' '}
                <button onClick={onSwitchToRegister} className="font-semibold text-brand-blue-light hover:underline">
                    Regístrate aquí
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};