export interface FuncionarioSaldo {
  cracha: string; // 14 digits badge number
  nome: string;
  cargo: string;
  setor: string;
  saldoAtual: number; // in BRL or credits
  moeda: string; // e.g., 'R$'
  ultimaAtualizacao: string;
  status: 'ATIVO' | 'BLOQUEADO' | 'SUSPENSO';
  fotoUrl?: string;
  detalhesSaldo?: {
    alimentacao?: number;
    refeicao?: number;
    livreConsumo?: number;
  };
}

export interface ApiConfig {
  baseUrl: string;
  customHeaders: Record<string, string>;
  isMockMode: boolean;
  timeoutMs: number;
}

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ApiError {
  mensagem: string;
  codigo?: string | number;
  detalhes?: string;
}
