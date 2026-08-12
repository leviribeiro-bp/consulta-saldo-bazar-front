import React, { useEffect, useState } from 'react';
import { FuncionarioSaldo } from '../types';
import { Wallet, CheckCircle2, User, Building2, RefreshCw, Clock, ArrowLeft, ShieldCheck, Utensils, Coffee } from 'lucide-react';
import { motion } from 'motion/react';

interface BalanceCardProps {
  funcionario: FuncionarioSaldo;
  onReset: () => void;
  autoResetSeconds?: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  funcionario,
  onReset,
  autoResetSeconds = 12
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(autoResetSeconds);

  // Auto countdown to clear screen for the next employee badge read
  useEffect(() => {
    setTimeLeft(autoResetSeconds);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onReset();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [funcionario, onReset, autoResetSeconds]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  // Format 14 digits badge as 1234.5678.9012.34
  const formatBadge = (cracha: string) => {
    if (cracha.length === 14) {
      return `${cracha.slice(0, 4)}.${cracha.slice(4, 8)}.${cracha.slice(8, 12)}.${cracha.slice(12, 14)}`;
    }
    return cracha;
  };

  const progressPercent = (timeLeft / autoResetSeconds) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="bg-white rounded-3xl shadow-2xl border-2 border-[#008DB9]/30 overflow-hidden relative"
      >
        {/* Beach Park Gradient Banner */}
        <div className="bg-gradient-to-r from-[#003B5C] via-[#008DB9] to-[#00A3DA] text-white p-6 sm:p-8 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {funcionario.fotoUrl ? (
                  <img
                    src={funcionario.fotoUrl}
                    alt={funcionario.nome}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 border-2 border-white flex items-center justify-center text-white">
                    <User className="w-8 h-8" />
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow border border-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF7A00] text-white shadow-sm mb-1">
                  CRACÁ CONFIRMADO
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                  {funcionario.nome}
                </h2>
                <p className="text-xs sm:text-sm text-cyan-100 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-[#00A3DA]" />
                  <span>{funcionario.setor}</span>
                  <span>•</span>
                  <span>{funcionario.cargo}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Badge Number Pill */}
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs text-cyan-100 font-mono">
            <span>Nº Crachá: <strong className="text-white text-sm">{formatBadge(funcionario.cracha)}</strong></span>
            <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 px-2 py-0.5 rounded font-sans font-semibold">
              {funcionario.status}
            </span>
          </div>
        </div>

        {/* Balance Highlight Box */}
        <div className="p-6 sm:p-8 space-y-6 bg-slate-50">
          <div className="bg-gradient-to-br from-white to-cyan-50/50 p-6 rounded-2xl border-2 border-[#008DB9]/20 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Wallet className="w-24 h-24 text-[#008DB9]" />
            </div>

            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#003B5C]/70">
              Saldo Atual Disponível
            </p>
            <div className="text-4xl sm:text-5xl font-black text-[#003B5C] mt-2 mb-1 tracking-tight">
              <span className="text-[#008DB9] text-2xl sm:text-3xl font-bold mr-1">{funcionario.moeda}</span>
              {funcionario.saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5 text-[#FF7A00]" />
              Atualizado em: {funcionario.ultimaAtualizacao || 'Agora'}
            </p>
          </div>

          {/* Balance breakdown if details exist */}
          {funcionario.detalhesSaldo && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-50 text-[#FF7A00]">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Alimentação</p>
                  <p className="text-sm font-bold text-[#003B5C]">
                    {formatCurrency(funcionario.detalhesSaldo.alimentacao || 0)}
                  </p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sky-50 text-[#008DB9]">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Refeição</p>
                  <p className="text-sm font-bold text-[#003B5C]">
                    {formatCurrency(funcionario.detalhesSaldo.refeicao || 0)}
                  </p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Livre Consumo</p>
                  <p className="text-sm font-bold text-[#003B5C]">
                    {formatCurrency(funcionario.detalhesSaldo.livreConsumo || 0)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Button & Auto Reset Countdown Timer */}
          <div className="pt-2">
            <button
              onClick={onReset}
              className="w-full bg-[#008DB9] hover:bg-[#007398] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-base"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Realizar Nova Leitura de Crachá</span>
            </button>

            {/* Countdown progress bar */}
            <div className="mt-4 text-center">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Reiniciando automaticamente para próxima consulta</span>
                <span className="font-mono font-bold text-[#FF7A00]">{timeLeft}s</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-[#008DB9] h-full"
                  initial={{ width: '100%' }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
