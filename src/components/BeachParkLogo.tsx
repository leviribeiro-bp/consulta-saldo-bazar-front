import React from 'react';
import logoImg from '../assets/images/beach_park_logo_1786556512335.jpg';

interface BeachParkLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BeachParkLogo: React.FC<BeachParkLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-32 h-32 sm:w-36 sm:h-36'
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <div className="relative group">
        {/* Glow backdrop with Beach Park tropical turquoise & sun orange */}
        <div className="absolute -inset-2 bg-gradient-to-r from-[#008DB9] via-[#00A3DA] to-[#FF7A00] rounded-full blur-md opacity-40 group-hover:opacity-60 transition duration-500"></div>
        
        <div className={`relative ${sizeClasses} rounded-full bg-white p-1.5 shadow-xl border-2 border-[#008DB9]/30 flex items-center justify-center overflow-hidden`}>
          <img
            src={logoImg}
            alt="Beach Park Logo"
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="mt-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003B5C] tracking-tight flex items-center justify-center gap-1.5">
          <span>BEACH PARK</span>
          <span className="text-[#FF7A00] font-normal text-xl sm:text-2xl">|</span>
          <span className="text-[#008DB9] font-medium text-lg sm:text-xl">CONSULTA</span>
        </h1>
        <p className="text-xs uppercase tracking-widest text-[#003B5C]/70 font-semibold mt-0.5">
          Sistema de Leitura de Crachá
        </p>
      </div>
    </div>
  );
};
