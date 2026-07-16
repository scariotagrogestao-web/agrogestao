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
  Scale
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

interface DashboardViewProps {
  localitySheets: LocalitySheet[];
  expenses: Expense[];
  clientsAndVehicles: ClientOrVehicle[];
  onNavigate: (view: string) => void;
  onExport: () => void;
}

export default function DashboardView({ 
  localitySheets, 
  expenses, 
  clientsAndVehicles,
  onNavigate,
  onExport 
}: DashboardViewProps) {
  const [selectedLocality, setSelectedLocality] = useState<string>('all');
  const [selectedMachine, setSelectedMachine] = useState<string>('all');
  const [selectedDriver, setSelectedDriver] = useState<string>('all');
  const [selectedExpenseType, setSelectedExpenseType] = useState<string>('all');

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

  const stats = useMemo(() => {
    let totalHours = 0;
    let totalMachineHours = 0;
    let totalTruckHours = 0;
    let totalRevenue = 0;
    const machineRevenueMap: Record<string, number> = {};
    const machineStatsMap: Record<string, { name: string; totalHours: number; ratePerHour: number; totalRevenue: number }> = {};
    const localityHoursMap: Record<string, number> = {};

    localitySheets.forEach(sheet => {
      if (selectedLocality !== 'all' && sheet.id !== selectedLocality) return;

      sheet.machines.forEach(machine => {
        if (selectedMachine !== 'all' && machine.name !== selectedMachine) return;

        const driverName = getDriverForMachine(machine.name);
        if (selectedDriver !== 'all' && driverName !== selectedDriver) return;

        let machineHours = 0;
        (Object.values(machine.readings) as HourlyReading[]).forEach(reading => {
          machineHours += calculateHours(reading.initial, reading.final);
        });

        const rev = machineHours * machine.ratePerHour;
        totalHours += machineHours;
        totalRevenue += rev;

        const normalizedMachineName = machine.name.toLowerCase().replace(/\s/g, '');
        const vehicle = clientsAndVehicles?.find(v => v.name.toLowerCase().replace(/\s/g, '') === normalizedMachineName || v.name.toLowerCase().includes(machine.name.toLowerCase()) || machine.name.toLowerCase().includes(v.name.toLowerCase()));
        
        const isTruck = vehicle 
          ? vehicle.type === 'Caminhão' 
          : (machine.name.toLowerCase().includes('caminhão') || 
             machine.name.toLowerCase().includes('1620') || 
             machine.name.toLowerCase().includes('volks') || 
             machine.name.toLowerCase().includes('cargo') || 
             machine.name.toLowerCase().includes('constellation') || 
             machine.name.toLowerCase().includes('mula') || 
             machine.name.toLowerCase().includes('cowboy') || 
             machine.name.toLowerCase().includes('rodrigo') || 
             machine.name.toLowerCase().includes('bigode') || 
             machine.name.toLowerCase().includes('eduardo') ||
             machine.name.toLowerCase().includes('carreta'));

        if (isTruck) {
          totalTruckHours += machineHours;
        } else {
          totalMachineHours += machineHours;
        }

        localityHoursMap[sheet.name] = (localityHoursMap[sheet.name] || 0) + machineHours;
        machineRevenueMap[machine.name] = (machineRevenueMap[machine.name] || 0) + rev;

        if (!machineStatsMap[machine.name]) {
          machineStatsMap[machine.name] = {
            name: machine.name,
            totalHours: 0,
            ratePerHour: machine.ratePerHour,
            totalRevenue: 0
          };
        }
        machineStatsMap[machine.name].totalHours += machineHours;
        machineStatsMap[machine.name].totalRevenue += rev;
      });
    });

    const machineStatsList = Object.values(machineStatsMap).sort((a, b) => b.totalRevenue - a.totalRevenue);

    const localityHoursList = Object.entries(localityHoursMap)
      .map(([name, hours]) => ({ name, hours: parseFloat(hours.toFixed(2)) }))
      .sort((a, b) => b.hours - a.hours);

    return {
      totalHours: parseFloat(totalHours.toFixed(2)),
      totalMachineHours: parseFloat(totalMachineHours.toFixed(2)),
      totalTruckHours: parseFloat(totalTruckHours.toFixed(2)),
      totalRevenue,
      machineRevenueMap,
      machineStatsList,
      localityHoursList
    };
  }, [localitySheets, selectedLocality, selectedMachine, selectedDriver, clientsAndVehicles]);

  const expenseStats = useMemo(() => {
    const filteredExpenses = expenses.filter(exp => {
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
  }, [expenses, selectedExpenseType, selectedMachine, selectedDriver]);

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
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-5 shadow-sm flex flex-wrap gap-5 items-center justify-between shrink-0">
        <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2 flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
            Filtros
          </span>
          
          <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
            <span className="text-[10px] uppercase font-bold text-slate-500">Fazenda / Localidade</span>
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="bg-white border-b-2 border-slate-200 rounded-t-md text-sm font-bold px-3 py-2 text-slate-700 focus:outline-none focus:border-[#002046] focus:bg-slate-50 cursor-pointer transition-colors shadow-sm"
            >
              <option value="all">Todas as Fazendas</option>
              {localitySheets.map(sheet => (
                <option key={sheet.id} value={sheet.id}>{sheet.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
            <span className="text-[10px] uppercase font-bold text-slate-500">Máquina / Veículo</span>
            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="bg-white border-b-2 border-slate-200 rounded-t-md text-sm font-bold px-3 py-2 text-slate-700 focus:outline-none focus:border-[#002046] focus:bg-slate-50 cursor-pointer transition-colors shadow-sm"
            >
              <option value="all">Todas as Máquinas</option>
              {machinesList.map(mach => (
                <option key={mach} value={mach}>{mach}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
            <span className="text-[10px] uppercase font-bold text-slate-500">Motorista</span>
            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              className="bg-white border-b-2 border-slate-200 rounded-t-md text-sm font-bold px-3 py-2 text-slate-700 focus:outline-none focus:border-[#002046] focus:bg-slate-50 cursor-pointer transition-colors shadow-sm"
            >
              <option value="all">Todos os Motoristas</option>
              {driversList.map(driver => (
                <option key={driver} value={driver}>{driver}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
            <span className="text-[10px] uppercase font-bold text-slate-500">Tipo de Gasto</span>
            <select
              value={selectedExpenseType}
              onChange={(e) => setSelectedExpenseType(e.target.value)}
              className="bg-white border-b-2 border-slate-200 rounded-t-md text-sm font-bold px-3 py-2 text-slate-700 focus:outline-none focus:border-[#002046] focus:bg-slate-50 cursor-pointer transition-colors shadow-sm"
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
            setSelectedLocality('all');
            setSelectedMachine('all');
            setSelectedDriver('all');
            setSelectedExpenseType('all');
          }}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300/50 rounded-xl text-xs font-bold text-slate-600 transition-colors cursor-pointer mt-4 md:mt-0"
        >
          Limpar Filtros
        </button>
      </div>

      {/* Interactive KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-2 shrink-0">
        
        {/* KPI 1: Horas Totais */}
        <div 
          onClick={() => onNavigate('hours')}
          className="bg-gradient-to-br from-blue-600 to-blue-700 border border-blue-500 rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group"
          title="Clique para ir para Apontamento de Horas-Máquina"
        >
          {/* Watermark icon */}
          <Tractor className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-[-15deg] group-hover:scale-110 group-hover:rotate-[-5deg] transition-all duration-700" />
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h4 className="text-xs font-black text-blue-100 uppercase tracking-widest group-hover:text-white transition-colors">Total Horas</h4>
            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
              <Tractor className="text-white group-hover:text-white w-5 h-5 transition-colors" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 relative z-10">
            <span className="font-mono text-4xl font-black text-white tracking-tighter">{stats.totalHours.toLocaleString('pt-BR')}</span>
            <span className="text-sm text-blue-100 font-bold">hrs</span>
          </div>
        </div>

        {/* KPI 2: Valor Bruto / Receita */}
        <div 
          onClick={() => onNavigate('hours')}
          className="bg-gradient-to-br from-[#002046] to-slate-900 border border-slate-700 rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group"
          title="Clique para detalhar nas Planilhas de Horímetros"
        >
          <DollarSign className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 rotate-[15deg] group-hover:scale-110 transition-all duration-700" />
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">Faturamento</h4>
            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
              <DollarSign className="text-white w-5 h-5 transition-colors" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 relative z-10">
            <span className="text-sm font-bold text-slate-300 mr-0.5">R$</span>
            <span className="font-mono text-3xl md:text-4xl font-black text-white tracking-tighter">
              {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        {/* KPI 3: Despesas Totais */}
        <div 
          onClick={() => onNavigate('expenses')}
          className="bg-gradient-to-br from-red-500 to-red-600 border border-red-400 rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group"
          title="Clique para ir para Lançamentos de Gastos"
        >
          <Receipt className="absolute -right-2 -bottom-2 w-32 h-32 text-white/10 rotate-[-10deg] group-hover:scale-110 transition-all duration-700" />
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h4 className="text-xs font-black text-red-100 uppercase tracking-widest group-hover:text-white transition-colors">Despesas</h4>
            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
              <Receipt className="text-white w-5 h-5 transition-colors" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 relative z-10">
            <span className="text-sm font-bold text-red-100 mr-0.5">R$</span>
            <span className="font-mono text-3xl md:text-4xl font-black text-white tracking-tighter">
              {expenseStats.total.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        {/* KPI 4: Margem Líquida */}
        <div 
          onClick={() => onNavigate('expenses')}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 border border-emerald-400 rounded-2xl p-6 relative overflow-hidden shadow-md hover:shadow-xl hover:shadow-emerald-900/20 hover:scale-105 transition-all duration-300 cursor-pointer group"
          title="Clique para detalhar DRE e Gastos"
        >
          <TrendingUp className="absolute -right-2 -bottom-2 w-32 h-32 text-white/10 rotate-[10deg] group-hover:scale-110 transition-all duration-700" />
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h4 className="text-xs font-black text-emerald-100 uppercase tracking-widest group-hover:text-white transition-colors">Saldo Líquido</h4>
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm group-hover:bg-white/20 transition-colors">
              <TrendingUp className="text-white w-5 h-5 transition-colors" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 relative z-10">
            <span className="text-sm font-bold text-emerald-200 mr-0.5">R$</span>
            <span className="font-mono text-3xl md:text-4xl font-black text-white tracking-tighter drop-shadow-sm">
              {(stats.totalRevenue - expenseStats.total).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-8 h-8 text-white/50" />
          </div>
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
                <th className="py-4 px-5">Máquina / Veículo</th>
                <th className="py-4 px-5">Operador</th>
                <th className="py-4 px-5 text-center">Horas Acumuladas</th>
                <th className="py-4 px-5 text-right">Valor Hora</th>
                <th className="py-4 px-5 text-right">Faturamento Bruto</th>
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
                  <td className="py-4 px-5 text-center font-mono font-bold text-slate-600">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-700 border border-slate-200">
                      {item.totalHours.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} h
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right font-mono font-medium text-slate-500">
                    R$ {item.ratePerHour.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-5 text-right font-mono font-black text-[#002046] text-base">
                    R$ {item.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
                );
              })}
              {stats.machineStatsList.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-sm font-medium">
                    Nenhuma máquina encontrada para os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
            {stats.machineStatsList.length > 0 && (
              <tfoot className="bg-slate-50 border-t border-slate-200 font-display text-sm font-bold text-slate-800">
                <tr>
                  <td colSpan={2} className="py-5 px-5 font-black text-slate-600 uppercase tracking-widest text-xs">Totais da Seleção</td>
                  <td className="py-5 px-5 text-center font-mono font-black text-slate-700 text-base">
                    {stats.machineStatsList.reduce((sum, item) => sum + item.totalHours, 0).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} h
                  </td>
                  <td className="py-5 px-5 text-right text-slate-400 font-normal text-xs"></td>
                  <td className="py-5 px-5 text-right font-mono font-black text-emerald-700 text-lg">
                    {stats.machineStatsList.reduce((sum, item) => sum + item.totalRevenue, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
