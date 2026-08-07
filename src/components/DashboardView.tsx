import React, { useState, useMemo } from 'react';
import { 
  Tractor, 
  DollarSign, 
  Receipt, 
  TrendingUp, 
  Download, 
  ChevronRight, 
  FileText,
  Sparkles,
  Layers,
  Scale,
  Calendar,
  AlertCircle,
  Filter
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { LocalitySheet, Expense, HourlyReading, ClientOrVehicle } from '../types';
import { Producao, Motorista } from '../types/agro';
import { calculateSilagemRevenue, calculateDriverCosts, isTruckVehicle } from '../utils/agroHelpers';

interface DashboardViewProps {
  localitySheets: LocalitySheet[];
  expenses: Expense[];
  clientsAndVehicles: ClientOrVehicle[];
  producoes?: Producao[];
  motoristas?: Motorista[];
  onNavigate: (view: string) => void;
  onExport: () => void;
}

const getFirstDayOfMonthISO = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
};

const getTodayISO = () => {
  return new Date().toISOString().split('T')[0];
};

function parseReadingDateToISO(dateStr: string, defaultYear = 2026): string | null {
  if (!dateStr) return null;
  const clean = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(clean)) {
    const [d, m, y] = clean.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  const ptMonths: Record<string, string> = {
    jan: '01', fev: '02', mar: '03', abr: '04', mai: '05', jun: '06',
    jul: '07', ago: '08', set: '09', out: '10', nov: '11', dez: '12'
  };
  const parts = clean.toLowerCase().split('/');
  if (parts.length === 2) {
    const day = parts[0].padStart(2, '0');
    const monthKey = parts[1].slice(0, 3);
    if (ptMonths[monthKey]) return `${defaultYear}-${ptMonths[monthKey]}-${day}`;
    if (/^\d{1,2}$/.test(parts[1])) return `${defaultYear}-${parts[1].padStart(2, '0')}-${day}`;
  }
  return null;
}

