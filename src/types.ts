export interface ClientOrVehicle {
  id: string;
  name: string;
  type: 'Máquina' | 'Caminhão' | 'Cliente/Setor';
  details: string;
  plateOrFleet: string;
  responsible: string;
  status: 'Ativo' | 'Inativo' | 'Manutenção';
  rate?: number;
}

export interface HourlyReading {
  initial: string; // Keep as string for form fields (e.g. "9070.69")
  final: string;   // Keep as string for form fields
}

export interface MachineConfig {
  id: string;
  name: string;
  ratePerHour: number;
  readings: Record<string, HourlyReading>; // key is date (e.g., "18/jun", "09/jun")
}

export interface LocalitySheet {
  id: string;
  name: string;
  machines: MachineConfig[];
  dates: string[];
}

export interface Expense {
  id: string;
  date: string; // e.g. "2023-06-17"
  type: 'alimentação' | 'gasolina' | 'diesel' | 'pedágio' | 'manutenção' | 'hospedagem' | 'abastecimento' | 'outro';
  value: number;
  machineName?: string;
  responsibleName?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}
