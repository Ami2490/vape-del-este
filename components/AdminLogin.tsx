import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: (credentials: { user: string; pass: string }) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ user: username, pass: password });
  };

  return (
    <div className="fixed inset-0 bg-dark-primary flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-dark-secondary border border-gray-700 rounded-lg shadow-2xl p-8 max-w-md w-full text-center text-dark-text">
        <img src="https://firebasestorage.googleapis.com/v0/b/zona-clic-admin.firebasestorage.app/o/vape%20del%20este%2FWhatsApp_Image_2025-09-07_at_12.56.29_PM-removebg-preview.png?alt=media&token=ee1cd9e3-7bf7-448c-a418-3b3133ef1097" alt="Vape del Este" className="h-20 w-auto mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Panel de Administrador</h1>
        <p className="text-gray-400 mb-6">Acceso exclusivo para administradores.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-user" className="sr-only">Usuario</label>
            <input 
              id="admin-user" 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-dark-primary border border-gray-600 rounded-md p-2.5 text-white focus:ring-brand-purple focus:border-brand-purple" 
              placeholder="Usuario" 
              required
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="sr-only">Contraseña</label>
            <input 
              id="admin-password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-primary border border-gray-600 rounded-md p-2.5 text-white focus:ring-brand-purple focus:border-brand-purple" 
              placeholder="Contraseña" 
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-purple text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-300"
          >
            Acceder
          </button>
        </form>
      </div>
    </div>
  );
};