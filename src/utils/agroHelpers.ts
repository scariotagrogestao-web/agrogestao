import { Motorista, Area, Maquina, Producao } from '../types/agro';

export function getWeekString(dateStr: string): string {
  if (!dateStr) return 'Semana Indefinida';
  const d = new Date(dateStr + 'T12:00:00');
  if (isNaN(d.getTime())) return 'Semana Indefinida';
  const tempDate = new Date(d.valueOf());
  tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));
  const yearStart = new Date(tempDate.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((tempDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `Semana ${weekNo}/${tempDate.getFullYear()}`;
}

export const initialMotoristas: Motorista[] = [
  {
    "id": "M01",
    "name": "Eduardo",
    "ratePerHectare": 50,
    "status": "Ativo"
  },
  {
    "id": "M02",
    "name": "Rodrigo",
    "ratePerHectare": 50,
    "status": "Ativo"
  },
  {
    "id": "M03",
    "name": "Bigode",
    "ratePerHectare": 50,
    "status": "Ativo"
  },
  {
    "id": "M04",
    "name": "Cowboy",
    "ratePerHectare": 50,
    "status": "Ativo"
  },
  {
    "id": "M05",
    "name": "Leonir",
    "ratePerHectare": 50,
    "status": "Ativo"
  },
  {
    "id": "M06",
    "name": "Chico",
    "ratePerHectare": 50,
    "status": "Ativo"
  }
];

export const initialAreas: Area[] = [
  {
    "id": "A01",
    "name": "Rogerio Boa esperança",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A02",
    "name": "Pedagio lavinia",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A03",
    "name": "Fechamento 04  05.06",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A04",
    "name": "Fechamen to 05",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A05",
    "name": "GUARACI",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A06",
    "name": "TAIAÇU",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A07",
    "name": "BURITIZAL",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A08",
    "name": "STA Aracangua",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A09",
    "name": "CAMPANELLI CAPIM",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A10",
    "name": "GASTÃO VIDIGAL",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A11",
    "name": "FAZENDA MONÇÕES",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A12",
    "name": "Fazenda sargento sebastinopolis",
    "culture": "Silagem",
    "sizeHectares": 150
  }
];

export const initialMaquinas: Maquina[] = [
  {
    "id": "MA01",
    "name": "JD7250",
    "type": "Trator"
  },
  {
    "id": "MA02",
    "name": "LECÃO",
    "type": "Trator"
  },
  {
    "id": "MA03",
    "name": "CLAUDINEI 1620",
    "type": "Caminhão"
  },
  {
    "id": "MA04",
    "name": "CAMINHÃO",
    "type": "Caminhão"
  },
  {
    "id": "MA05",
    "name": "RAMOS SILAGEM - FR 9050",
    "type": "Trator"
  },
  {
    "id": "MA06",
    "name": "CARGO 2425",
    "type": "Caminhão"
  },
  {
    "id": "MA07",
    "name": "CARGO 2631",
    "type": "Caminhão"
  },
  {
    "id": "MA08",
    "name": "CONSTELLATION",
    "type": "Caminhão"
  },
  {
    "id": "MA09",
    "name": "RAMOS SILAGEM - FR 700",
    "type": "Trator"
  },
  {
    "id": "MA10",
    "name": "MB EDUARDO",
    "type": "Caminhão"
  },
  {
    "id": "MA11",
    "name": "MULA",
    "type": "Caminhão"
  },
  {
    "id": "MA12",
    "name": "CAWBOY",
    "type": "Trator"
  },
  {
    "id": "MA13",
    "name": "CONSTELEITION",
    "type": "Trator"
  },
  {
    "id": "MA14",
    "name": "CARRETA VW",
    "type": "Caminhão"
  },
  {
    "id": "MA15",
    "name": "PÁ CARREGADEIRA",
    "type": "Trator"
  },
  {
    "id": "MA16",
    "name": "2220 RODRIGO",
    "type": "Caminhão"
  },
  {
    "id": "MA17",
    "name": "2220 bigode",
    "type": "Caminhão"
  },
  {
    "id": "MA18",
    "name": "COWBOY",
    "type": "Trator"
  },
  {
    "id": "MA19",
    "name": "2213 LEONIR mula",
    "type": "Caminhão"
  },
  {
    "id": "MA20",
    "name": "VOLKS 31 JOTA",
    "type": "Caminhão"
  },
  {
    "id": "MA21",
    "name": "CONSTELLATION CHICO",
    "type": "Caminhão"
  },
  {
    "id": "MA22",
    "name": "Gago",
    "type": "Trator"
  },
  {
    "id": "MA23",
    "name": "2220",
    "type": "Trator"
  },
  {
    "id": "MA24",
    "name": "1318 COWBOY",
    "type": "Trator"
  },
  {
    "id": "MA25",
    "name": "2213",
    "type": "Trator"
  }
];

export const initialProducoes: Producao[] = [];

export const getEntityColor = (name: string) => {
  if (!name || name === '—' || name === '-') return {
    bg: 'bg-slate-500/5',
    text: 'text-slate-400',
    border: 'border-slate-500/10',
    style: 'background:rgba(255,255,255,0.05); color:#94a3b8; border:1px solid rgba(255,255,255,0.1);'
  };
  
  const colors = [
    { bg: 'bg-emerald-500/12', text: 'text-emerald-400', border: 'border-emerald-500/20', style: 'background:rgba(20,184,166,0.12); color:#2dd4bf; border:1px solid rgba(20,184,166,0.25);' },
    { bg: 'bg-blue-500/12', text: 'text-blue-400', border: 'border-blue-500/20', style: 'background:rgba(59,130,246,0.12); color:#60a5fa; border:1px solid rgba(59,130,246,0.25);' },
    { bg: 'bg-purple-500/12', text: 'text-purple-400', border: 'border-purple-500/20', style: 'background:rgba(168,85,247,0.12); color:#c084fc; border:1px solid rgba(168,85,247,0.25);' },
    { bg: 'bg-amber-500/12', text: 'text-amber-400', border: 'border-amber-500/20', style: 'background:rgba(245,158,11,0.12); color:#fbbf24; border:1px solid rgba(245,158,11,0.25);' },
    { bg: 'bg-rose-500/12', text: 'text-rose-400', border: 'border-rose-500/20', style: 'background:rgba(244,63,94,0.12); color:#fb7185; border:1px solid rgba(244,63,94,0.25);' },
    { bg: 'bg-cyan-500/12', text: 'text-cyan-400', border: 'border-cyan-500/20', style: 'background:rgba(6,182,212,0.12); color:#22d3ee; border:1px solid rgba(6,182,212,0.25);' },
    { bg: 'bg-indigo-500/12', text: 'text-indigo-400', border: 'border-indigo-500/20', style: 'background:rgba(99,102,241,0.12); color:#818cf8; border:1px solid rgba(99,102,241,0.25);' },
    { bg: 'bg-orange-500/12', text: 'text-orange-400', border: 'border-orange-500/20', style: 'background:rgba(249,115,22,0.12); color:#ff9d3f; border:1px solid rgba(249,115,22,0.25);' }
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};
