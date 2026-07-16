import React, { useState, useMemo, useEffect } from 'react';
import { 
  Tractor, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Plus, 
  LayoutList, 
  List, 
  HelpCircle,
  TableProperties,
  Trash2
} from 'lucide-react';
import { LocalitySheet, MachineConfig, HourlyReading, ClientOrVehicle } from '../types';

interface MachineHoursViewProps {
  localitySheets: LocalitySheet[];
  clientsAndVehicles: ClientOrVehicle[];
  onUpdateReadings: (sheetId: string, machineId: string, date: string, reading: HourlyReading) => void;
  onAddMachine: (sheetId: string, machine: Partial<MachineConfig>) => void;
  onDeleteMachine: (sheetId: string, machineId: string) => void;
  onAddLocality: (name: string) => string;
  onDeleteLocality: (sheetId: string) => void;
  onAddDate: (sheetId: string, dateStr: string) => void;
  onExport: () => void;
}

export default function MachineHoursView({ 
  localitySheets, 
  clientsAndVehicles,
  onUpdateReadings, 
  onAddMachine,
  onDeleteMachine,
  onAddLocality,
  onDeleteLocality,
  onAddDate,
  onExport 
}: MachineHoursViewProps) {
  const [activeSheetId, setActiveSheetId] = useState<string>('guaraci-fr700');
  const [isCompact, setIsCompact] = useState<boolean>(false);

  // Column color palettes
  const palettes = [
    { bg: '#f0f7ff', header: '#dbeafe', border: '#bfdbfe', text: '#1e40af', dark: '#1e3a8a' }, // Blue
    { bg: '#f0fdf4', header: '#dcfce7', border: '#bbf7d0', text: '#15803d', dark: '#166534' }, // Green
    { bg: '#faf5ff', header: '#f3e8ff', border: '#e9d5ff', text: '#6b21a8', dark: '#581c87' }, // Purple
    { bg: '#fffbeb', header: '#fef3c7', border: '#fde68a', text: '#b45309', dark: '#78350f' }, // Amber
    { bg: '#fff1f2', header: '#ffe4e6', border: '#fecdd3', text: '#be123c', dark: '#881337' }, // Rose
    { bg: '#f0fdfa', header: '#ccfbf1', border: '#99f6e4', text: '#0f766e', dark: '#115e59' }  // Teal
  ];

  // Filter States
  const [selectedMachineFilter, setSelectedMachineFilter] = useState<string>('all');
  const [selectedDriverFilter, setSelectedDriverFilter] = useState<string>('all');

  // Modal states for adding machine/date/locality
  const [isAddMachineOpen, setIsAddMachineOpen] = useState(false);
  const [newMachName, setNewMachName] = useState('');
  const [newMachRate, setNewMachRate] = useState('');

  const [isAddDateOpen, setIsAddDateOpen] = useState(false);
  const [newDateStr, setNewDateStr] = useState('');

  const [isAddLocalityOpen, setIsAddLocalityOpen] = useState(false);
  const [newLocalityName, setNewLocalityName] = useState('');

  // Editing cell draft state
  const [editingCell, setEditingCell] = useState<{
    machineId: string;
    date: string;
    field: 'initial' | 'final';
    value: string;
  } | null>(null);

  // Column Widths for spreadsheet columns
  const [colWidths, setColWidths] = useState<Record<string, number>>({});

  const startResize = (e: React.MouseEvent, colKey: string) => {
    e.preventDefault();
    const startX = e.pageX;
    const startWidth = colWidths[colKey] || (colKey.endsWith('total') ? 50 : 55);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(45, startWidth + (moveEvent.pageX - startX));
      setColWidths(prev => ({
        ...prev,
        [colKey]: newWidth
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Find active sheet
  const activeSheet = useMemo(() => {
    return localitySheets.find(s => s.id === activeSheetId) || localitySheets[0] || { id: '', name: 'Nenhuma', machines: [], dates: [] };
  }, [localitySheets, activeSheetId]);

  // Helper: calculate hours for a single entry
  const calculateHours = (initial: string, final: string): number => {
    const init = parseFloat(initial);
    const fin = parseFloat(final);
    if (isNaN(init) || isNaN(fin) || fin < init) return 0;
    return fin - init;
  };

  // Helper: find driver associated with a machine
  const getDriverForMachine = (machineName: string): string => {
    const normalizedName = machineName.toLowerCase().replace(/\s/g, '');
    const found = clientsAndVehicles.find(item => {
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

  // Filtered Machines List
  const filteredMachines = useMemo(() => {
    return activeSheet.machines.filter(machine => {
      // Machine name matches
      const matchesMachine = selectedMachineFilter === 'all' || machine.id === selectedMachineFilter;

      // Driver matches
      const machineDriver = getDriverForMachine(machine.name);
      const matchesDriver = selectedDriverFilter === 'all' || machineDriver.toLowerCase() === selectedDriverFilter.toLowerCase();

      return matchesMachine && matchesDriver;
    });
  }, [activeSheet, selectedMachineFilter, selectedDriverFilter, clientsAndVehicles]);

  // Driver options in this sheet
  const driverOptions = useMemo(() => {
    const drivers = activeSheet.machines.map(m => getDriverForMachine(m.name));
    return Array.from(new Set(drivers)).sort();
  }, [activeSheet, clientsAndVehicles]);

  // Reset filters when active sheet changes
  useEffect(() => {
    setSelectedMachineFilter('all');
    setSelectedDriverFilter('all');
  }, [activeSheetId]);

  // Calculations for current sheet (based on filtered machines)
  const sheetStats = useMemo(() => {
    let totalHours = 0;
    let totalCost = 0;
    let totalMachinesCount = activeSheet.machines.length;
    let activeMachinesCount = 0;

    const machineTotals = filteredMachines.map(machine => {
      let machHours = 0;
      (Object.values(machine.readings) as HourlyReading[]).forEach(reading => {
        const hrs = calculateHours(reading.initial, reading.final);
        machHours += hrs;
      });

      if (machHours > 0) {
        activeMachinesCount++;
      }

      const cost = machHours * machine.ratePerHour;
      totalHours += machHours;
      totalCost += cost;

      return {
        machineId: machine.id,
        totalHours: machHours,
        totalCost: cost
      };
    });

    return {
      totalHours: parseFloat(totalHours.toFixed(2)),
      totalCost,
      totalMachinesCount,
      activeMachinesCount: filteredMachines.filter(m => {
        let h = 0;
        (Object.values(m.readings) as HourlyReading[]).forEach(r => { h += calculateHours(r.initial, r.final); });
        return h > 0;
      }).length,
      machineTotals
    };
  }, [activeSheet, filteredMachines]);

  const handleInputChange = (machineId: string, date: string, field: 'initial' | 'final', value: string) => {
    setEditingCell({ machineId, date, field, value });
  };

  const handleInputCommit = (machineId: string, date: string, field: 'initial' | 'final', value: string, originalValue: string) => {
    setEditingCell(null);
    const cleanVal = value.replace(',', '.').trim();
    const cleanOrig = originalValue.replace(',', '.').trim();
    if (cleanVal === cleanOrig) return;

    if (confirm(`Deseja realmente gravar a alteração de horímetro de "${cleanOrig || '-'}" para "${cleanVal || '-'}"?`)) {
      const machine = activeSheet.machines.find(m => m.id === machineId);
      const currentReading = machine?.readings[date] || { initial: '', final: '' };
      const updatedReading = {
        ...currentReading,
        [field]: cleanVal
      };
      onUpdateReadings(activeSheetId, machineId, date, updatedReading);
    }
  };

  const handleAddNewMachineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMachName.trim()) return;
    const rate = parseFloat(newMachRate) || 100;
    
    onAddMachine(activeSheetId, {
      name: newMachName.trim(),
      ratePerHour: rate
    });

    setNewMachName('');
    setNewMachRate('');
    setIsAddMachineOpen(false);
  };

  const handleAddNewDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDateStr.trim()) return;
    onAddDate(activeSheetId, newDateStr.trim());
    setNewDateStr('');
    setIsAddDateOpen(false);
  };

  const handleAddNewLocalitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocalityName.trim()) return;
    const newId = onAddLocality(newLocalityName.trim());
    setActiveSheetId(newId);
    setNewLocalityName('');
    setIsAddLocalityOpen(false);
  };

  // Format currency helper
  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="flex flex-col gap-6 fade-in">
      {/* Context Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 shrink-0">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#002046] mb-2">Controle de Horas-Máquina</h1>
          <p className="text-sm text-slate-500">
            Registro diário de horímetros e cálculo de custos por localidade.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onExport}
            className="px-4 py-2 border border-slate-300 text-[#002046] font-semibold text-xs tracking-wider uppercase rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-2 cursor-pointer bg-white shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Exportar Relatório</span>
          </button>
          <button 
            onClick={() => setIsAddDateOpen(true)}
            className="px-4 py-2 border border-slate-300 text-slate-700 bg-white font-semibold text-xs tracking-wider uppercase rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Data</span>
          </button>
          <button 
            onClick={() => setIsAddLocalityOpen(true)}
            className="px-4 py-2 bg-[#002046] text-white font-semibold text-xs tracking-wider uppercase rounded-lg hover:bg-[#1b365d] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Localidade</span>
          </button>
        </div>
      </div>

      {/* Grid Layout: Sidebar Filter & KPI cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 shrink-0">
        {/* Filter Panel (3 cols) */}
        <div className="col-span-1 lg:col-span-3 bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#002046] border-b border-slate-100 pb-2">
            Filtros de Visão
          </h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Localidade / Fazenda</label>
            <div className="flex gap-2">
              <select 
                value={activeSheetId}
                onChange={(e) => setActiveSheetId(e.target.value)}
                className="flex-1 min-w-0 border border-slate-200 rounded-lg p-2 bg-slate-50 font-medium text-sm text-slate-700 focus:border-[#002046] focus:ring-1 focus:ring-[#002046] outline-none text-ellipsis overflow-hidden"
              >
                {localitySheets.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  if (localitySheets.length <= 1) {
                    alert('Deve haver pelo menos uma localidade.');
                    return;
                  }
                  onDeleteLocality(activeSheetId);
                  const nextSheet = localitySheets.find(s => s.id !== activeSheetId);
                  if (nextSheet) setActiveSheetId(nextSheet.id);
                }}
                className="w-[38px] h-[38px] flex items-center justify-center shrink-0 border border-red-200 hover:bg-red-50 hover:border-red-300 text-red-500 rounded-lg transition-colors cursor-pointer"
                title="Excluir localidade atual"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Período</label>
            <div className="flex gap-2 items-center">
              <input 
                type="date" 
                defaultValue="2023-06-09"
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 font-mono text-xs focus:border-[#002046] outline-none"
              />
              <span className="text-slate-400 font-bold">-</span>
              <input 
                type="date" 
                defaultValue="2023-06-22"
                className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 font-mono text-xs focus:border-[#002046] outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Status da Máquina</label>
            <div className="flex gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full border border-emerald-600 text-emerald-800 font-bold text-[10px] uppercase bg-emerald-50 cursor-pointer shadow-2xs">
                Ativa
              </span>
              <span className="px-2.5 py-1 rounded-full border border-slate-200 text-slate-500 font-bold text-[10px] uppercase hover:bg-slate-50 cursor-pointer transition-colors">
                Em Manutenção
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-3">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Selecionar Máquina / Veículo</label>
            <select 
              value={selectedMachineFilter}
              onChange={(e) => setSelectedMachineFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 font-medium text-xs text-slate-700 focus:border-[#002046] focus:ring-1 focus:ring-[#002046] outline-none"
            >
              <option value="all">Todas as Máquinas</option>
              {activeSheet.machines.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Selecionar Motorista / Func.</label>
            <select 
              value={selectedDriverFilter}
              onChange={(e) => setSelectedDriverFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 font-medium text-xs text-slate-700 focus:border-[#002046] focus:ring-1 focus:ring-[#002046] outline-none"
            >
              <option value="all">Todos os Motoristas</option>
              {driverOptions.map(driver => (
                <option key={driver} value={driver}>{driver}</option>
              ))}
            </select>
          </div>
        </div>

        {/* KPI Cards (9 cols) */}
        <div className="col-span-1 lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: Total Hours */}
          <div className="bg-white border-t-4 border-t-[#002046] border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Horas Trabalhadas</span>
              <Calendar className="text-[#002046] w-4 h-4" />
            </div>
            <div className="mt-4">
              <span className="font-mono text-3xl font-bold text-slate-800">{sheetStats.totalHours.toLocaleString('pt-BR')}</span>
              <span className="text-xs text-slate-500 font-semibold ml-1">hrs</span>
            </div>
            <p className="text-xs font-semibold text-[#5caf81] mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> <span>+5% vs mês anterior</span>
            </p>
          </div>

          {/* Card 2: Projected Cost */}
          <div className="bg-white border-t-4 border-t-[#002046] border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Custo Total Projetado</span>
              <DollarSign className="text-[#002046] w-4 h-4" />
            </div>
            <div className="mt-4">
              <span className="font-mono text-2xl font-bold text-slate-800">{formatBRL(sheetStats.totalCost)}</span>
            </div>
            <p className="text-xs font-semibold text-red-500 mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> <span>Acima do orçado</span>
            </p>
          </div>

          {/* Card 3: Machines in Operation */}
          <div className="bg-white border-t-4 border-t-slate-500 border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Máquinas em Operação</span>
              <Tractor className="text-slate-500 w-4 h-4" />
            </div>
            <div className="mt-4">
              <span className="font-mono text-3xl font-bold text-slate-800">{sheetStats.activeMachinesCount}</span>
              <span className="text-xs text-slate-500 font-semibold ml-1">/ {sheetStats.totalMachinesCount} ativas</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div 
                className="bg-slate-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(sheetStats.activeMachinesCount / (sheetStats.totalMachinesCount || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Form for Operators */}
      <MobileHoursForm 
        activeSheet={activeSheet} 
        activeSheetId={activeSheetId} 
        onUpdateReadings={onUpdateReadings} 
      />

      {/* Main Spreadsheet Grid */}
      <div className="hidden md:flex bg-white border border-slate-200 rounded-xl overflow-hidden flex-1 flex-col shadow-sm min-h-[400px]">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
          <h2 className="text-sm font-bold text-[#002046] flex items-center gap-2">
            <TableProperties className="w-4 h-4" />
            <span>Apontamento de Horímetro - {activeSheet.name}</span>
          </h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAddMachineOpen(true)}
              className="text-xs font-bold text-[#002046] hover:bg-slate-200/50 px-2.5 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1 transition-all cursor-pointer bg-white"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Máquina
            </button>
            <button 
              onClick={() => setIsCompact(!isCompact)}
              className="p-1.5 text-slate-500 hover:bg-slate-200 rounded transition-colors cursor-pointer border border-slate-200 bg-white" 
              title="Alternar visão compacta"
            >
              {isCompact ? <LayoutList className="w-4 h-4" /> : <List className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Spreadsheet Table Container */}
        <div className="overflow-auto flex-1 select-none">
          <table className="min-w-full border-collapse border-slate-200" style={{ tableLayout: 'fixed', width: 'max-content' }}>
            <thead>
              {/* Machine Grouping Header Row */}
              <tr className="bg-slate-100 text-xs font-bold text-slate-600 border-b border-slate-200">
                <th className="p-2 border-r border-slate-200 sticky left-0 z-20 bg-slate-100 w-24"></th>
                {filteredMachines.map((machine, mIdx) => {
                  const p = palettes[mIdx % palettes.length];
                  return (
                    <th 
                      key={machine.id} 
                      colSpan={3} 
                      className="p-2.5 border-r text-center relative group"
                      style={{ 
                        backgroundColor: p.header, 
                        borderColor: p.border,
                        color: p.dark,
                        boxShadow: 'inset 0 3px 5px rgba(255,255,255,0.7), inset 0 -3px 5px rgba(0,0,0,0.15)',
                        textShadow: '0 1px 1px rgba(255,255,255,0.8)'
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1.5 justify-center">
                          <span className="font-display font-bold text-xs uppercase tracking-wider" style={{ color: p.dark }}>
                            {machine.name}
                          </span>
                          <button
                            onClick={() => onDeleteMachine(activeSheetId, machine.id)}
                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity p-0.5 cursor-pointer border-none bg-transparent"
                            title="Remover máquina da localidade"
                          >
                            <XIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="font-mono text-[10px] mt-0.5" style={{ color: p.text }}>
                          {formatBRL(machine.ratePerHour)}/h
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>

              {/* Subcolumns Header Row */}
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 border-b border-slate-200 sticky top-0 z-10">
                <th className="p-2 border-r border-slate-200 text-left sticky left-0 z-20 bg-slate-50 text-slate-500 w-24 uppercase font-bold">
                  Data
                </th>
                {filteredMachines.map((machine, mIdx) => {
                  const p = palettes[mIdx % palettes.length];
                  const initW = colWidths[`${machine.id}-init`] || 55;
                  const finalW = colWidths[`${machine.id}-final`] || 55;
                  const totalW = colWidths[`${machine.id}-total`] || 50;

                  return (
                    <React.Fragment key={machine.id}>
                      <th 
                        className="p-1.5 border-r text-right relative select-none"
                        style={{ 
                          width: initW, 
                          minWidth: 45,
                          backgroundColor: p.bg,
                          color: p.text,
                          borderColor: p.border,
                          boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.6), inset 0 -2px 3px rgba(0,0,0,0.08)'
                        }}
                      >
                        Hora Inicial
                        <div 
                          className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-emerald-500 active:bg-emerald-600 transition-colors z-20"
                          onMouseDown={(e) => startResize(e, `${machine.id}-init`)}
                        />
                      </th>
                      <th 
                        className="p-1.5 border-r text-right relative select-none"
                        style={{ 
                          width: finalW, 
                          minWidth: 45,
                          backgroundColor: p.bg,
                          color: p.text,
                          borderColor: p.border,
                          boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.6), inset 0 -2px 3px rgba(0,0,0,0.08)'
                        }}
                      >
                        Hora Final
                        <div 
                          className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-emerald-500 active:bg-emerald-600 transition-colors z-20"
                          onMouseDown={(e) => startResize(e, `${machine.id}-final`)}
                        />
                      </th>
                      <th 
                        className="p-1.5 border-r text-right font-bold relative select-none"
                        style={{ 
                          width: totalW, 
                          minWidth: 45,
                          backgroundColor: p.header,
                          color: p.dark,
                          borderColor: p.border,
                          boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.7), inset 0 -2px 3px rgba(0,0,0,0.1)'
                        }}
                      >
                        Total Dia
                        <div 
                          className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-emerald-500 active:bg-emerald-600 transition-colors z-20"
                          onMouseDown={(e) => startResize(e, `${machine.id}-total`)}
                        />
                      </th>
                    </React.Fragment>
                  );
                })}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="font-mono text-xs text-slate-700 bg-white">
              {activeSheet.dates.map((date) => {
                const isWeeded = date.toLowerCase().includes('dom') || date.toLowerCase().includes('sáb');
                return (
                  <tr 
                    key={date} 
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                      isWeeded ? 'bg-slate-50/40' : ''
                    }`}
                  >
                    {/* Date column (sticky left for easy sheet-scroll viewing!) */}
                    <td className="p-2 border-r border-slate-200 sticky left-0 z-20 bg-white font-sans text-xs text-slate-800 font-bold w-24 shadow-xs">
                      {date}
                    </td>

                    {/* Machine Readings */}
                    {filteredMachines.map((machine, mIdx) => {
                      const reading = machine.readings[date] || { initial: '', final: '' };
                      const dailyHours = calculateHours(reading.initial, reading.final);

                      const isEditingInit = editingCell && editingCell.machineId === machine.id && editingCell.date === date && editingCell.field === 'initial';
                      const isEditingFinal = editingCell && editingCell.machineId === machine.id && editingCell.date === date && editingCell.field === 'final';
                      
                      const valInit = isEditingInit ? editingCell.value : (reading.initial || '');
                      const valFinal = isEditingFinal ? editingCell.value : (reading.final || '');

                      const p = palettes[mIdx % palettes.length];
                      return (
                        <React.Fragment key={machine.id}>
                          {/* Hora Inicial cell */}
                          <td className="p-1 border-r text-right" style={{ backgroundColor: p.bg, borderColor: p.border }}>
                            <input 
                              type="text"
                              value={valInit}
                              placeholder="-"
                              onChange={(e) => handleInputChange(machine.id, date, 'initial', e.target.value)}
                              onBlur={(e) => handleInputCommit(machine.id, date, 'initial', e.target.value, reading.initial || '')}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  (e.target as HTMLInputElement).blur();
                                }
                              }}
                              className="w-full bg-transparent border-none p-1 text-right font-mono focus:outline-none text-slate-800 font-medium placeholder-slate-300"
                              style={{ color: p.dark }}
                            />
                          </td>
                          {/* Hora Final cell */}
                          <td className="p-1 border-r text-right" style={{ backgroundColor: p.bg, borderColor: p.border }}>
                            <input 
                              type="text"
                              value={valFinal}
                              placeholder="-"
                              onChange={(e) => handleInputChange(machine.id, date, 'final', e.target.value)}
                              onBlur={(e) => handleInputCommit(machine.id, date, 'final', e.target.value, reading.final || '')}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  (e.target as HTMLInputElement).blur();
                                }
                              }}
                              className="w-full bg-transparent border-none p-1 text-right font-mono focus:outline-none text-slate-800 font-medium placeholder-slate-300"
                              style={{ color: p.dark }}
                            />
                          </td>
                          {/* Total Dia cell */}
                          <td 
                            className="p-1.5 border-r text-right font-bold"
                            style={{ backgroundColor: p.header, color: p.dark, borderColor: p.border }}
                          >
                            {dailyHours > 0 ? dailyHours.toFixed(2) : '-'}
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>

            {/* Footer Totals */}
            <tfoot className="border-t-2 border-[#002046] font-mono text-xs font-bold text-slate-800 sticky bottom-0 z-20">
              {/* Totais Período row */}
              <tr className="bg-slate-100 border-b border-slate-200">
                <td className="p-3 border-r border-slate-200 sticky left-0 z-30 bg-slate-100 font-sans text-xs uppercase tracking-wider text-[#002046] font-bold shadow-xs">
                  Totais Período
                </td>
                {filteredMachines.map((machine, mIdx) => {
                  const p = palettes[mIdx % palettes.length];
                  const totals = sheetStats.machineTotals.find(t => t.machineId === machine.id);
                  const totalHrs = totals?.totalHours || 0;
                  return (
                    <React.Fragment key={machine.id}>
                      <td 
                        colSpan={2} 
                        className="p-3 border-r text-right font-sans text-[10px] uppercase font-bold"
                        style={{ backgroundColor: p.bg, color: p.text, borderColor: p.border }}
                      >
                        Total Horas
                      </td>
                      <td 
                        className="p-3 border-r text-right font-mono text-sm font-black"
                        style={{ backgroundColor: p.header, color: p.dark, borderColor: p.border }}
                      >
                        {totalHrs > 0 ? totalHrs.toFixed(2) : '0,00'}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>

              {/* Custo Total row */}
              <tr className="bg-[#002046] text-white">
                <td className="p-3 border-r border-slate-700 sticky left-0 z-30 bg-[#002046] font-sans text-xs uppercase tracking-wider font-bold shadow-xs">
                  Custo Total
                </td>
                {filteredMachines.map((machine, mIdx) => {
                  const p = palettes[mIdx % palettes.length];
                  const totals = sheetStats.machineTotals.find(t => t.machineId === machine.id);
                  const totalCost = totals?.totalCost || 0;
                  return (
                    <React.Fragment key={machine.id}>
                      <td 
                        colSpan={2} 
                        className="p-3 border-r text-right font-sans text-[10px] uppercase font-bold text-white/90"
                        style={{ backgroundColor: p.text, borderColor: p.text }}
                      >
                        Valor Total
                      </td>
                      <td 
                        className="p-3 border-r text-right font-mono text-sm font-black text-white"
                        style={{ backgroundColor: p.dark, borderColor: p.dark }}
                      >
                        {formatBRL(totalCost)}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Add Machine Modal */}
      {isAddMachineOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#002046] text-white px-5 py-4 flex justify-between items-center">
              <h3 className="font-display text-sm font-bold">Adicionar Máquina à Planilha</h3>
              <button onClick={() => setIsAddMachineOpen(false)} className="text-white/80 hover:text-white cursor-pointer"><XIcon className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddNewMachineSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Selecionar do Cadastro (Opcional)</label>
                <select 
                  onChange={(e) => {
                    const selectedName = e.target.value;
                    if (selectedName) {
                      setNewMachName(selectedName);
                      const found = clientsAndVehicles.find(v => v.name === selectedName);
                      if (found && found.rate !== undefined) {
                        setNewMachRate(found.rate.toString());
                      }
                    }
                  }}
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white text-slate-700 outline-none focus:ring-1 focus:ring-[#002046]"
                >
                  <option value="">— Digitar Manualmente —</option>
                  {clientsAndVehicles
                    .filter(v => v.type === 'Máquina' || v.type === 'Caminhão')
                    .map(v => (
                      <option key={v.id} value={v.name}>
                        {v.name} ({v.type} {v.rate ? `- R$ ${v.rate}/h` : ''})
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Nome da Máquina</label>
                <input 
                  type="text" 
                  value={newMachName}
                  onChange={(e) => setNewMachName(e.target.value)}
                  placeholder="Ex: AMOS SILAGEM, COWBOY, etc."
                  required
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white text-slate-800 placeholder-slate-300 outline-none focus:ring-1 focus:ring-[#002046]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Taxa por Hora (R$ / hora)</label>
                <input 
                  type="number" 
                  value={newMachRate}
                  onChange={(e) => setNewMachRate(e.target.value)}
                  placeholder="Ex: 120"
                  required
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white text-slate-800 placeholder-slate-300 outline-none focus:ring-1 focus:ring-[#002046]"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddMachineOpen(false)} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#002046] hover:bg-[#1b365d] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm cursor-pointer">Adicionar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Date Modal */}
      {isAddDateOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#002046] text-white px-5 py-4 flex justify-between items-center">
              <h3 className="font-display text-sm font-bold">Adicionar Linha de Data</h3>
              <button onClick={() => setIsAddDateOpen(false)} className="text-white/80 hover:text-white cursor-pointer"><XIcon className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddNewDateSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Descrição da Data (Ex: "24/jun", "04/jul")</label>
                <input 
                  type="text" 
                  value={newDateStr}
                  onChange={(e) => setNewDateStr(e.target.value)}
                  placeholder="Ex: 24/jun"
                  required
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white text-slate-800 placeholder-slate-300 outline-none focus:ring-1 focus:ring-[#002046]"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddDateOpen(false)} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#002046] hover:bg-[#1b365d] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm cursor-pointer">Adicionar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Locality Modal */}
      {isAddLocalityOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#002046] text-white px-5 py-4 flex justify-between items-center">
              <h3 className="font-display text-sm font-bold">Nova Localidade / Planilha</h3>
              <button onClick={() => setIsAddLocalityOpen(false)} className="text-white/80 hover:text-white cursor-pointer"><XIcon className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddNewLocalitySubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Nome da Localidade</label>
                <input 
                  type="text" 
                  value={newLocalityName}
                  onChange={(e) => setNewLocalityName(e.target.value)}
                  placeholder="Ex: Fazenda Boa Vista"
                  required
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white text-slate-800 placeholder-slate-300 outline-none focus:ring-1 focus:ring-[#002046]"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddLocalityOpen(false)} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#002046] hover:bg-[#1b365d] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm cursor-pointer">Adicionar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileHoursForm({ activeSheet, activeSheetId, onUpdateReadings }: any) {
  const [mobileMachine, setMobileMachine] = useState('');
  const [mobileDate, setMobileDate] = useState('');
  const [mobileInitial, setMobileInitial] = useState('');
  const [mobileFinal, setMobileFinal] = useState('');

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileMachine && mobileDate) {
      onUpdateReadings(activeSheetId, mobileMachine, mobileDate, { initial: mobileInitial, final: mobileFinal });
      alert('Horas gravadas com sucesso!');
      setMobileInitial('');
      setMobileFinal('');
    }
  };

  return (
    <div className="md:hidden bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-xs">
      <h3 className="font-display font-bold text-sm text-[#002046] border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
        <Tractor className="w-4 h-4 text-[#002046]" />
        Lançamento Rápido (Celular)
      </h3>
      <form onSubmit={handleMobileSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Data</label>
          <select 
            value={mobileDate} 
            onChange={(e) => setMobileDate(e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-3 text-sm bg-slate-50 text-slate-800 outline-none focus:ring-1 focus:ring-[#002046]"
            required
          >
            <option value="">Selecione o Dia...</option>
            {activeSheet.dates.map((d: string) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Máquina</label>
          <select 
            value={mobileMachine} 
            onChange={(e) => setMobileMachine(e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-3 text-sm bg-slate-50 text-slate-800 outline-none focus:ring-1 focus:ring-[#002046]"
            required
          >
            <option value="">Selecione a Máquina...</option>
            {activeSheet.machines.map((m: any) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Hora Inicial</label>
            <input 
              type="number" step="0.01" 
              value={mobileInitial} 
              onChange={(e) => setMobileInitial(e.target.value)} 
              placeholder="Ex: 100.5" 
              className="w-full border border-slate-200 rounded-lg p-3 text-sm font-mono bg-slate-50" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Hora Final</label>
            <input 
              type="number" step="0.01" 
              value={mobileFinal} 
              onChange={(e) => setMobileFinal(e.target.value)} 
              placeholder="Ex: 110.5" 
              className="w-full border border-slate-200 rounded-lg p-3 text-sm font-mono bg-slate-50" 
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-[#002046] text-white font-bold py-3 rounded-lg text-sm uppercase tracking-wider mt-2">
          Salvar Horas
        </button>
      </form>
    </div>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={props.className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
