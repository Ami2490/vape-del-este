
import React, { useState, useEffect } from 'react';
// Corrected import path for icon components to be a relative path.
import { ChevronRightIcon } from './IconComponents';

interface HeroBannerProps {
  onNavClick: (e: React.MouseEvent, targetId: string) => void;
}

const slides = [
    {
        bgImage: 'https://static.wixstatic.com/media/597880_dff362317e884e5aab39f43dc40efa6a~mv2.png/v1/fit/w_1000,h_1000,q_90/file.png',
        titleLine1: '40.000 Puffs',
        titleLine2: 'De Poder',
        subtitle: 'Experimenta la máxima duración y un frescor inigualable con el nuevo ELFBAR 40K ICE KING.',
        neonColor: 'brand-purple',
        neonShadow: '0 0 8px #8e44ad, 0 0 15px #8e44ad, 0 0 25px #8e44ad'
    },
    {
        bgImage: 'https://static.wixstatic.com/media/597880_3010e4e6561c4a179418864a4e06a887~mv2.jpeg/v1/fit/w_1000,h_1000,q_90/file.jpeg',
        titleLine1: 'Sabores Duales',
        titleLine2: 'Doble Placer',
        subtitle: 'Cambia de sabor cuando quieras. IGNITE DUAL TANK revoluciona tu experiencia de vapeo.',
        neonColor: 'brand-blue-light',
        neonShadow: '0 0 8px #3498db, 0 0 15px #3498db, 0 0 25px #3498db'
    },
    {
        bgImage: 'https://static.wixstatic.com/media/597880_a54b2d316d574f059f76c7eeac8c527a~mv2.png/v1/fit/w_1000,h_1000,q_90/file.png',
        titleLine1: 'La Revolución',
        titleLine2: 'Smart Llegó',
        subtitle: 'Conecta tu vape, recibe llamadas y juega. Descubre la tecnología del nuevo Smart YOOZ.',
        neonColor: 'sky-400',
        neonShadow: '0 0 8px #38bdf8, 0 0 15px #38bdf8, 0 0 25px #38bdf8'
    }
];

export const HeroBanner: React.FC<HeroBannerProps> = ({ onNavClick }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

  return (
    <>
      <style>{`
        @keyframes vapor-drift {
            0% {
                transform: translateY(0px) scale(1);
                opacity: 0.9;
                filter: blur(0.5px);
            }
            50% {
                transform: translateY(-5px) scale(1.02);
                opacity: 1;
                filter: blur(1px);
            }
            100% {
                transform: translateY(0px) scale(1);
                opacity: 0.9;
                filter: blur(0.5px);
            }
        }
      `}</style>
      <section id="home" className="relative h-[60vh] md:h-[85vh] bg-dark-primary overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${slide.bgImage})`, backgroundSize: 'contain', backgroundPosition: 'right center', backgroundRepeat: 'no-repeat' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          </div>
        ))}
        
        <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center items-start text-white">
          <div className="w-full">
              {slides.map((slide, index) => (
                   <div
                      key={index}
                      className={`transition-all duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                      style={{ position: index === currentSlide ? 'relative' : 'absolute' }}
                   >
                      <h1 className="text-4xl md:text-7xl font-black uppercase leading-tight mb-4">
                          <span style={{ 
                              animation: 'vapor-drift 6s infinite ease-in-out'
                          }}>
                              {slide.titleLine1}
                          </span>
                          <br /> 
                          <span 
                            className={`text-${slide.neonColor}`}
                            style={{ 
                                textShadow: slide.neonShadow,
                                animation: 'vapor-drift 7s infinite ease-in-out' 
                            }}
                          >
                            {slide.titleLine2}
                          </span>
                      </h1>
                      <p className="text-lg md:text-xl mb-8 max-w-lg">
                        {slide.subtitle}
                      </p>
                  </div>
              ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#shop" onClick={(e) => onNavClick(e, '#shop')} className="bg-brand-purple text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors duration-300 text-lg flex items-center justify-center shadow-lg hover:shadow-purple-500/50">
              Ver Productos
              <ChevronRightIcon className="h-5 w-5 ml-2" />
            </a>
            <a href="#advisor" onClick={(e) => onNavClick(e, '#advisor')} className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-dark-primary transition-colors duration-300 text-lg flex items-center justify-center">
              Asesor Virtual
            </a>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {slides.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-brand-purple scale-125' : 'bg-gray-500 hover:bg-gray-300'}`}
              aria-label={`Ir a la diapositiva ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </>
  );
};