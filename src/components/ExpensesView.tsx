import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Trash2, 
  Plus, 
  Receipt, 
  Calendar, 
  DollarSign, 
  ChevronDown, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';
import { Expense, ClientOrVehicle } from '../types';
import { getEntityColor } from '../utils/agroHelpers';

interface ExpensesViewProps {
  expenses: Expense[];
  clientsAndVehicles: ClientOrVehicle[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
  onExport: () => void;
}

const todayISO = () => new Date().toISOString().split('T')[0];

export default function ExpensesView({ 
  expenses, 
  clientsAndVehicles,
  onAddExpense, 
  onDeleteExpense,
  onExport 
}: ExpensesViewProps) {
  // Dynamic default date ranges from expenses
  const dates = useMemo(() => {
    if (expenses.length === 0) return { start: todayISO(), end: todayISO(), latest: todayISO() };
    const sorted = [...expenses].map(e => e.date).sort();
    return { start: sorted[0], end: sorted[sorted.length - 1], latest: sorted[sorted.length - 1] };
  }, [expenses]);

  // Quick launch inputs
  const [formDataStr, setFormDataStr] = useState('');
  const [formType, setFormType] = useState<Expense['type']>('alimentação');
  const [formValue, setFormValue] = useState('');
  const [formMachine, setFormMachine] = useState('');
  const [formDriver, setFormDriver] = useState('');
  const [formError, setFormError] = useState('');

  // Search and Filter inputs
  const [typeFilter, setTypeFilter] = useState('Todos os Tipos');
  const [machineFilter, setMachineFilter] = useState('Todas as Máquinas');
  const [driverFilter, setDriverFilter] = useState('Todos os Motoristas');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Initialize dates once expenses are loaded
  React.useEffect(() => {
    if (expenses.length > 0) {
      if (!formDataStr) setFormDataStr(dates.latest);
      if (!startDate) setStartDate(dates.start);
      if (!endDate) setEndDate(dates.end);
    }
  }, [expenses, dates]);

  // Extract machines and drivers dynamically
  const machinesList = useMemo(() => {
    const list = clientsAndVehicles
      .filter(item => item.type === 'Máquina' || item.type === 'Caminhão')
      .map(item => item.name);
    const extras = ['JD7250', 'LECÃO', 'CLAUDINEI 1620', 'CAMINHÃO', 'AMOS SILAGEM - FR 700', '2220 RODRIGO', 'CONSTELLATION CHICO', 'COWBOY', '2213 LEONIR mula'];
    extras.forEach(ext => {
      if (!list.includes(ext)) list.push(ext);
    });
    return Array.from(new Set(list)).sort();
  }, [clientsAndVehicles]);

  const driversList = useMemo(() => {
    const list = clientsAndVehicles
      .filter(item => item.responsible && item.responsible !== '-')
      .map(item => item.responsible.split(' ')[0]);
    clientsAndVehicles
      .filter(item => item.type === 'Cliente/Setor')
      .forEach(item => {
        const name = item.name.split(' ')[0];
        if (!list.includes(name)) list.push(name);
      });
    const extras = ['Rogério', 'Marcos', 'Chico', 'Rodrigo', 'Leonir', 'Cowboy'];
    extras.forEach(ext => {
      if (!list.includes(ext)) list.push(ext);
    });
    return Array.from(new Set(list)).sort();
  }, [clientsAndVehicles]);

  // Submit quick entry
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const val = parseFloat(formValue.replace(',', '.'));
    if (isNaN(val) || val <= 0) {
      setFormError('Insira um valor válido maior que zero.');
      return;
    }

    if (!formDataStr) {
      setFormError('Selecione uma data.');
      return;
    }

    onAddExpense({
      date: formDataStr,
      type: formType,
      value: val,
      machineName: formMachine || undefined,
      responsibleName: formDriver || undefined
    });

    setFormValue('');
    setFormMachine('');
    setFormDriver('');
    alert('Despesa registrada com sucesso!');
  };