export default function DashboardView({ 
  localitySheets, 
  expenses, 
  clientsAndVehicles,
  producoes = [],
  motoristas = [],
  onNavigate,
  onExport 
}: DashboardViewProps) {
  const [startDate, setStartDate] = useState<string>(getFirstDayOfMonthISO);
  const [endDate, setEndDate] = useState<string>(getTodayISO);
  const [selectedLocality, setSelectedLocality] = useState<string>('all');
  const [selectedMachine, setSelectedMachine] = useState<string>('all');
  const [selectedDriver, setSelectedDriver] = useState<string>('all');
  const [selectedExpenseType, setSelectedExpenseType] = useState<string>('all');

  const dateError = useMemo(() => {
    if (startDate && endDate && startDate > endDate) {
      return 'Data inicial não pode ser posterior à data final.';
    }
    return '';
  }, [startDate, endDate]);

  const handlePreset = (type: 'today' | '7days' | '30days' | 'thisMonth' | 'prevMonth') => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (type === 'today') {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (type === '7days') {
      const d = new Date();
      d.setDate(d.getDate() - 6);
      setStartDate(d.toISOString().split('T')[0]);
      setEndDate(todayStr);
    } else if (type === '30days') {
      const d = new Date();
      d.setDate(d.getDate() - 29);
      setStartDate(d.toISOString().split('T')[0]);
      setEndDate(todayStr);
    } else if (type === 'thisMonth') {
      setStartDate(getFirstDayOfMonthISO());
      setEndDate(todayStr);
    } else if (type === 'prevMonth') {
      const firstPrev = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastPrev = new Date(today.getFullYear(), today.getMonth(), 0);
      setStartDate(firstPrev.toISOString().split('T')[0]);
      setEndDate(lastPrev.toISOString().split('T')[0]);
    }
  };

  const calculateHours = (initial: string, final: string): number => {
    const init = parseFloat(initial);
    const fin = parseFloat(final);
    if (isNaN(init) || isNaN(fin) || fin < init) return 0;
    return fin - init;
  };

  const getDriverForMachine = (machineName: string): string => {
    const normalizedName = machineName.toLowerCase().replace(/\s/g, '');
    const found = clientsAndVehicles?.find(item => {
      const itemNorm = item.name.toLowerCase().replace(/\s/g, '');
      return itemNorm === normalizedName || item.name.toLowerCase().includes(machineName.toLowerCase()) || machineName.toLowerCase().includes(item.name.toLowerCase());
    });
    if (found && found.responsible && found.responsible !== '-') {
      return found.responsible.split(' ')[0];
    }
    
    if (machineName.toLowerCase().includes('rogerio')) return 'Rogério';
    if (machineName.toLowerCase().includes('marcos')) return 'Marcos';
    if (machineName.toLowerCase().includes('chico')) return 'Chico';
    if (machineName.toLowerCase().includes('rodrigo')) return 'Rodrigo';
    if (machineName.toLowerCase().includes('leonir')) return 'Leonir';
    if (machineName.toLowerCase().includes('cowboy')) return 'Cowboy';
    if (machineName.toLowerCase().includes('claudinei')) return 'Marcos';
    
    return 'Geral';
  };

  const machinesList = useMemo(() => {
    const list = new Set<string>();
    localitySheets.forEach(sheet => {
      sheet.machines.forEach(m => list.add(m.name));
    });
    expenses.forEach(e => {
      if (e.machineName) list.add(e.machineName);
    });
    return Array.from(list).sort();
  }, [localitySheets, expenses]);

  const driversList = useMemo(() => {
    const list = new Set<string>();
    localitySheets.forEach(sheet => {
      sheet.machines.forEach(m => list.add(getDriverForMachine(m.name)));
    });
    expenses.forEach(e => {
      if (e.responsibleName) list.add(e.responsibleName);
    });
    return Array.from(list).sort();
  }, [localitySheets, expenses, clientsAndVehicles]);

  const expenseStats = useMemo(() => {
    if (dateError) {
      return { total: 0, typeTotals: {}, dieselPct: 0, filteredExpenses: [] };
    }

    const filteredExpenses = expenses.filter(exp => {
      if (startDate && exp.date < startDate) return false;
      if (endDate && exp.date > endDate) return false;
      if (selectedExpenseType !== 'all' && exp.type !== selectedExpenseType.toLowerCase()) return false;
      if (selectedMachine !== 'all' && exp.machineName !== selectedMachine) return false;
      if (selectedDriver !== 'all' && exp.responsibleName !== selectedDriver) return false;
      return true;
    });

    const total = filteredExpenses.reduce((sum, exp) => sum + exp.value, 0);
    
    const typeTotals: Record<string, number> = {};
    filteredExpenses.forEach(exp => {
      typeTotals[exp.type] = (typeTotals[exp.type] || 0) + exp.value;
    });

    const dieselPct = total > 0 ? ((typeTotals.diesel || 0) / total) * 100 : 0;

    return {
      total,
      typeTotals,
      dieselPct,
      filteredExpenses
    };
  }, [expenses, selectedExpenseType, selectedMachine, selectedDriver, startDate, endDate, dateError]);

  const stats = useMemo(() => {
    if (dateError) {
      return {
        totalHours: 0,
        totalMachineHours: 0,
        totalTruckHours: 0,
        truckTotalCost: 0,
        silagemRevenue: 0,
        driverCosts: 0,
        directExpenses: 0,
        totalCosts: 0,
        netResult: 0,
        machineStatsList: [],
        localityHoursList: []
      };
    }

    let totalHours = 0;
    let totalMachineHours = 0;
    let totalTruckHours = 0;
    let truckTotalCost = 0;
    const machineStatsMap: Record<string, { name: string; isTruck: boolean; totalHours: number; ratePerHour: number; totalCost: number }> = {};
    const localityHoursMap: Record<string, number> = {};

    localitySheets.forEach(sheet => {
      if (selectedLocality !== 'all' && sheet.id !== selectedLocality) return;

      sheet.machines.forEach(machine => {
        if (selectedMachine !== 'all' && machine.name !== selectedMachine) return;

        const driverName = getDriverForMachine(machine.name);
        if (selectedDriver !== 'all' && driverName !== selectedDriver) return;

        let machineHours = 0;
        Object.entries(machine.readings).forEach(([dateKey, reading]) => {
          const readingISO = parseReadingDateToISO(dateKey);
          if (startDate && readingISO && readingISO < startDate) return;
          if (endDate && readingISO && readingISO > endDate) return;

          machineHours += calculateHours(reading.initial, reading.final);
        });

        totalHours += machineHours;
        const isTruck = isTruckVehicle(machine.name, clientsAndVehicles);
        const cost = machineHours * machine.ratePerHour;

        if (isTruck) {
          totalTruckHours += machineHours;
          truckTotalCost += cost;
        } else {
          totalMachineHours += machineHours;
        }

        localityHoursMap[sheet.name] = (localityHoursMap[sheet.name] || 0) + machineHours;

        if (!machineStatsMap[machine.name]) {
          machineStatsMap[machine.name] = {
            name: machine.name,
            isTruck,
            totalHours: 0,
            ratePerHour: machine.ratePerHour,
            totalCost: 0
          };
        }
        machineStatsMap[machine.name].totalHours += machineHours;
        machineStatsMap[machine.name].totalCost += cost;
      });
    });

    const machineStatsList = Object.values(machineStatsMap).sort((a, b) => b.totalHours - a.totalHours);

    const localityHoursList = Object.entries(localityHoursMap)
      .map(([name, hours]) => ({ name, hours: parseFloat(hours.toFixed(2)) }))
      .sort((a, b) => b.hours - a.hours);

    // Nova Regra Financeira com filtro de datas:
    const filteredProducoes = producoes.filter(p => {
      if (startDate && p.date < startDate) return false;
      if (endDate && p.date > endDate) return false;
      return true;
    });

    // 1. Receita de Silagem (no período)
    const silagemRevenue = calculateSilagemRevenue(filteredProducoes);
    
    // 2. Custos Totais = Despesas Lançadas + Custos Operacionais de Caminhões + Pagamento de Motoristas (no período)
    const driverCosts = calculateDriverCosts(filteredProducoes, motoristas);
    const directExpenses = expenseStats.total;
    const totalCosts = directExpenses + truckTotalCost + driverCosts;

    // 3. Resultado Líquido (Lucro/Prejuízo) = Receita - Custos
    const netResult = silagemRevenue - totalCosts;

    return {
      totalHours: parseFloat(totalHours.toFixed(2)),
      totalMachineHours: parseFloat(totalMachineHours.toFixed(2)),
      totalTruckHours: parseFloat(totalTruckHours.toFixed(2)),
      truckTotalCost,
      silagemRevenue,
      driverCosts,
      directExpenses,
      totalCosts,
      netResult,
      machineStatsList,
      localityHoursList
    };
  }, [localitySheets, selectedLocality, selectedMachine, selectedDriver, clientsAndVehicles, producoes, motoristas, expenseStats.total, startDate, endDate, dateError]);


  const chartData = useMemo(() => {
    const uniqueDates = Array.from(new Set(expenseStats.filteredExpenses.map(e => e.date))).sort();
    const dates = uniqueDates.slice(-15);
    
    const formatToDisplay = (dateStr: string) => {
      try {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const day = parts[2];
          const monthNum = parseInt(parts[1], 10);
          const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
          const month = months[monthNum - 1] || 'jun';
          return `${day}/${month}`;
        }
      } catch (e) {}
      return dateStr;
    };

    const data = dates.map(d => ({
      name: formatToDisplay(d),
      rawDate: d,
      alimentação: 0,
      diesel: 0,
      gasolina: 0,
      pedágio: 0,
      manutenção: 0,
      hospedagem: 0,
      abastecimento: 0,
      outro: 0,
    }));

    expenseStats.filteredExpenses.forEach(exp => {
      const entry = data.find(item => item.rawDate === exp.date);
      if (entry) {
        const type = exp.type as keyof typeof entry;
        if (entry[type] !== undefined) {
          (entry[type] as number) += exp.value;
        } else {
          (entry as any)['outro'] += exp.value;
        }
      }
    });

    return data;
  }, [expenseStats.filteredExpenses]);

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleExportDashboardCSV = () => {
    const csvRows = [];
    csvRows.push("### RELATORIO DE EXPORTACAO DO DASHBOARD OPERACIONAL ###");
    csvRows.push(`Exportado em:;${new Date().toLocaleString('pt-BR')}`);
    csvRows.push("");

    csvRows.push("RESUMO FINANCEIRO GERAL");
    csvRows.push(`Horas Totais Trabalhadas;${stats.totalHours.toLocaleString('pt-BR')} h`);
    csvRows.push(`Faturamento Projetado;R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    csvRows.push(`Total de Despesas Lançadas;R$ ${expenseStats.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    csvRows.push(`Saldo Liquido Operacional;R$ ${(stats.totalRevenue - expenseStats.total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    csvRows.push("");

    csvRows.push("HORAS POR LOCALIDADE / FAZENDA");
    csvRows.push("Fazenda;Horas Trabalhadas;Percentual %");
    stats.localityHoursList.forEach(l => {
      const pct = stats.totalHours > 0 ? (l.hours / stats.totalHours) * 100 : 0;
      csvRows.push(`"${l.name}";${l.hours.toLocaleString('pt-BR')};${pct.toFixed(1)}%`);
    });
    csvRows.push("");

    csvRows.push("DESEMPENHO POR MAQUINA / VEICULO");
    csvRows.push("Veículo/Máquina;Responsável;Horas Acumuladas;Tarifa R$/h;Total Acumulado R$");
    stats.machineStatsList.forEach(m => {
      csvRows.push(`"${m.name}";"${getDriverForMachine(m.name)}";${m.totalHours.toLocaleString('pt-BR')};${m.ratePerHour.toLocaleString('pt-BR')};${m.totalRevenue.toLocaleString('pt-BR')}`);
    });

    const csvContent = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `dashboard_relatorio_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
      return (
        <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-xl shadow-xl z-50">
          <p className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-2 text-center">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-3 text-xs mb-1">
              <div className="flex items-center gap-1.5 flex-1 text-slate-600 font-medium">
                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
                <span className="capitalize">{entry.name}</span>
              </div>
              <span className="font-mono font-bold text-slate-800">
                {formatBRL(entry.value)}
              </span>
            </div>
          ))}
          <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-800">
            <span>Total:</span>
            <span className="font-mono text-[#002046]">{formatBRL(total)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 shrink-0 bg-white/50 p-4 rounded-2xl border border-white backdrop-blur shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="font-display text-2xl font-black text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-[#002046] to-emerald-600">
              Painel Operacional
            </h3>
            <span className="bg-emerald-500/10 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-500/20">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Real-time
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Acompanhe o faturamento, despesas e a produtividade da frota.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportDashboardCSV}
            className="px-5 py-2.5 bg-gradient-to-r from-[#002046] to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-sans text-xs tracking-wider uppercase font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer border-none"
            title="Exportar dados resumidos do Dashboard para Excel/CSV"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Exportar Dashboard</span>
          </button>
        </div>
      </div>

      {/* Dashboard Global Filters Panel */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-5 shadow-sm flex flex-col gap-4 shrink-0">
        {dateError && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-2.5 text-xs font-semibold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{dateError}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-4 items-end justify-between">
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider h-9 mr-1">
              <Filter className="w-4 h-4 text-emerald-700" />
              <span>Filtros do Dashboard:</span>
            </div>

            {/* Data Inicial */}
            <div className="flex flex-col gap-1 w-full sm:w-36">
              <span className="text-[10px] uppercase font-bold text-slate-400">Data Inicial</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border-b-2 border-slate-200 rounded-t-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-600 outline-none cursor-pointer"
              />
            </div>

            {/* Data Final */}
            <div className="flex flex-col gap-1 w-full sm:w-36">
              <span className="text-[10px] uppercase font-bold text-slate-400">Data Final</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border-b-2 border-slate-200 rounded-t-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-600 outline-none cursor-pointer"
              />
            </div>

            {/* Fazenda / Localidade */}
            <div className="flex flex-col gap-1 w-full sm:w-48">
              <span className="text-[10px] uppercase font-bold text-slate-400">Fazenda / Localidade</span>
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="w-full bg-slate-50 border-b-2 border-slate-200 rounded-t-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-600 outline-none cursor-pointer"
              >
                <option value="all">Todas as Áreas / Fazendas</option>
                {localitySheets.map(sheet => (
                  <option key={sheet.id} value={sheet.id}>{sheet.name}</option>
                ))}
              </select>
            </div>

            {/* Máquina / Veículo */}
            <div className="flex flex-col gap-1 w-full sm:w-44">
              <span className="text-[10px] uppercase font-bold text-slate-400">Máquina / Veículo</span>
              <select
                value={selectedMachine}
                onChange={(e) => setSelectedMachine(e.target.value)}
                className="w-full bg-slate-50 border-b-2 border-slate-200 rounded-t-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-600 outline-none cursor-pointer"
              >
                <option value="all">Todas as Máquinas</option>
                {machinesList.map(mach => (
                  <option key={mach} value={mach}>{mach}</option>
                ))}
              </select>
            </div>

            {/* Motorista */}
            <div className="flex flex-col gap-1 w-full sm:w-40">
              <span className="text-[10px] uppercase font-bold text-slate-400">Motorista</span>
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="w-full bg-slate-50 border-b-2 border-slate-200 rounded-t-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-600 outline-none cursor-pointer"
              >
                <option value="all">Todos os Motoristas</option>
                {driversList.map(driver => (
                  <option key={driver} value={driver}>{driver}</option>
                ))}
              </select>
            </div>

            {/* Tipo de Gasto */}
            <div className="flex flex-col gap-1 w-full sm:w-36">
              <span className="text-[10px] uppercase font-bold text-slate-400">Tipo de Gasto</span>
              <select
                value={selectedExpenseType}
                onChange={(e) => setSelectedExpenseType(e.target.value)}
                className="w-full bg-slate-50 border-b-2 border-slate-200 rounded-t-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-600 outline-none cursor-pointer"
              >
                <option value="all">Todos os Gastos</option>
                <option value="alimentação">Alimentação</option>
                <option value="gasolina">Gasolina</option>
                <option value="diesel">Diesel</option>
                <option value="pedágio">Pedágio</option>
                <option value="manutenção">Manutenção</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              setStartDate(getFirstDayOfMonthISO());
              setEndDate(getTodayISO());
              setSelectedLocality('all');
              setSelectedMachine('all');
              setSelectedDriver('all');
              setSelectedExpenseType('all');
            }}
            className="px-4 py-2 border border-slate-200 bg-white text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shrink-0 cursor-pointer shadow-sm ml-auto"
          >
            Limpar Filtros
          </button>
        </div>

        {/* Atalhos Rápidos de Período */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3 text-[11px] font-semibold text-slate-500">
          <span className="text-slate-400 mr-1 text-[10px] uppercase font-bold">Atalhos Rápidos:</span>
          <button
            onClick={() => handlePreset('today')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 rounded-md transition-colors cursor-pointer"
          >
            Hoje
          </button>
          <button
            onClick={() => handlePreset('7days')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 rounded-md transition-colors cursor-pointer"
          >
            Últimos 7 dias
          </button>
          <button
            onClick={() => handlePreset('30days')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 rounded-md transition-colors cursor-pointer"
          >
            Últimos 30 dias
          </button>
          <button
            onClick={() => handlePreset('thisMonth')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 rounded-md transition-colors cursor-pointer"
          >
            Este Mês
          </button>
          <button
            onClick={() => handlePreset('prevMonth')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 rounded-md transition-colors cursor-pointer"
          >
            Mês Anterior
          </button>
        </div>
      </div>

      {/* Interactive KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-2 shrink-0">
        
        {/* KPI 1: Horas Operacionais de Máquinas */}
        <div 
          onClick={() => onNavigate('hours')}
          className="bg-gradient-to-br from-blue-600 to-blue-700 border border-blue-500 rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group"
          title="Indicador Operacional de Máquinas (em horas)"
        >
          {/* Watermark icon */}
          <Tractor className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-[-15deg] group-hover:scale-110 group-hover:rotate-[-5deg] transition-all duration-700" />
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h4 className="text-xs font-black text-blue-100 uppercase tracking-widest group-hover:text-white transition-colors">Horas Máquinas</h4>
            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
              <Tractor className="text-white group-hover:text-white w-5 h-5 transition-colors" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 relative z-10">
            <span className="font-mono text-4xl font-black text-white tracking-tighter">{stats.totalMachineHours.toLocaleString('pt-BR')}</span>
            <span className="text-sm text-blue-100 font-bold">hrs</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 mt-2 block relative z-10">Indicador Operacional</span>
        </div>

        {/* KPI 2: Receita Exclusiva de Silagem */}
        <div 
          onClick={() => onNavigate('production')}
          className="bg-gradient-to-br from-[#002046] to-slate-900 border border-slate-700 rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group"
          title="Receita Faturada Proveniente da Produção de Silagem"
        >
          <DollarSign className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 rotate-[15deg] group-hover:scale-110 transition-all duration-700" />
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">Receita Silagem</h4>
            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
              <DollarSign className="text-white w-5 h-5 transition-colors" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 relative z-10">
            <span className="text-sm font-bold text-slate-300 mr-0.5">R$</span>
            <span className="font-mono text-3xl md:text-4xl font-black text-white tracking-tighter">
              {stats.silagemRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mt-2 block relative z-10">Faturamento da Safra</span>
        </div>

        {/* KPI 3: Custos & Despesas Totais */}
        <div 
          onClick={() => onNavigate('expenses')}
          className="bg-gradient-to-br from-amber-600 to-red-600 border border-red-400 rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group"
          title="Soma de Despesas Gerais, Custos de Caminhões e Motoristas"
        >
          <Receipt className="absolute -right-2 -bottom-2 w-32 h-32 text-white/10 rotate-[-10deg] group-hover:scale-110 transition-all duration-700" />
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h4 className="text-xs font-black text-red-100 uppercase tracking-widest group-hover:text-white transition-colors">Custos Totais</h4>
            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
              <Receipt className="text-white w-5 h-5 transition-colors" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 relative z-10">
            <span className="text-sm font-bold text-red-100 mr-0.5">R$</span>
            <span className="font-mono text-3xl md:text-4xl font-black text-white tracking-tighter">
              {stats.totalCosts.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200 mt-2 block relative z-10">Despesas + Caminhões/Motoristas</span>
        </div>

        {/* KPI 4: Resultado Líquido */}
        <div 
          onClick={() => onNavigate('expenses')}
          className={`bg-gradient-to-br ${stats.netResult >= 0 ? 'from-emerald-600 to-teal-700 border-emerald-500' : 'from-rose-600 to-red-800 border-rose-500'} border rounded-2xl p-6 relative overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group`}
          title="Resultado Líquido = Receita Silagem - Custos Totais"
        >
          <TrendingUp className="absolute -right-2 -bottom-2 w-32 h-32 text-white/10 rotate-[10deg] group-hover:scale-110 transition-all duration-700" />
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h4 className="text-xs font-black text-emerald-100 uppercase tracking-widest group-hover:text-white transition-colors">Resultado Líquido</h4>
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm group-hover:bg-white/20 transition-colors">
              <TrendingUp className="text-white w-5 h-5 transition-colors" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 relative z-10">
            <span className="text-sm font-bold text-white/80 mr-0.5">R$</span>
            <span className="font-mono text-3xl md:text-4xl font-black text-white tracking-tighter drop-shadow-sm">
              {stats.netResult.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/90 mt-2 block relative z-10">
            {stats.netResult >= 0 ? 'Lucro Operacional' : 'Prejuízo Operacional'}
          </span>
        </div>
      </div>

      {/* Additional clickable shortcuts for agricultural production */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 shrink-0">
        <div 
          onClick={() => onNavigate('safraDashboard')}
          className="bg-white/80 backdrop-blur-md border border-purple-200/60 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-purple-300 transition-all duration-300 cursor-pointer group flex justify-between items-center"
        >
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-500 block mb-1">Visão Geral</span>
            <span className="text-xl font-black text-slate-800 flex items-center gap-2 font-display">
              <Scale className="w-5 h-5 text-purple-600" />
              Métricas de Safra
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 group-hover:scale-110 transition-all">
            <ChevronRight className="w-5 h-5 text-purple-600" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('production')}
          className="bg-white/80 backdrop-blur-md border border-emerald-200/60 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-emerald-300 transition-all duration-300 cursor-pointer group flex justify-between items-center"
        >
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block mb-1">Novo Apontamento</span>
            <span className="text-xl font-black text-slate-800 flex items-center gap-2 font-display">
              <Layers className="w-5 h-5 text-emerald-600" />
              Lançar Produção
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 group-hover:scale-110 transition-all">
            <ChevronRight className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('payments')}
          className="bg-white/80 backdrop-blur-md border border-blue-200/60 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 cursor-pointer group flex justify-between items-center"
        >
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 block mb-1">Exportação</span>
            <span className="text-xl font-black text-slate-800 flex items-center gap-2 font-display">
              <FileText className="w-5 h-5 text-blue-600" />
              Relatórios
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-110 transition-all">
            <ChevronRight className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recharts Stacked Area (8 cols) */}
        <div className="col-span-1 lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl shadow-sm flex flex-col p-6">
          <div className="border-b border-slate-100 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h4 className="font-display text-lg font-bold text-slate-800">Composição de Gastos (Últimos dias)</h4>
              <p className="text-xs text-slate-500 font-medium">Análise visual da evolução das despesas por categoria</p>
            </div>
          </div>

          <div className="relative h-[350px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(val) => `R$ ${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    dx={-10}
                  />
                  <RechartsTooltip cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }} content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 600, color: '#475569' }} />
                  
                  <Bar dataKey="diesel" name="Diesel" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="gasolina" name="Gasolina" stackId="a" fill="#cbd5e1" />
                  <Bar dataKey="alimentação" name="Alimentação" stackId="a" fill="#10b981" />
                  <Bar dataKey="pedágio" name="Pedágio" stackId="a" fill="#a855f7" />
                  <Bar dataKey="manutenção" name="Manutenção" stackId="a" fill="#ef4444" />
                  <Bar dataKey="hospedagem" name="Hospedagem" stackId="a" fill="#ec4899" />
                  <Bar dataKey="abastecimento" name="Abastecimento" stackId="a" fill="#06b6d4" />
                  <Bar dataKey="outro" name="Outro" stackId="a" fill="#64748b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">
                Nenhum dado financeiro no período.
              </div>
            )}
          </div>
        </div>

        {/* Distribuição de Horas (4 cols) */}
        <div className="col-span-1 lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 mb-0 shrink-0 flex flex-col">
          <div className="border-b border-slate-100 pb-4 mb-4">
            <h4 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Horas por Fazenda
            </h4>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-5">
            {stats.localityHoursList.length === 0 ? (
              <div className="text-sm text-slate-400 py-8 text-center font-medium">Nenhum apontamento encontrado.</div>
            ) : (
              stats.localityHoursList.map((item, idx) => {
                const maxHours = Math.max(...stats.localityHoursList.map(h => h.hours), 1);
                const percent = (item.hours / maxHours) * 100;
                const barColors = [
                  'from-emerald-500 to-emerald-400',
                  'from-blue-500 to-blue-400',
                  'from-purple-500 to-purple-400',
                  'from-amber-500 to-amber-400',
                  'from-cyan-500 to-cyan-400'
                ];
                const colorClass = barColors[idx % barColors.length];

                return (
                  <div key={item.name} className="group cursor-default animate-in fade-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="flex justify-between items-end text-sm mb-1.5 font-bold text-slate-700">
                      <span className="truncate pr-2">{item.name}</span>
                      <span className="font-mono text-slate-800 font-black shrink-0">
                        {item.hours.toLocaleString('pt-BR')} h
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full rounded-full shadow-sm bg-gradient-to-r ${colorClass}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Machine Hours & Accumulated Values Table */}
      <div className="mt-2 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
              <Tractor className="w-5 h-5 text-[#002046]" />
              Desempenho por Máquina / Veículo
            </h4>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Acompanhamento de horas acumuladas e faturamento gerado.
            </p>
          </div>
          <button
            onClick={() => onNavigate('hours')}
            className="text-white bg-[#002046] hover:bg-slate-800 font-sans text-xs font-bold px-4 py-2.5 rounded-xl shadow-md self-stretch sm:self-auto flex justify-center items-center gap-2 transition-all cursor-pointer"
          >
            <span>Apontar Leituras</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 font-sans text-[11px] font-black uppercase tracking-widest text-slate-500">
                <th className="py-4 px-5">Equipamento / Veículo</th>
                <th className="py-4 px-5">Operador</th>
                <th className="py-4 px-5 text-center">Classificação</th>
                <th className="py-4 px-5 text-center">Horas Acumuladas</th>
                <th className="py-4 px-5 text-right">Tarifa (R$/h)</th>
                <th className="py-4 px-5 text-right">Custo / Tipo</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
              {stats.machineStatsList.map((item) => {
                return (
                  <tr 
                    key={item.name} 
                    className="hover:bg-slate-50/80 transition-colors duration-150 group"
                  >
                  <td className="py-4 px-5 font-bold text-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#002046]/5 flex items-center justify-center group-hover:bg-[#002046]/10 transition-colors">
                      <Tractor className="w-4 h-4 text-[#002046]/70" />
                    </div>
                    {item.name}
                  </td>
                  <td className="py-4 px-5 text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase">
                        {getDriverForMachine(item.name).substring(0, 2)}
                      </div>
                      {getDriverForMachine(item.name)}
                    </div>
                  </td>
                  <td className="py-4 px-5 text-center">
                    {item.isTruck ? (
                      <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                        Custo Operacional
                      </span>
                    ) : (
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                        Indicador Operacional
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-center font-mono font-bold text-slate-600">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-700 border border-slate-200">
                      {item.totalHours.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} h
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right font-mono font-medium text-slate-500">
                    R$ {item.ratePerHour.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-5 text-right font-mono font-bold text-slate-800 text-sm">
                    {item.isTruck ? (
                      <span className="text-red-700">R$ {item.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Custo)</span>
                    ) : (
                      <span className="text-blue-700">{item.totalHours.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} h (Indicador)</span>
                    )}
                  </td>
                </tr>
                );
              })}
              {stats.machineStatsList.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-sm font-medium">
                    Nenhuma máquina encontrada para os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
            {stats.machineStatsList.length > 0 && (
              <tfoot className="bg-slate-50 border-t border-slate-200 font-display text-sm font-bold text-slate-800">
                <tr>
                  <td colSpan={3} className="py-5 px-5 font-black text-slate-600 uppercase tracking-widest text-xs">Totais da Seleção</td>
                  <td className="py-5 px-5 text-center font-mono font-black text-slate-700 text-base">
                    {stats.machineStatsList.reduce((sum, item) => sum + item.totalHours, 0).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} h
                  </td>
                  <td className="py-5 px-5 text-right text-slate-400 font-normal text-xs"></td>
                  <td className="py-5 px-5 text-right font-mono font-black text-amber-700 text-base">
                    Custo Caminhões: R$ {stats.truckTotalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
