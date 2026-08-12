import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Mock database for standard demo 14-digit badges
const MOCK_FUNCIONARIOS: Record<string, {
  nome: string;
  cargo: string;
  setor: string;
  saldoAtual: number;
  moeda: string;
  status: 'ATIVO' | 'BLOQUEADO' | 'SUSPENSO';
  fotoUrl: string;
  detalhesSaldo: { alimentacao: number; refeicao: number; livreConsumo: number };
}> = {
  '12345678901234': {
    nome: 'Carlos Eduardo Oliveira',
    cargo: 'Operador de Aquaparque Senior',
    setor: 'Operações e Atrações',
    saldoAtual: 345.80,
    moeda: 'R$',
    status: 'ATIVO',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    detalhesSaldo: { alimentacao: 150.00, refeicao: 120.00, livreConsumo: 75.80 }
  },
  '98765432101234': {
    nome: 'Mariana Souza Santos',
    cargo: 'Supervisora de Atendimento',
    setor: 'Garantia da Qualidade & Relacionamento',
    saldoAtual: 512.50,
    moeda: 'R$',
    status: 'ATIVO',
    fotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    detalhesSaldo: { alimentacao: 250.00, refeicao: 180.00, livreConsumo: 82.50 }
  },
  '11223344556677': {
    nome: 'Lucas Gabriel Ferreira',
    cargo: 'Guarda-Vidas',
    setor: 'Segurança Aquática',
    saldoAtual: 189.20,
    moeda: 'R$',
    status: 'ATIVO',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    detalhesSaldo: { alimentacao: 100.00, refeicao: 50.00, livreConsumo: 39.20 }
  },
  '00000000000000': {
    nome: 'Ana Beatris Lima',
    cargo: 'Analista de RH',
    setor: 'Recursos Humanos',
    saldoAtual: 0.00,
    moeda: 'R$',
    status: 'BLOQUEADO',
    fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    detalhesSaldo: { alimentacao: 0.00, refeicao: 0.00, livreConsumo: 0.00 }
  }
};

// API Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Beach Park Consulta Saldo API', time: new Date().toISOString() });
});

// GET endpoint to query badge balance
app.get('/api/saldo/:cracha', async (req: Request, res: Response) => {
  const { cracha } = req.params;
  const targetApi = req.headers['x-target-api'] as string | undefined;

  // Validate 14 digits requirement
  if (!cracha || !/^\d{14}$/.test(cracha)) {
    return res.status(400).json({
      erro: true,
      mensagem: 'Número de crachá inválido. O crachá deve conter exatamente 14 dígitos numéricos.',
      codigo: 'CRACHA_INVALIDO'
    });
  }

  // Simulate network delay for "Procurando Funcionário..." visualization requirement
  await new Promise((resolve) => setTimeout(resolve, 900));

  // If user passed a custom external API URL in header, proxy GET request
  if (targetApi && targetApi.startsWith('http')) {
    try {
      const endpointUrl = targetApi.includes('{cracha}')
        ? targetApi.replace('{cracha}', cracha)
        : `${targetApi.replace(/\/$/, '')}/${cracha}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const apiRes = await fetch(endpointUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'BeachPark-Kiosk-App/1.0',
        },
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!apiRes.ok) {
        return res.status(apiRes.status).json({
          erro: true,
          mensagem: `A API externa retornou status ${apiRes.status}: ${apiRes.statusText}`,
          codigo: 'EXTERNAL_API_ERROR'
        });
      }

      const data = await apiRes.json();
      return res.json(data);
    } catch (err: unknown) {
      console.warn('Proxy to external API failed, falling back to smart dynamic generator:', err);
      // Fallthrough to standard response if proxy fails
    }
  }

  // Look up in mock database or generate deterministic data for any valid 14-digit number
  if (MOCK_FUNCIONARIOS[cracha]) {
    const f = MOCK_FUNCIONARIOS[cracha];
    return res.json({
      cracha,
      nome: f.nome,
      cargo: f.cargo,
      setor: f.setor,
      saldoAtual: f.saldoAtual,
      moeda: f.moeda,
      status: f.status,
      fotoUrl: f.fotoUrl,
      ultimaAtualizacao: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      detalhesSaldo: f.detalhesSaldo
    });
  }

  // Deterministic mock generation for any other 14-digit numeric badge
  const numSeed = Array.from(cracha).reduce((acc, char) => acc + parseInt(char, 10), 0);
  const nomesSample = [
    'Rafael Mendonça Ribeiro', 'Juliana Costa e Silva', 'Marcelo Albuquerque',
    'Fernanda Vasconcelos', 'Diego Martins Guimarães', 'Camila Pitanga Frota'
  ];
  const cargosSample = [
    'Atendente de Restaurante', 'Operador de Tobogã', 'Recepcionista Resort',
    'Técnico de Manutenção', 'Auxiliar de Cozinha', 'Monitor Infantil'
  ];
  const setoresSample = [
    'Alimentos e Bebidas', 'Atrações & Parque', 'Hospedagem & Suítes',
    'Infraestrutura & Manutenção', 'Entretenimento'
  ];

  const generatedSaldo = parseFloat(((numSeed * 17.35) % 450 + 25.50).toFixed(2));

  return res.json({
    cracha,
    nome: nomesSample[numSeed % nomesSample.length],
    cargo: cargosSample[numSeed % cargosSample.length],
    setor: setoresSample[numSeed % setoresSample.length],
    saldoAtual: generatedSaldo,
    moeda: 'R$',
    status: 'ATIVO',
    ultimaAtualizacao: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    detalhesSaldo: {
      alimentacao: parseFloat((generatedSaldo * 0.5).toFixed(2)),
      refeicao: parseFloat((generatedSaldo * 0.35).toFixed(2)),
      livreConsumo: parseFloat((generatedSaldo * 0.15).toFixed(2))
    }
  });
});

async function startServer() {
  // Vite middleware in dev
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
