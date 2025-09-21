import React from 'react';
import { WhatsAppIcon } from './IconComponents';

interface WhatsAppButtonProps {
  onClick: () => void;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-green-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-50 transform hover:scale-110 transition-transform duration-200"
      aria-label="Abrir chat de ayuda"
    >
      <WhatsAppIcon className="h-8 w-8" />
    </button>
  );
};
