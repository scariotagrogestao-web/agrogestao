import React, { useState, useMemo } from 'react';
import { 
  Tractor, 
  DollarSign, 
  Receipt, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  ChevronRight, 
  FileText,
  MousePointerClick,
  Sparkles,
  Layers,
  Scale
} from 'lucide-react';
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

  // Helper: calculate hours for a single reading pair
  const calculateHours = (initial: string, final: string): number => {
    const init = parseFloat(initial);
    const fin = parseFloat(final);
    if (isNaN(init) || isNaN(fin) || fin < init) return 0;
    return fin - init;
  };

  // Helper: find driver associated with a machine
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

  // Extract machines and drivers dynamically
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

  // Compute stats based on selection
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
        // Filter by Machine
        if (selectedMachine !== 'all' && machine.name !== selectedMachine) return;

        // Filter by Driver
        const driverName = getDriverForMachine(machine.name);
        if (selectedDriver !== 'all' && driverName !== selectedDriver) return;

        let machineHours = 0;
        (Object.values(machine.readings) as HourlyReading[]).forEach(reading => {
          machineHours += calculateHours(reading.initial, reading.final);
        });

        const rev = machineHours * machine.ratePerHour;
        totalHours += machineHours;
        totalRevenue += rev;

        // Separate by Machine/Truck
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

  // Compute expense stats based on selection
  const expenseStats = useMemo(() => {
    const filteredExpenses = expenses.filter(exp => {
      // Expense Type filter
      if (selectedExpenseType !== 'all' && exp.type !== selectedExpenseType.toLowerCase()) return false;

      // Machine filter
      if (selectedMachine !== 'all' && exp.machineName !== selectedMachine) return false;

      // Driver filter
      if (selectedDriver !== 'all' && exp.responsibleName !== selectedDriver) return false;

      return true;
    });

    const total = filteredExpenses.reduce((sum, exp) => sum + exp.value, 0);
    
    // Type breakdown
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

  // Group expenses by date for the composition chart
  const chartData = useMemo(() => {
    const uniqueDates = Array.from(new Set(expenseStats.filteredExpenses.map(e => e.date))).sort();
    const dates = uniqueDates.slice(-6);
    
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

    const data = (dates as string[]).map(d => ({
      date: formatToDisplay(d),
      rawDate: d,
      alimentação: 0,
      diesel: 0,
      gasolina: 0,
      pedágio: 0,
      manutenção: 0,
      hospedagem: 0,
      abastecimento: 0,
      outro: 0,
      total: 0
    }));

    expenseStats.filteredExpenses.forEach(exp => {
      const entry = data.find(item => item.rawDate === exp.date);
      if (entry) {
        const type = exp.type as any;
        if (entry[type] !== undefined) {
          (entry as any)[type] += exp.value;
        } else {
          (entry as any)[type] = exp.value;
        }
        entry.total += exp.value;
      }
    });

    return data;
  }, [expenseStats.filteredExpenses]);

  const maxChartValue = useMemo(() => {
    const maxVal = Math.max(...chartData.map(d => d.total), 1);
    return Math.ceil(maxVal / 1000) * 1000;
  }, [chartData]);

  // Format currency
  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'gasolina':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'alimentação':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'diesel':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'pedágio':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // CSV Exporter for Dashboard Summary Data
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

  return (
    <div className="flex-1 overflow-auto bg-slate-50 fade-in">
      
      {/* Section Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-end gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="font-display text-xl font-bold text-slate-800">Painel Operacional Integrado</h3>
            <span className="bg-[#002046]/10 text-[#002046] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#002046]" />
              Interativo
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Acompanhe em tempo real faturamento, despesas operacionais e produtividade da frota.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportDashboardCSV}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-sans text-xs tracking-wider uppercase font-bold rounded-lg shadow-xs transition-all flex items-center gap-2 cursor-pointer border-none"
            title="Exportar dados resumidos do Dashboard para Excel/CSV"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Exportar Dashboard</span>
          </button>
        </div>
      </div>

      {/* Dashboard Global Filters Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-xs flex flex-wrap gap-4 items-center justify-between shrink-0">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">Filtros Gerais:</span>
          
          {/* Locality Select */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase font-bold text-slate-400">Fazenda / Localidade</span>
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#002046] cursor-pointer"
            >
              <option value="all">Todas as Fazendas</option>
              {localitySheets.map(sheet => (
                <option key={sheet.id} value={sheet.id}>{sheet.name}</option>
              ))}
            </select>
          </div>

          {/* Machine Select */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase font-bold text-slate-400">Máquina / Veículo</span>
            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#002046] cursor-pointer"
            >
              <option value="all">Todas as Máquinas</option>
              {machinesList.map(mach => (
                <option key={mach} value={mach}>{mach}</option>
              ))}
            </select>
          </div>

          {/* Driver Select */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase font-bold text-slate-400">Motorista / Funcionário</span>
            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#002046] cursor-pointer"
            >
              <option value="all">Todos os Motoristas</option>
              {driversList.map(driver => (
                <option key={driver} value={driver}>{driver}</option>
              ))}
            </select>
          </div>

          {/* Expense Type Select */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase font-bold text-slate-400">Tipo de Gasto</span>
            <select
              value={selectedExpenseType}
              onChange={(e) => setSelectedExpenseType(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#002046] cursor-pointer"
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
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Limpar Filtros
        </button>
      </div>

      {/* Interactive KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 shrink-0">
        
        {/* KPI 1: Horas Totais */}
        <div 
          onClick={() => onNavigate('hours')}
          className="bg-white border border-slate-200 rounded-xl p-5 relative overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
          title="Clique para ir para Apontamento de Horas-Máquina"
        >
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-emerald-700 transition-colors">Total Horas-Máquina</h4>
            <Tractor className="text-[#002046]/40 group-hover:text-emerald-700/60 w-5 h-5 transition-colors" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-black text-slate-800 tracking-tight">{stats.totalHours.toLocaleString('pt-BR')}</span>
            <span className="text-xs text-slate-500 font-medium">horas</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-[#5caf81] text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> Estável</span>
            <span className="opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity flex items-center gap-0.5">Detalhar <MousePointerClick className="w-3 h-3" /></span>
          </div>
        </div>

        {/* KPI 2: Valor Bruto / Receita */}
        <div 
          onClick={() => onNavigate('hours')}
          className="bg-white border border-slate-200 rounded-xl p-5 relative overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
          title="Clique para detalhar nas Planilhas de Horímetros"
        >
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-emerald-700 transition-colors">Faturamento Bruto</h4>
            <DollarSign className="text-emerald-700/40 group-hover:text-emerald-700/60 w-5 h-5 transition-colors" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-500 mr-0.5">R$</span>
            <span className="font-mono text-2xl font-black text-slate-800 tracking-tight">
              {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
            <span>R$ {(stats.totalHours > 0 ? stats.totalRevenue / stats.totalHours : 0).toFixed(0)}/h médio</span>
            <span className="opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity flex items-center gap-0.5">Ir para Planilha <MousePointerClick className="w-3 h-3" /></span>
          </div>
        </div>

        {/* KPI 3: Despesas Totais */}
        <div 
          onClick={() => onNavigate('expenses')}
          className="bg-white border border-slate-200 rounded-xl p-5 relative overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
          title="Clique para ir para Lançamentos de Gastos"
        >
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-red-700 transition-colors">Despesas Totais</h4>
            <Receipt className="text-red-600/40 group-hover:text-red-600/60 w-5 h-5 transition-colors" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-500 mr-0.5">R$</span>
            <span className="font-mono text-2xl font-black text-red-600 tracking-tight">
              {expenseStats.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between text-red-600 text-[10px] font-bold uppercase tracking-wider">
            <span>Diesel: {expenseStats.dieselPct.toFixed(0)}%</span>
            <span className="opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity flex items-center gap-0.5">Detalhar Gastos <MousePointerClick className="w-3 h-3" /></span>
          </div>
        </div>

        {/* KPI 4: Margem Líquida */}
        <div 
          onClick={() => onNavigate('expenses')}
          className="bg-white border border-slate-200 rounded-xl p-5 relative overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
          title="Clique para detalhar DRE e Gastos"
        >
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-emerald-700 transition-colors">Saldo / Margem Líquida</h4>
            <TrendingUp className="text-emerald-500/40 group-hover:text-emerald-500/60 w-5 h-5 transition-colors" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-500 mr-0.5">R$</span>
            <span className="font-mono text-2xl font-black text-emerald-700 tracking-tight">
              {(stats.totalRevenue - expenseStats.total).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
            <span>Margem: {stats.totalRevenue > 0 ? (((stats.totalRevenue - expenseStats.total) / stats.totalRevenue) * 100).toFixed(0) : 0}%</span>
            <span className="opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity flex items-center gap-0.5">Ver Histórico <MousePointerClick className="w-3 h-3" /></span>
          </div>
        </div>
      </div>

      {/* Additional clickable shortcuts for agricultural production */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 shrink-0">
        
        {/* KPI 5: Total Tons colhidas */}
        <div 
          onClick={() => onNavigate('safraDashboard')}
          className="bg-[#faf5ff] border border-purple-200 rounded-xl p-4 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex justify-between items-center"
          title="Clique para ver métricas de Safra"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block mb-1">Métricas de Safra</span>
            <span className="text-lg font-bold text-slate-800 flex items-center gap-1.5 font-mono">
              <Scale className="w-4.5 h-4.5 text-purple-600" />
              Safra Geral
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Clique para ver</span>
            <span className="text-xs font-bold text-purple-700 group-hover:underline flex items-center justify-end gap-0.5">Dashboard Safra <ChevronRight className="w-3 h-3" /></span>
          </div>
        </div>

        {/* KPI 6: Lançamentos de Produção */}
        <div 
          onClick={() => onNavigate('production')}
          className="bg-[#f0fdf4] border border-emerald-200 rounded-xl p-4 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex justify-between items-center"
          title="Clique para ir para Lançamentos de Colheita"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">Lançar Produção</span>
            <span className="text-lg font-bold text-slate-800 flex items-center gap-1.5 font-mono">
              <Layers className="w-4.5 h-4.5 text-emerald-700" />
              Lançamentos
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Clique para ver</span>
            <span className="text-xs font-bold text-emerald-700 group-hover:underline flex items-center justify-end gap-0.5">Inserir Colheita <ChevronRight className="w-3 h-3" /></span>
          </div>
        </div>

        {/* KPI 7: Relatório de Fechamento */}
        <div 
          onClick={() => onNavigate('payments')}
          className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex justify-between items-center"
          title="Clique para ir para Aba de Relatórios"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Relatórios Consolidado</span>
            <span className="text-lg font-bold text-slate-800 flex items-center gap-1.5 font-mono">
              <FileText className="w-4.5 h-4.5 text-slate-600" />
              Aba Relatórios
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Clique para ver</span>
            <span className="text-xs font-bold text-slate-600 group-hover:underline flex items-center justify-end gap-0.5">Filtrar & Exportar <ChevronRight className="w-3 h-3" /></span>
          </div>
        </div>

      </div>

      {/* worked hours by category grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 shrink-0">
        {/* Machine Hours Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Horas de Máquinas</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-mono text-2xl font-bold text-slate-800">{stats.totalMachineHours.toLocaleString('pt-BR')}</span>
            <span className="text-xs text-slate-500 font-medium">horas</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Colhedoras, Forrageiras e Tratores (FR 700, JD7250, etc.)</p>
        </div>

        {/* Truck Hours Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs border-l-4 border-l-blue-500">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Horas de Caminhões</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-mono text-2xl font-bold text-slate-800">{stats.totalTruckHours.toLocaleString('pt-BR')}</span>
            <span className="text-xs text-slate-500 font-medium">horas</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Caminhões de transbordo e logística (MB, Constellation, etc.)</p>
        </div>
      </div>

      {/* Horas por Cliente Chart Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6 shrink-0">
        <h4 className="font-display text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600" />
          Distribuição de Horas Trabalhadas por Cliente
        </h4>
        <div className="space-y-4">
          {stats.localityHoursList.length === 0 ? (
            <div className="text-xs text-slate-400 py-4 text-center">Nenhum dado de horas apontado.</div>
          ) : (
            stats.localityHoursList.map((item, idx) => {
              const maxHours = Math.max(...stats.localityHoursList.map(h => h.hours), 1);
              const percent = (item.hours / maxHours) * 100;
              const barColors = [
                'bg-emerald-600',
                'bg-blue-600',
                'bg-purple-600',
                'bg-amber-600',
                'bg-sky-600'
              ];
              const colorClass = barColors[idx % barColors.length];

              return (
                <div key={item.name} className="group cursor-pointer">
                  <div className="flex justify-between items-center text-xs mb-1 font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                    <span>{item.name}</span>
                    <span className="font-mono text-slate-800 font-bold">
                      {item.hours.toLocaleString('pt-BR')} horas ({stats.totalHours > 0 ? ((item.hours / stats.totalHours) * 100).toFixed(1) : '0'}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
                    <div 
                      className={`${colorClass} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Lower Grid: Chart & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart Area (8 cols) */}
        <div className="col-span-1 lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col p-6">
          <div className="border-b border-slate-100 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h4 className="font-display text-base font-bold text-slate-800">Composição de Gastos</h4>
            <div className="flex flex-wrap gap-2.5">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <div className="w-2.5 h-2.5 rounded-xs bg-[#002046]"></div> Alimentação
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <div className="w-2.5 h-2.5 rounded-xs bg-[#aec7f7]"></div> Diesel
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <div className="w-2.5 h-2.5 rounded-xs bg-slate-300"></div> Gasolina
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <div className="w-2.5 h-2.5 rounded-xs bg-purple-400"></div> Pedágio
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <div className="w-2.5 h-2.5 rounded-xs bg-red-400"></div> Manutenção
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <div className="w-2.5 h-2.5 rounded-xs bg-pink-400"></div> Hospedagem
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <div className="w-2.5 h-2.5 rounded-xs bg-cyan-500"></div> Abastecimento
              </span>
            </div>
          </div>

          {/* Custom Interactive Bars Container */}
          <div className="relative h-72 flex items-end w-full pl-12 pr-4 pb-6">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between items-end pr-2 border-r border-slate-200/50 text-[10px] font-mono text-slate-400">
              <span>{formatCompactBRL(maxChartValue)}</span>
              <span>{formatCompactBRL(maxChartValue * 0.75)}</span>
              <span>{formatCompactBRL(maxChartValue * 0.5)}</span>
              <span>{formatCompactBRL(maxChartValue * 0.25)}</span>
              <span>0</span>
            </div>

            {/* Bars container */}
            <div className="flex-1 h-full flex items-end justify-around relative pl-4">
              {/* Horizontal gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between z-0 pointer-events-none pb-6">
                <div className="w-full border-b border-slate-100 h-0"></div>
                <div className="w-full border-b border-slate-100 h-0"></div>
                <div className="w-full border-b border-slate-100 h-0"></div>
                <div className="w-full border-b border-slate-100 h-0"></div>
                <div className="w-full border-b border-slate-200 h-0"></div>
              </div>

              {chartData.map((day) => {
                const total = day.total;
                const totalHeightPct = total > 0 ? (total / maxChartValue) * 100 : 0;

                // Segment Heights Pct relative to total
                const alimentationPct = total > 0 ? (day.alimentação / total) * 100 : 0;
                const dieselPct = total > 0 ? (day.diesel / total) * 100 : 0;
                const gasolinaPct = total > 0 ? (day.gasolina / total) * 100 : 0;
                const pedagioPct = total > 0 ? (day.pedágio / total) * 100 : 0;
                const manutencaoPct = total > 0 ? (day.manutenção / total) * 100 : 0;
                const hospedagemPct = total > 0 ? (day.hospedagem / total) * 100 : 0;
                const abastecimentoPct = total > 0 ? (day.abastecimento / total) * 100 : 0;
                const outroPct = total > 0 ? (day.outro / total) * 100 : 0;

                return (
                  <div 
                    key={day.date} 
                    className="w-14 relative group flex flex-col justify-end z-10 transition-transform hover:scale-102"
                    style={{ height: `${Math.max(totalHeightPct, 2)}%` }}
                  >
                    {/* Interactive Tooltip showing breakdown details on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#002046] text-white text-[10px] rounded p-2.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 whitespace-nowrap shadow-md">
                      <div className="font-bold border-b border-white/20 pb-1 mb-1 text-center">{day.date}</div>
                      {day.alimentação > 0 && <div>Alimentação: {formatBRL(day.alimentação)}</div>}
                      {day.diesel > 0 && <div>Diesel: {formatBRL(day.diesel)}</div>}
                      {day.gasolina > 0 && <div>Gasolina: {formatBRL(day.gasolina)}</div>}
                      {day.pedágio > 0 && <div>Pedágio: {formatBRL(day.pedágio)}</div>}
                      {day.manutenção > 0 && <div>Manutenção: {formatBRL(day.manutenção)}</div>}
                      {day.hospedagem > 0 && <div>Hospedagem: {formatBRL(day.hospedagem)}</div>}
                      {day.abastecimento > 0 && <div>Abastecimento: {formatBRL(day.abastecimento)}</div>}
                      {day.outro > 0 && <div>Outro: {formatBRL(day.outro)}</div>}
                      <div className="font-bold text-[#aec7f7] mt-1 pt-1 border-t border-white/10 text-center">Total: {formatBRL(total)}</div>
                    </div>

                    {/* Stacked Bar segments */}
                    {total > 0 ? (
                      <div className="w-full h-full rounded-t overflow-hidden flex flex-col-reverse shadow-xs">
                        {/* Alimentação Segment */}
                        {day.alimentação > 0 && (
                          <div className="bg-[#002046] border-t border-white/10" style={{ height: `${alimentationPct}%` }} />
                        )}
                        {/* Diesel Segment */}
                        {day.diesel > 0 && (
                          <div className="bg-[#aec7f7] border-t border-white/10" style={{ height: `${dieselPct}%` }} />
                        )}
                        {/* Gasolina Segment */}
                        {day.gasolina > 0 && (
                          <div className="bg-slate-300 border-t border-white/10" style={{ height: `${gasolinaPct}%` }} />
                        )}
                        {/* Pedagio Segment */}
                        {day.pedágio > 0 && (
                          <div className="bg-purple-400 border-t border-white/10" style={{ height: `${pedagioPct}%` }} />
                        )}
                        {/* Manutenção Segment */}
                        {day.manutenção > 0 && (
                          <div className="bg-red-400 border-t border-white/10" style={{ height: `${manutencaoPct}%` }} />
                        )}
                        {/* Hospedagem Segment */}
                        {day.hospedagem > 0 && (
                          <div className="bg-pink-400 border-t border-white/10" style={{ height: `${hospedagemPct}%` }} />
                        )}
                        {/* Abastecimento Segment */}
                        {day.abastecimento > 0 && (
                          <div className="bg-cyan-500 border-t border-white/10" style={{ height: `${abastecimentoPct}%` }} />
                        )}
                        {/* Outro Segment */}
                        {day.outro > 0 && (
                          <div className="bg-slate-500 border-t border-white/10" style={{ height: `${outroPct}%` }} />
                        )}
                      </div>
                    ) : (
                      <div className="w-full bg-slate-100 h-1.5 rounded-t" />
                    )}

                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-slate-400 font-bold whitespace-nowrap">
                      {day.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activities Table (4 cols) */}
        <div className="col-span-1 lg:col-span-4 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col p-5">
          <div className="border-b border-slate-100 pb-4 mb-4 flex justify-between items-center">
            <h4 className="font-display text-sm font-bold text-slate-800">Últimas Despesas</h4>
            <button 
              onClick={() => onNavigate('expenses')}
              className="text-[#002046] font-sans text-[10px] font-bold tracking-wider hover:underline flex items-center gap-0.5 cursor-pointer border-none bg-transparent"
            >
              <span>VER TODAS</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 font-sans text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50">
                  <th className="py-2.5 px-3">Data</th>
                  <th className="py-2.5 px-3">Tipo</th>
                  <th className="py-2.5 px-3 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-700 divide-y divide-slate-100">
                {expenses.slice(-6).reverse().map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-500 font-medium">
                      {formatDateToDisplay(exp.date)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getBadgeColor(exp.type)}`}>
                        {exp.type}
                      </span>
                    </td>
                    <td className={`py-3 px-3 text-right font-mono font-bold ${exp.type === 'diesel' ? 'text-red-600 font-black' : 'text-slate-800'}`}>
                      {exp.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Machine Hours & Accumulated Values Table */}
      <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h4 className="font-display text-base font-bold text-slate-800 flex items-center gap-2">
              <Tractor className="w-5 h-5 text-[#002046]" />
              Relação de Horas e Valores por Máquina / Veículo
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Lista detalhada contendo horas acumuladas, valor hora e faturamento acumulado por veículo.
            </p>
          </div>
          <button
            onClick={() => onNavigate('hours')}
            className="text-[#002046] font-sans text-xs font-bold hover:underline flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs self-stretch sm:self-auto justify-center cursor-pointer"
          >
            <span>Lançar Leituras</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-sans text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Máquina / Veículo</th>
                <th className="py-3 px-4">Responsável / Motorista</th>
                <th className="py-3 px-4 text-center">Horas Acumuladas</th>
                <th className="py-3 px-4 text-right">Valor Hora (R$/h)</th>
                <th className="py-3 px-4 text-right">Valor Acumulado (R$)</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
              {stats.machineStatsList.map((item, index) => {
                const bg = index % 2 === 1 ? '#fdf9f0' : '#ffffff';
                return (
                  <tr 
                    key={item.name} 
                    className="hover:opacity-90 transition-opacity duration-150"
                    style={{ backgroundColor: bg }}
                  >
                  <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#002046]" />
                    {item.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {getDriverForMachine(item.name)}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-600">
                    {item.totalHours.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} h
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-600">
                    R$ {item.ratePerHour.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#002046]">
                    R$ {item.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
                );
              })}
              {stats.machineStatsList.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                    Nenhuma máquina correspondente encontrada para os filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
            {stats.machineStatsList.length > 0 && (
              <tfoot className="bg-slate-50 border-t-2 border-[#002046] font-display text-sm font-bold text-[#002046]">
                <tr>
                  <td colSpan={2} className="py-4 px-4 font-bold text-[#002046]">TOTAIS DO FILTRO</td>
                  <td className="py-4 px-4 text-center font-mono font-black text-[#002046]">
                    {stats.machineStatsList.reduce((sum, item) => sum + item.totalHours, 0).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} h
                  </td>
                  <td className="py-4 px-4 text-right text-slate-400 font-normal text-xs">-</td>
                  <td className="py-4 px-4 text-right font-mono font-black text-[#002046] text-base">
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

// Utility to display compact financial figures on Y axis
function formatCompactBRL(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`;
  }
  return value.toString();
}

// Convert YYYY-MM-DD to DD/mmm
function formatDateToDisplay(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const day = parts[2];
      const monthNum = parseInt(parts[1]);
      const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
      const month = months[monthNum - 1] || 'jun';
      return `${day}/${month}`;
    }
  } catch (e) {
    // fallback
  }
  return dateStr;
}