  // Filters logic
  const filteredExpenses = useMemo(() => {
    const list = expenses.filter(exp => {
      // Type matches
      const matchesType = typeFilter === 'Todos os Tipos' || exp.type === typeFilter.toLowerCase();
      
      // Machine matches
      const matchesMachine = machineFilter === 'Todas as Máquinas' || exp.machineName === machineFilter;

      // Driver matches
      const matchesDriver = driverFilter === 'Todos os Motoristas' || exp.responsibleName === driverFilter;

      // Date range matches
      const matchesDate = (!startDate || exp.date >= startDate) && (!endDate || exp.date <= endDate);

      return matchesType && matchesMachine && matchesDriver && matchesDate;
    });

    // Sort list by date
    return list.sort((a, b) => {
      if (sortOrder === 'desc') {
        return b.date.localeCompare(a.date);
      } else {
        return a.date.localeCompare(b.date);
      }
    });
  }, [expenses, typeFilter, machineFilter, driverFilter, sortOrder, startDate, endDate]);

  // Compute stats based on filtered expenses
  const stats = useMemo(() => {
    const total = filteredExpenses.reduce((sum, e) => sum + e.value, 0);

    // Type totals for largest category
    const typeTotals: Record<string, number> = {};
    filteredExpenses.forEach(e => {
      typeTotals[e.type] = (typeTotals[e.type] || 0) + e.value;
    });

    // Find highest type
    let largestType: string = 'diesel';
    let largestVal = 0;
    Object.entries(typeTotals).forEach(([type, val]) => {
      if (val > largestVal) {
        largestVal = val;
        largestType = type;
      }
    });

    return {
      total,
      largestType,
      largestVal,
      count: filteredExpenses.length,
      typeTotals
    };
  }, [filteredExpenses]);

