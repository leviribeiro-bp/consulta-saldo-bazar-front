import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const BeachParkHeader: React.FC = () => {
  return (
    <header className="w-full bg-[#003B5C] text-white shadow-md border-t-4 border-[#FF7A00]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between text-xs sm:text-sm font-medium">
        {/* Left: Brand Badge */}
        <div className="flex items-center space-x-2">
          <div className="bg-[#008DB9] text-white p-1 rounded-md">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-wide text-white text-sm sm:text-base">BEACH PARK RESORT</span>
        </div>
      </div>
    </header>
  );
};
