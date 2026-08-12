import React, { useState } from 'react';
import { BeachParkHeader } from './components/BeachParkHeader';
import { BadgeScannerInput } from './components/BadgeScannerInput';
import { BalanceCard } from './components/BalanceCard';
import { FuncionarioSaldo, FetchStatus } from './types';
import { Waves } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>('idle');
  const [funcionario, setFuncionario] = useState<FuncionarioSaldo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // GET API Request Handler
  const handleQueryBadge = async (crachaNumber: string) => {
    // Validate 14 digits internally for API dispatch rule
    if (!crachaNumber || crachaNumber.length !== 14 || !/^\d{14}$/.test(crachaNumber)) {
      setErrorMessage('Número de crachá inválido. Verifique o número e tente novamente.');
      setFetchStatus('error');
      return;
    }

    setFetchStatus('loading');
    setErrorMessage(null);

    try {
      // Perform real HTTP GET request
      const response = await fetch(`/api/saldo/${crachaNumber}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.mensagem || `Falha na requisição API (Status ${response.status})`
        );
      }

      const data: FuncionarioSaldo = await response.json();
      setFuncionario(data);
      setFetchStatus('success');
    } catch (err: unknown) {
      console.error('Erro na chamada GET para consulta de crachá:', err);
      const msg = err instanceof Error ? err.message : 'Não foi possível consultar o saldo. Tente novamente.';
      setErrorMessage(msg);
      setFetchStatus('error');
    }
  };

  // Reset to initial input screen
  const handleReset = () => {
    setFuncionario(null);
    setFetchStatus('idle');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 relative selection:bg-[#008DB9] selection:text-white overflow-x-hidden">
      {/* Beach Park Tropical Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#008DB9]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FF7A00]/15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 right-10 w-72 h-72 bg-cyan-300/20 rounded-full blur-2xl" />
      </div>

      {/* Header Bar */}
      <div className="relative z-10">
        <BeachParkHeader />
      </div>

      {/* Main Screen Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 py-6 sm:py-10">
        <AnimatePresence mode="wait">
          {fetchStatus === 'success' && funcionario ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              <BalanceCard
                funcionario={funcionario}
                onReset={handleReset}
                autoResetSeconds={14}
              />
            </motion.div>
          ) : (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full"
            >
              <BadgeScannerInput
                onQueryBadge={handleQueryBadge}
                isLoading={fetchStatus === 'loading'}
                errorMessage={errorMessage}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer watermark */}
      <footer className="relative z-10 py-3 px-4 bg-white/70 backdrop-blur-sm border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1 font-medium text-[#003B5C]">
            <Waves className="w-4 h-4 text-[#008DB9]" />
            <span>Beach Park • Consulta de Saldo de Crachá</span>
          </p>
          <p className="text-slate-400 text-[11px]">
            Sistema de Autoatendimento
          </p>
        </div>
      </footer>
    </div>
  );
}
