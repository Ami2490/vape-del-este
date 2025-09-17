
import React from 'react';

interface AgeVerificationModalProps {
  onVerify: () => void;
}

export const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({ onVerify }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-dark-primary border border-gray-700 rounded-lg shadow-2xl p-8 max-w-md w-full text-center text-dark-text">
        <h1 className="text-3xl font-bold text-white mb-4">Bienvenido a Vape del Este</h1>
        <p className="text-gray-400 mb-6">Para acceder a nuestro sitio web, debes confirmar que eres mayor de 18 años.</p>
        <div className="space-y-4">
          <button
            onClick={onVerify}
            className="w-full bg-brand-purple text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-300"
          >
            Tengo 18 años o más
          </button>
          <a
            href="https://www.google.com"
            className="w-full block bg-gray-700 text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-300"
          >
            Soy menor de 18 años
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-6">
          Este sitio web vende productos que contienen nicotina, una sustancia adictiva. Está destinado exclusivamente a fumadores adultos.
        </p>
      </div>
    </div>
  );
};