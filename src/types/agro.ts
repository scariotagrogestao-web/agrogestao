export interface Motorista {
  id: string;
  name: string;
  ratePerHectare: number; // Valor pago por hectare trabalhado (ex: R$ 60,00)
  status: 'Ativo' | 'Inativo';
}

export interface Area {
  id: string;
  name: string; // Ex: "Fazenda Santa Maria", "Talhão Norte"
  culture: string; // Cultura plantada (Ex: "Milho", "Soja", "Algodão")
  sizeHectares: number;
}

export interface Maquina {
  id: string;
  name: string; // Ex: "Colheitadeira FR 700"
  type: 'Colheitadeira' | 'Trator' | 'Caminhão' | 'Outro';
}

export interface Producao {
  id: string;
  date: string; // YYYY-MM-DD
  semana: string; // Ex: "Semana 28/2026"
  maquinaId: string;
  motoristaId: string;
  areaId: string;
  hectares: number; // Hectares trabalhados
  toneladas: number; // Toneladas produzidas/colhidas
}
