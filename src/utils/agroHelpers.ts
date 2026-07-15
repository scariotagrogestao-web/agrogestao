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
    "id": "MOT_1",
    "name": "Ramos",
    "phone": "",
    "cnh": "",
    "status": "ativo"
  },
  {
    "id": "MOT_2",
    "name": "Rodrigo",
    "phone": "",
    "cnh": "",
    "status": "ativo"
  },
  {
    "id": "MOT_3",
    "name": "Chico",
    "phone": "",
    "cnh": "",
    "status": "ativo"
  },
  {
    "id": "MOT_4",
    "name": "Cowboy",
    "phone": "",
    "cnh": "",
    "status": "ativo"
  },
  {
    "id": "MOT_5",
    "name": "Leonir",
    "phone": "",
    "cnh": "",
    "status": "ativo"
  },
  {
    "id": "MOT_6",
    "name": "Bigode",
    "phone": "",
    "cnh": "",
    "status": "ativo"
  },
  {
    "id": "MOT_7",
    "name": "Lecão",
    "phone": "",
    "cnh": "",
    "status": "ativo"
  },
  {
    "id": "MOT_8",
    "name": "Claudinei",
    "phone": "",
    "cnh": "",
    "status": "ativo"
  }
];

export const initialAreas: Area[] = [
  {
    "id": "A1",
    "name": "MATRIZ",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A2",
    "name": "GUARACI",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A3",
    "name": "TAIAÇU",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A4",
    "name": "BURITIZAL",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A5",
    "name": "STA Aracangua",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A6",
    "name": "CAMPANELLI CAPIM",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A7",
    "name": "GASTÃO VIDIGAL",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A8",
    "name": "FAZENDA MONÇÕES",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A9",
    "name": "Fazenda sargento sebastinopolis",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A10",
    "name": "Acerto",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A11",
    "name": "Fechamento 04  05.06",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A12",
    "name": "Fechamen to 05",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A13",
    "name": "Rogerio Boa esperança",
    "culture": "Silagem",
    "sizeHectares": 150
  },
  {
    "id": "A14",
    "name": "Pedagio lavinia",
    "culture": "Silagem",
    "sizeHectares": 150
  }
];

export const initialMaquinas: Maquina[] = [
  {
    "id": "MQ_1",
    "name": "RAMOS SILAGEM - FR 700",
    "type": "trator",
    "brand": "Desconhecida",
    "status": "ativo"
  },
  {
    "id": "MQ_2",
    "name": "2220 RODRIGO",
    "type": "trator",
    "brand": "Desconhecida",
    "status": "ativo"
  },
  {
    "id": "MQ_3",
    "name": "CONSTELLATION CHICO",
    "type": "caminhao",
    "brand": "Desconhecida",
    "status": "ativo"
  },
  {
    "id": "MQ_4",
    "name": "COWBOY",
    "type": "trator",
    "brand": "Desconhecida",
    "status": "ativo"
  },
  {
    "id": "MQ_5",
    "name": "2213 LEONIR mula",
    "type": "trator",
    "brand": "Desconhecida",
    "status": "ativo"
  },
  {
    "id": "MQ_6",
    "name": "descrição",
    "type": "trator",
    "brand": "Desconhecida",
    "status": "ativo"
  },
  {
    "id": "MQ_7",
    "name": "Coluna3",
    "type": "trator",
    "brand": "Desconhecida",
    "status": "ativo"
  },
  {
    "id": "MQ_8",
    "name": "Coluna4",
    "type": "trator",
    "brand": "Desconhecida",
    "status": "ativo"
  },
  {
    "id": "MQ_9",
    "name": "Coluna5",
    "type": "trator",
    "brand": "Desconhecida",
    "status": "ativo"
  },
  {
    "id": "MQ_10",
    "name": "Gago",
    "type": "trator",
    "brand": "Desconhecida",
    "status": "ativo"
  },
  {
    "id": "MQ_11",
    "name": "RAMOS SILAGEM - FR 9050",
    "type": "trator",
    "brand": "Desconhecida",
    "status": "ativo"
  },
  {
    "id": "MQ_12",
    "name": "CARGO 2425",
    "type": "caminhao",
    "brand": "Desconhecida",
    "status": "ativo"
  },
  {
    "id": "MQ_13",
    "name": "CARGO 2631",
    "type": "caminhao",
    "brand": "Desconhecida",
    "status": "ativo"
  },
  {
    "id": "MQ_14",
    "name": "CONSTELLATION",
    "type": "caminhao",
    "brand": "Desconhecida",
    "status": "ativo"
  },
  {
    "id": "MQ_15",
    "name": "JD7250",
    "type": "trator",
    "brand": "Desconhecida",
    "status": "ativo"
  },
  {
    "id": "MQ_16",
    "name": "LECÃO",
    "type": "trator",
    "brand": "Desconhecida",
    "status": "ativo"
  },
  {
    "id": "MQ_17",
    "name": "CLAUDINEI 1620",
    "type": "caminhao",
    "brand": "Desconhecida",
    "status": "ativo"
  },
  {
    "id": "MQ_18",
    "name": "CAMINHÃO",
    "type": "caminhao",
    "brand": "Desconhecida",
    "status": "ativo"
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