  const filteredTotal = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.value, 0);
  }, [filteredExpenses]);

  // Format date helper
  const formatDateToDisplay = (dateStr: string): string => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const day = parts[2];
        const monthNum = parseInt(parts[1], 10);
        const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
        const month = monthNames[monthNum - 1] || 'jun';
        const year = parts[0].substring(2);
        return `${day}/${month}/${year}`;
      }
    } catch (e) {
      // fallback
    }
    return dateStr;
  };

  // Format currency helper
  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getBulletColor = (type: string) => {
    switch (type) {
      case 'alimentação':
        return 'bg-slate-500';
      case 'gasolina':
        return 'bg-blue-500';
      case 'diesel':
        return 'bg-emerald-600';
      case 'pedágio':
        return 'bg-purple-400';
      default:
        return 'bg-[#002046]';
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-slate-50 flex flex-col gap-6">
      {/* Context Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 shrink-0">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#002046] mb-2">Controle de Gastos</h1>
          <p className="text-sm text-slate-500">Gerencie e analise as despesas operacionais.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white text-[#002046] font-semibold text-xs tracking-wider uppercase rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Exportar Relatório</span>
          </button>
        </div>
      </div>

      {/* Widgets & KPI Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 shrink-0">
        {/* Quick Entry Form (4 columns) */}
        <div className="col-span-1 lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-display text-sm font-bold text-[#002046] mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Plus className="w-4 h-4 text-[#002046]" />
              <span>Lançamento Rápido</span>
            </h4>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-2.5 text-xs font-semibold flex items-center gap-1.5 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Data</label>
                <input 
                  type="date" 
                  value={formDataStr}
                  onChange={(e) => setFormDataStr(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm text-slate-700 font-sans outline-none focus:ring-1 focus:ring-[#002046]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Tipo de Despesa</label>
                <div className="relative">
                  <select 
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as Expense['type'])}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm text-slate-700 appearance-none bg-transparent outline-none focus:ring-1 focus:ring-[#002046]"
                  >
                    <option value="alimentação">Alimentação</option>
                    <option value="gasolina">Gasolina</option>
                    <option value="diesel">Diesel</option>
                    <option value="pedágio">Pedágio</option>
                    <option value="manutenção">Manutenção</option>
                    <option value="hospedagem">Hospedagem</option>
                    <option value="abastecimento">Abastecimento</option>
                    <option value="outro">Outro</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Valor (R$)</label>
                <input 
                  type="text" 
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  placeholder="0,00"
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm text-right font-mono text-slate-800 outline-none focus:ring-1 focus:ring-[#002046]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Máquina / Veículo (Opcional)</label>
                <div className="relative">
                  <select 
                    value={formMachine}
                    onChange={(e) => setFormMachine(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm text-slate-700 appearance-none bg-transparent outline-none focus:ring-1 focus:ring-[#002046]"
                  >
                    <option value="">Sem máquina/veículo</option>
                    {machinesList.map(mach => (
                      <option key={mach} value={mach}>{mach}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Motorista / Funcionário (Opcional)</label>
                <div className="relative">
                  <select 
                    value={formDriver}
                    onChange={(e) => setFormDriver(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm text-slate-700 appearance-none bg-transparent outline-none focus:ring-1 focus:ring-[#002046]"
                  >
                    <option value="">Sem motorista/funcionário</option>
                    {driversList.map(driver => (
                      <option key={driver} value={driver}>{driver}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-[#002046] text-white font-bold text-xs tracking-wider uppercase py-3 rounded-lg hover:bg-[#1b365d] transition-colors shadow-sm cursor-pointer"
                >
                  Registrar Despesa
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* KPIs & Chart (8 columns) */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 shrink-0">
            {/* KPI 1: Total Period */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Despesa Total (Período)</p>
              <p className="font-mono text-2xl font-bold text-[#002046] mt-2 tracking-tight">
                {formatBRL(stats.total)}
              </p>
            </div>

            {/* KPI 2: Largest category */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Maior Gasto</p>
              <p className="text-sm font-bold text-slate-800 mt-2 uppercase">{stats.largestType}</p>
              <p className="font-mono text-lg font-bold text-emerald-700">{formatBRL(stats.largestVal)}</p>
            </div>

            {/* KPI 3: Count */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Lançamentos</p>
              <p className="font-mono text-3xl font-bold text-slate-600 mt-2">{stats.count}</p>
            </div>
          </div>

          {/* Distribution chart */}
          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-100 pb-2">
              Distribuição de Gastos
            </h4>
            
            {/* Custom interactive gauge bars */}
            <div className="flex-1 w-full bg-slate-50 rounded-xl flex items-end gap-3 p-4 min-h-[100px]">
              {Object.keys(stats.typeTotals).length === 0 ? (
                <div className="w-full text-center text-xs text-slate-400 py-8">Nenhuma despesa para exibir</div>
              ) : (
                Object.entries(stats.typeTotals).map(([type, val]) => {
                  const typeTotal = val as number;
                  const max = Math.max(...(Object.values(stats.typeTotals) as number[]), 1);
                  const heightPct = (typeTotal / max) * 100;
                  
                  return (
                    <div key={type} className="flex-1 h-full flex flex-col justify-end items-center relative group">
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] py-1 px-2 rounded font-mono shadow-md z-30 whitespace-nowrap pointer-events-none">
                        <span className="capitalize">{type}: </span> <strong>{formatBRL(typeTotal)}</strong>
                      </div>
                      {/* Bar */}
                      <div 
                        className={`w-full rounded-t transition-all duration-300 cursor-pointer ${getBulletColor(type)} hover:brightness-110 shadow-2xs`}
                        style={{ height: `${Math.max(heightPct, 4)}%` }}
                      />
                      <span className="text-[9px] uppercase font-bold text-slate-400 mt-1.5 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                        {type}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expense Data Grid */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex-1 flex flex-col min-h-[350px]">
        {/* Table Filters/Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap gap-4 items-center justify-between shrink-0">
          <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
            {/* Filter select */}
            <div className="relative">
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-3 pr-8 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#002046]"
              >
                <option>Todos os Tipos</option>
                <option>Alimentação</option>
                <option>Gasolina</option>
                <option>Diesel</option>
                <option>Pedágio</option>
                <option>Manutenção</option>
                <option>Hospedagem</option>
                <option>Abastecimento</option>
                <option>Outro</option>
              </select>
            </div>

            {/* Machine Filter select */}
            <div className="relative">
              <select 
                value={machineFilter}
                onChange={(e) => setMachineFilter(e.target.value)}
                className="pl-3 pr-8 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#002046]"
              >
                <option>Todas as Máquinas</option>
                {machinesList.map(mach => (
                  <option key={mach} value={mach}>{mach}</option>
                ))}
              </select>
            </div>

            {/* Driver Filter select */}
            <div className="relative">
              <select 
                value={driverFilter}
                onChange={(e) => setDriverFilter(e.target.value)}
                className="pl-3 pr-8 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#002046]"
              >
                <option>Todos os Motoristas</option>
                {driversList.map(driver => (
                  <option key={driver} value={driver}>{driver}</option>
                ))}
              </select>
            </div>

            {/* Range filters */}
            <div className="flex items-center gap-2 border border-slate-200 rounded-lg bg-white px-2 py-1 shrink-0">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-xs font-medium text-slate-600 bg-transparent outline-none cursor-pointer"
              />
              <span className="text-slate-300 text-xs uppercase font-bold">até</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-xs font-medium text-slate-600 bg-transparent outline-none cursor-pointer"
               />
            </div>

            {/* Sorting select */}
            <div className="relative">
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
                className="pl-3 pr-8 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#002046]"
              >
                <option value="desc">📅 Mais Recentes Primeiro</option>
                <option value="asc">📅 Mais Antigas Primeiro</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Exibindo {filteredExpenses.length} registros
            </div>
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-3.5 py-1.5 shadow-2xs">
              <span className="text-[10px] font-extrabold text-red-400 uppercase tracking-wider">Total Filtrado:</span>
              <span className="font-mono text-sm font-black text-red-600">
                R$ {filteredTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed List table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-sans text-xs font-bold uppercase tracking-wider text-slate-400">
                <th 
                  onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')} 
                  className="py-3.5 px-4 w-32 cursor-pointer hover:text-slate-800 hover:bg-slate-100 transition-colors select-none"
                  title="Clique para ordenar por data"
                >
                  Data {sortOrder === 'desc' ? '▼' : '▲'}
                </th>
                <th className="py-3.5 px-4 w-40">Despesa</th>
                <th className="py-3.5 px-4">Máquina/Veículo</th>
                <th className="py-3.5 px-4">Motorista/Responsável</th>
                <th className="py-3.5 px-4 w-40 text-right">Valor (R$)</th>
                <th className="py-3.5 px-4 w-16 text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-700 divide-y divide-slate-100">
              {filteredExpenses.map((exp) => {
                const getBadgeClass = (typeStr: string) => {
                  const t = (typeStr || '').toLowerCase().trim();
                  if (t === 'diesel') return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
                  if (t === 'gasolina') return 'bg-indigo-50 text-indigo-700 border border-indigo-100';
                  if (t === 'alimentação') return 'bg-amber-50 text-amber-700 border border-amber-100';
                  if (t === 'manutenção') return 'bg-rose-50 text-rose-700 border border-rose-100';
                  if (t === 'hospedagem') return 'bg-sky-50 text-sky-700 border border-sky-100';
                  if (t === 'pedágio') return 'bg-pink-50 text-pink-700 border border-pink-100';
                  if (t === 'abastecimento') return 'bg-orange-50 text-orange-700 border border-orange-100';
                  return 'bg-slate-50 text-slate-700 border border-slate-100';
                };
                return (
                  <tr 
                    key={exp.id} 
                    className="hover:bg-slate-50/80 transition-colors bg-white"
                  >
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-500">
                    {formatDateToDisplay(exp.date)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getBadgeClass(exp.type)} shadow-3xs`}>
                      {exp.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    {exp.machineName ? (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getEntityColor(exp.machineName).bg} ${getEntityColor(exp.machineName).text} border ${getEntityColor(exp.machineName).border} shadow-3xs`}>
                        {exp.machineName}
                      </span>
                    ) : <span className="text-slate-300 font-normal">-</span>}
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    {exp.responsibleName ? (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getEntityColor(exp.responsibleName).bg} ${getEntityColor(exp.responsibleName).text} border ${getEntityColor(exp.responsibleName).border} shadow-3xs`}>
                        {exp.responsibleName}
                      </span>
                    ) : <span className="text-slate-300 font-normal">-</span>}
                  </td>
                  <td className={`py-3.5 px-4 text-right font-mono text-sm text-slate-800 font-bold`}>
                    {exp.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button 
                      onClick={() => onDeleteExpense(exp.id)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors cursor-pointer"
                      title="Excluir lançamento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                );
              })}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Nenhuma despesa encontrada para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
            {/* Table total footer */}
            <tfoot className="bg-slate-50 border-t-2 border-[#002046] font-display text-sm font-bold text-[#002046] sticky bottom-0">
              <tr>
                <td colSpan={4} className="py-4 px-4 font-bold">TOTAL GERAL</td>
                <td className="py-4 px-4 text-right font-mono font-black text-base text-[#002046]">
                  {filteredTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
