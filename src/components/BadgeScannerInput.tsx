import React, { useRef, useEffect, useState } from 'react';
import { BeachParkLogo } from './BeachParkLogo';
import { Scan, Delete, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BadgeScannerInputProps {
  onQueryBadge: (badgeNumber: string) => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

export const BadgeScannerInput: React.FC<BadgeScannerInputProps> = ({
  onQueryBadge,
  isLoading,
  errorMessage
}) => {
  const [badgeInput, setBadgeInput] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount and whenever loading finishes
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  // Handle input change - RULE 1: Numbers only, max 14 digits
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Strip everything except digits
    const digitsOnly = rawValue.replace(/\D/g, '').slice(0, 14);
    
    setBadgeInput(digitsOnly);

    // RULE 2: Send automatically as soon as 14 digits are reached
    if (digitsOnly.length === 14 && !isLoading) {
      onQueryBadge(digitsOnly);
    }
  };

  // Handle Form Submit / Keydown (Enter key from barcode scanner)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (badgeInput.length === 14 && !isLoading) {
      onQueryBadge(badgeInput);
    }
  };

  // Clear input field
  const handleClear = () => {
    setBadgeInput('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-[#008DB9]/20 overflow-hidden relative"
      >
        {/* Top Decorative Orange Border Bar */}
        <div className="h-3 bg-[#FF7A00]" />

        <div className="p-6 sm:p-10 flex flex-col items-center text-center">
          {/* Logo centered on top */}
          <BeachParkLogo size="md" className="mb-6" />

          {/* Instruction Label required by prompt */}
          <div className="mb-6 max-w-md">
            <h2 id="instruction-label" className="text-lg sm:text-xl font-bold text-[#003B5C] leading-snug">
              Realize leitura do crachá para consultar o seu saldo atual
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center justify-center gap-1.5">
              <Scan className="w-4 h-4 text-[#008DB9]" />
              Aproxime o leitor de código de barras ou digite o número do crachá
            </p>
          </div>

          {/* Form & Input Container */}
          <form onSubmit={handleSubmit} className="w-full relative">
            <div className="relative group">
              {/* Outer halo when active or loading */}
              <div
                className={`absolute -inset-1 rounded-2xl transition duration-300 blur-sm ${
                  isLoading
                    ? 'bg-gradient-to-r from-[#008DB9] to-[#FF7A00] animate-pulse opacity-80'
                    : isFocused
                    ? 'bg-[#008DB9]/30 opacity-100'
                    : 'opacity-0'
                }`}
              />

              <div className="relative bg-slate-50 rounded-2xl border-2 border-slate-200 focus-within:border-[#008DB9] transition-all duration-200 p-2 shadow-inner">
                {/* Input field */}
                <input
                  ref={inputRef}
                  id="badge-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={14}
                  value={badgeInput}
                  onChange={handleInputChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  disabled={isLoading}
                  placeholder="Número do crachá"
                  autoComplete="off"
                  className="w-full bg-transparent text-center text-2xl sm:text-3xl font-mono font-bold tracking-widest text-[#003B5C] focus:outline-none disabled:opacity-50 py-3 px-10 placeholder:text-slate-300 placeholder:font-sans placeholder:text-lg"
                />

                {/* Left Scan Icon */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#008DB9]">
                  <Scan className={`w-6 h-6 ${isLoading ? 'animate-bounce text-[#FF7A00]' : ''}`} />
                </div>

                {/* Right Clear Button */}
                {badgeInput.length > 0 && !isLoading && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-200/80 hover:bg-slate-300 p-1.5 rounded-full transition-colors"
                    title="Limpar número"
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Loading Overlay State required by Rule #2: "Procurando Funcionário..." */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-6 w-full bg-gradient-to-r from-[#003B5C] to-[#005B8E] text-white p-5 rounded-2xl shadow-lg border border-[#008DB9]/40 flex flex-col items-center justify-center space-y-3"
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[#FF7A00] animate-spin" />
                  <Loader2 className="w-6 h-6 text-[#00A3DA] absolute animate-spin" />
                </div>
                
                <div className="text-center">
                  {/* Exact string required by prompt: "Procurando Funcionário..." */}
                  <h3 id="loading-status" className="text-lg font-bold text-white tracking-wide flex items-center justify-center gap-2">
                    <span>Procurando Funcionário...</span>
                  </h3>
                  <p className="text-xs text-cyan-200 mt-1">
                    Consultando saldo no servidor
                  </p>
                </div>

                {/* Animated progress wave bar */}
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                  <motion.div
                    className="bg-gradient-to-r from-[#008DB9] via-[#00A3DA] to-[#FF7A00] h-full"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message Display */}
          {errorMessage && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 w-full bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 text-left"
            >
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Aviso na consulta</p>
                <p className="text-rose-700">{errorMessage}</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
