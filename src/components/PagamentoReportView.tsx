import React, { useState, useMemo } from 'react';
import { Filter, Calendar, Tractor, User, Landmark, DollarSign, Scale, Crop, TrendingUp, Download, FileText, Truck, Layers, AlertCircle } from 'lucide-react';
import { Producao, Area, Maquina, Motorista } from '../types/agro';
import { LocalitySheet, ClientOrVehicle } from '../types';
import { getEntityColor, getDriverForMachine, isTruckVehicle, calculateHours } from '../utils/agroHelpers';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PagamentoReportViewProps {
  producoes: Producao[];
  areas: Area[];
  maquinas: Maquina[];
  motoristas: Motorista[];
  localitySheets?: LocalitySheet[];
  clientsAndVehicles?: ClientOrVehicle[];
}

export default function PagamentoReportView({
  producoes,
  areas,
  maquinas,
  motoristas,
  localitySheets = [],
  clientsAndVehicles = []
}: PagamentoReportViewProps) {
  const [activeTab, setActiveTab] = useState<'producao' | 'maquina' | 'caminhao'>('producao');

  // ==========================================
  // STATE: PRODUCAO FILTERS (PERÍODO DE DATAS & MÚLTIPLAS ÁREAS)
  // ==========================================
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-01`;
  });
  const [endDate, setEndDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  });
  const [dateError, setDateError] = useState('');

  const [selectedAreaIds, setSelectedAreaIds] = useState<string[]>([]);
  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);

  const [selectedMaquina, setSelectedMaquina] = useState('all');
  const [selectedMotorista, setSelectedMotorista] = useState('all');

  // ==========================================
  // STATE: HORAS FILTERS (MÁQUINAS E CAMINHÕES)
  // ==========================================
  const [selectedHourArea, setSelectedHourArea] = useState('all');
  const [selectedHourMonth, setSelectedHourMonth] = useState('all');

  // Date Presets
  const setPresetToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
    setDateError('');
  };

  const setPreset7Days = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    setDateError('');
  };

  const setPreset30Days = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    setDateError('');
  };

  const setPresetThisMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const start = `${year}-${month}-01`;
    const today = now.toISOString().split('T')[0];
    setStartDate(start);
    setEndDate(today);
    setDateError('');
  };

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    if (val && endDate && val > endDate) {
      setDateError('Data inicial não pode ser posterior à data final.');
    } else {
      setDateError('');
    }
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    if (startDate && val && startDate > val) {
      setDateError('Data inicial não pode ser posterior à data final.');
    } else {
      setDateError('');
    }
  };

  const toggleAreaSelect = (areaId: string) => {
    if (selectedAreaIds.includes(areaId)) {
      setSelectedAreaIds(prev => prev.filter(id => id !== areaId));
    } else {
      setSelectedAreaIds(prev => [...prev, areaId]);
    }
  };

  const toggleSelectAllAreas = () => {
    if (selectedAreaIds.length === areas.length) {
      setSelectedAreaIds([]);
    } else {
      setSelectedAreaIds(areas.map(a => a.id));
    }
  };

  // ==========================================
  // LOGIC: PRODUCAO
  // ==========================================
  const filteredProducoes = useMemo(() => {
    if (startDate && endDate && startDate > endDate) {
      return [];
    }

    return producoes.filter(p => {
      const matchesDate = (!startDate || p.date >= startDate) && (!endDate || p.date <= endDate);
      const isAllAreas = selectedAreaIds.length === 0 || selectedAreaIds.length === areas.length;
      const matchesArea = isAllAreas || selectedAreaIds.includes(p.areaId);
      const matchesMaquina = selectedMaquina === 'all' || p.maquinaId === selectedMaquina;
      const matchesMotorista = selectedMotorista === 'all' || p.motoristaId === selectedMotorista;
      return matchesDate && matchesArea && matchesMaquina && matchesMotorista;
    });
  }, [producoes, startDate, endDate, selectedAreaIds, areas.length, selectedMaquina, selectedMotorista]);

  const consolidatedStats = useMemo(() => {
    let totalHectares = 0;
    let totalToneladas = 0;
    let totalPagamento = 0;

    filteredProducoes.forEach(p => {
      const motoristaRate = motoristas.find(m => m.id === p.motoristaId)?.ratePerHectare || 0;
      totalHectares += p.hectares;
      totalToneladas += p.toneladas;
      totalPagamento += p.hectares * motoristaRate;
    });

    const averageYield = totalHectares > 0 ? totalToneladas / totalHectares : 0;
    return {
      totalHectares: parseFloat(totalHectares.toFixed(2)),
      totalToneladas: parseFloat(totalToneladas.toFixed(2)),
      totalPagamento,
      averageYield
    };
  }, [filteredProducoes, motoristas]);

  const getAreaName = (id: string) => areas.find(a => a.id === id)?.name || 'Área Desconhecida';
  const getMaquinaName = (id: string) => maquinas.find(m => m.id === id)?.name || 'Máquina Desconhecida';
  const getMotoristaName = (id: string) => motoristas.find(m => m.id === id)?.name || 'Motorista Desconhecido';
  const getMotoristaRate = (id: string) => motoristas.find(m => m.id === id)?.ratePerHectare || 0;

  // ==========================================
  // LOGIC: HORAS (MÁQUINAS E CAMINHÕES)
  // ==========================================
  const allReadings = useMemo(() => {
    const list: any[] = [];
    localitySheets.forEach(sheet => {
      sheet.machines.forEach(m => {
        const isTruck = isTruckVehicle(m.name, clientsAndVehicles);
        const driver = getDriverForMachine(m.name, clientsAndVehicles);
        
        Object.entries(m.readings).forEach(([dateStr, reading]) => {
          const hours = calculateHours(reading.initial, reading.final);
          if (hours > 0) {
            list.push({
              sheetId: sheet.id,
              sheetName: sheet.name,
              machineId: m.id,
              machineName: m.name,
              isTruck,
              driver,
              ratePerHour: m.ratePerHour,
              dateStr,
              initial: reading.initial,
              final: reading.final,
              hours,
              revenue: hours * m.ratePerHour,
              month: dateStr.split('/')[1] || 'Outro'
            });
          }
        });
      });
    });
    return list;
  }, [localitySheets, clientsAndVehicles]);

  function parseReadingDateToISO(dateStr: string, defaultYear = 2026): string | null {
    if (!dateStr) return null;
    const clean = dateStr.trim();
    
    // Format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
      return clean;
    }
    
    // Format DD/MM/YYYY
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(clean)) {
      const [d, m, y] = clean.split('/');
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }

    // Format DD/mmm (ex: "09/jun", "4/jul", "15/ago")
    const ptMonths: Record<string, string> = {
      jan: '01', fev: '02', mar: '03', abr: '04', mai: '05', jun: '06',
      jul: '07', ago: '08', set: '09', out: '10', nov: '11', dez: '12'
    };

    const parts = clean.toLowerCase().split('/');
    if (parts.length === 2) {
      const day = parts[0].padStart(2, '0');
      const monthKey = parts[1].slice(0, 3);
      if (ptMonths[monthKey]) {
        return `${defaultYear}-${ptMonths[monthKey]}-${day}`;
      }
      if (/^\d{1,2}$/.test(parts[1])) {
        return `${defaultYear}-${parts[1].padStart(2, '0')}-${day}`;
      }
    }

    return null;
  }

  const filteredMachineReadings = useMemo(() => {
    if (startDate && endDate && startDate > endDate) return [];

    return allReadings.filter(r => {
      if (r.isTruck) return false;

      // Date Period Filter
      const isoDate = parseReadingDateToISO(r.dateStr);
      const matchesDate = !isoDate || ((!startDate || isoDate >= startDate) && (!endDate || isoDate <= endDate));

      // Multi-Area Filter
      const isAllAreas = selectedAreaIds.length === 0 || selectedAreaIds.length === areas.length;
      const matchesArea = isAllAreas || selectedAreaIds.includes(r.sheetId) || areas.some(a => selectedAreaIds.includes(a.id) && (a.name.toLowerCase() === r.sheetName.toLowerCase() || r.sheetName.toLowerCase().includes(a.name.toLowerCase())));

      return matchesDate && matchesArea;
    });
  }, [allReadings, startDate, endDate, selectedAreaIds, areas]);

  const filteredTruckReadings = useMemo(() => {
    if (startDate && endDate && startDate > endDate) return [];

    return allReadings.filter(r => {
      if (!r.isTruck) return false;

      // Date Period Filter
      const isoDate = parseReadingDateToISO(r.dateStr);
      const matchesDate = !isoDate || ((!startDate || isoDate >= startDate) && (!endDate || isoDate <= endDate));

      // Multi-Area Filter
      const isAllAreas = selectedAreaIds.length === 0 || selectedAreaIds.length === areas.length;
      const matchesArea = isAllAreas || selectedAreaIds.includes(r.sheetId) || areas.some(a => selectedAreaIds.includes(a.id) && (a.name.toLowerCase() === r.sheetName.toLowerCase() || r.sheetName.toLowerCase().includes(a.name.toLowerCase())));

      return matchesDate && matchesArea;
    });
  }, [allReadings, startDate, endDate, selectedAreaIds, areas]);

  const machineStats = useMemo(() => {
    return {
      totalHours: filteredMachineReadings.reduce((sum, r) => sum + r.hours, 0),
      totalRevenue: filteredMachineReadings.reduce((sum, r) => sum + r.revenue, 0)
    };
  }, [filteredMachineReadings]);

  const truckStats = useMemo(() => {
    return {
      totalHours: filteredTruckReadings.reduce((sum, r) => sum + r.hours, 0),
      totalRevenue: filteredTruckReadings.reduce((sum, r) => sum + r.revenue, 0)
    };
  }, [filteredTruckReadings]);


  const formatBRL = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // ==========================================
  // EXPORT FUNCTIONS
  // ==========================================
  const handleExportCSV = (type: 'producao' | 'maquina' | 'caminhao') => {
    const csvRows = [];
    csvRows.push(`### RELATORIO DE ${type.toUpperCase()} ###`);
    csvRows.push(`Exportado em:;${new Date().toLocaleString('pt-BR')}`);
    csvRows.push("");

    if (type === 'producao') {
      csvRows.push("Semana;Data;Area/Fazenda;Maquina;Motorista;Hectares (ha);Toneladas (t);Rendimento (t/ha);Tarifa (R$/ha);Pagamento (R$)");
      filteredProducoes.forEach(p => {
        const yieldRate = p.hectares > 0 ? p.toneladas / p.hectares : 0;
        const rate = getMotoristaRate(p.motoristaId);
        const payment = p.hectares * rate;
        csvRows.push(`"${p.semana}";"${p.date.split('-').reverse().join('/')}";"${getAreaName(p.areaId)}";"${getMaquinaName(p.maquinaId)}";"${getMotoristaName(p.motoristaId)}";${p.hectares.toLocaleString('pt-BR')};${p.toneladas.toLocaleString('pt-BR')};${yieldRate.toLocaleString('pt-BR')};${rate.toLocaleString('pt-BR')};${payment.toLocaleString('pt-BR')}`);
      });
    } else {
      const dataList = type === 'maquina' ? filteredMachineReadings : filteredTruckReadings;
      csvRows.push("Data;Fazenda;Equipamento;Motorista/Operador;Hr. Inicial;Hr. Final;Total Horas;Tarifa (R$/h);Faturamento (R$)");
      dataList.forEach(r => {
        csvRows.push(`"${r.dateStr}";"${r.sheetName}";"${r.machineName}";"${r.driver}";"${r.initial}";"${r.final}";${r.hours.toLocaleString('pt-BR')};${r.ratePerHour.toLocaleString('pt-BR')};${r.revenue.toLocaleString('pt-BR')}`);
      });
    }

    const csvContent = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_${type}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = (type: 'producao' | 'maquina' | 'caminhao') => {
    const doc = new jsPDF();
    let title = "RELATÓRIO";
    let head: any[] = [];
    let tableData: any[] = [];

    if (type === 'producao') {
      title = "RELATÓRIO DE PAGAMENTO E PRODUÇÃO";
      head = [['Data', 'Área', 'Motorista', 'Hectares', 'Toneladas', 'Pagamento']];
      tableData = filteredProducoes.map(p => {
        const rate = getMotoristaRate(p.motoristaId);
        return [
          p.date.split('-').reverse().join('/'),
          getAreaName(p.areaId),
          getMotoristaName(p.motoristaId),
          p.hectares.toLocaleString('pt-BR'),
          p.toneladas.toLocaleString('pt-BR'),
          (p.hectares * rate).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        ];
      });
    } else {
      title = type === 'maquina' ? "RELATÓRIO DE HORAS: MÁQUINAS" : "RELATÓRIO DE HORAS: CAMINHÕES";
      const dataList = type === 'maquina' ? filteredMachineReadings : filteredTruckReadings;
      head = [['Data', 'Fazenda', 'Equipamento', 'Hr. Inic.', 'Hr. Final', 'Total Hrs', 'Faturamento']];
      tableData = dataList.map(r => [
        r.dateStr,
        r.sheetName,
        r.machineName,
        r.initial,
        r.final,
        r.hours.toLocaleString('pt-BR'),
        r.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      ]);
    }

    doc.text(title, 14, 15);
    autoTable(doc, {
      startY: 22,
      head: head,
      body: tableData,
    });
    doc.save(`relatorio_${type}_${Date.now()}.pdf`);
  };

  return (
    <div className="flex flex-col gap-6 fade-in">
      {/* Page Title & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 shrink-0 bg-white/50 p-4 rounded-2xl border border-white backdrop-blur shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-[#002046] to-emerald-600">Central de Relatórios e Exportação</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Consolidação de dados para análises, fechamentos e exportação (PDF/Excel).</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner overflow-hidden">
          <button 
            onClick={() => setActiveTab('producao')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'producao' ? 'bg-white text-emerald-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 border border-transparent'}`}
          >
            <Scale className="w-4 h-4" />
            Produção
          </button>
          <button 
            onClick={() => setActiveTab('maquina')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'maquina' ? 'bg-white text-[#002046] shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 border border-transparent'}`}
          >
            <Tractor className="w-4 h-4" />
            Máquinas
          </button>
          <button 
            onClick={() => setActiveTab('caminhao')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'caminhao' ? 'bg-white text-purple-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 border border-transparent'}`}
          >
            <Truck className="w-4 h-4" />
            Caminhões
          </button>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => handleExportPDF(activeTab)}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer border-none"
        >
          <FileText className="w-4 h-4" />
          <span>Gerar PDF ({activeTab})</span>
        </button>
        <button
          onClick={() => handleExportCSV(activeTab)}
          className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer border-none"
        >
          <Download className="w-4 h-4" />
          <span>Exportar CSV ({activeTab})</span>
        </button>
      </div>

      {/* Global Dynamic Filters Panel (Aplicado a TODAS as sub-abas: Produção, Máquinas e Caminhões) */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4 shrink-0">
        {dateError && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-2.5 text-xs font-semibold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{dateError}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-4 items-end justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider h-9 mr-1">
              <Filter className="w-4 h-4 text-emerald-700" />
              <span>Filtros do Relatório ({activeTab.toUpperCase()}):</span>
            </div>

            {/* Data Inicial */}
            <div className="flex flex-col gap-1 w-full sm:w-36">
              <span className="text-[10px] uppercase font-bold text-slate-400">Data Inicial</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full bg-slate-50 border-b-2 border-slate-200 rounded-t-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-600 outline-none"
              />
            </div>

            {/* Data Final */}
            <div className="flex flex-col gap-1 w-full sm:w-36">
              <span className="text-[10px] uppercase font-bold text-slate-400">Data Final</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="w-full bg-slate-50 border-b-2 border-slate-200 rounded-t-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-600 outline-none"
              />
            </div>

            {/* Multi-Select Áreas */}
            <div className="flex flex-col gap-1 w-full sm:w-52 relative">
              <span className="text-[10px] uppercase font-bold text-slate-400">Fazendas / Áreas (Múltiplas)</span>
              <button
                type="button"
                onClick={() => setIsAreaDropdownOpen(!isAreaDropdownOpen)}
                className="w-full bg-slate-50 border-b-2 border-slate-200 rounded-t-lg text-xs font-semibold px-3 py-2 text-slate-700 flex justify-between items-center text-left cursor-pointer"
              >
                <span className="truncate">
                  {selectedAreaIds.length === 0 || selectedAreaIds.length === areas.length
                    ? 'Todas as Áreas / Fazendas'
                    : `${selectedAreaIds.length} área(s) selecionada(s)`}
                </span>
                <span className="text-[10px] text-slate-400 ml-1">▼</span>
              </button>

              {isAreaDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3 max-h-56 overflow-y-auto space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 p-1 hover:bg-slate-50 rounded cursor-pointer border-b border-slate-100 pb-2">
                    <input
                      type="checkbox"
                      checked={selectedAreaIds.length === areas.length && areas.length > 0}
                      onChange={toggleSelectAllAreas}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300"
                    />
                    <span>☐ Selecionar Todas as Áreas</span>
                  </label>

                  {areas.map(a => (
                    <label key={a.id} className="flex items-center gap-2 text-xs text-slate-700 p-1 hover:bg-slate-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAreaIds.includes(a.id)}
                        onChange={() => toggleAreaSelect(a.id)}
                        className="w-4 h-4 text-emerald-600 rounded border-slate-300"
                      />
                      <span>{a.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Motorista (Apenas se sub-aba producao) */}
            {activeTab === 'producao' && (
              <div className="flex flex-col gap-1 w-full sm:w-44">
                <span className="text-[10px] uppercase font-bold text-slate-400">Motorista</span>
                <select value={selectedMotorista} onChange={(e) => setSelectedMotorista(e.target.value)} className="w-full bg-slate-50 border-b-2 border-slate-200 rounded-t-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-600 outline-none cursor-pointer">
                  <option value="all">Todos os Motoristas</option>
                  {motoristas.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* Quick Date Presets & Clear Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 w-full sm:w-auto">Atalhos:</span>
            <button onClick={setPresetToday} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-md transition-colors cursor-pointer">Hoje</button>
            <button onClick={setPreset7Days} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-md transition-colors cursor-pointer">7 dias</button>
            <button onClick={setPreset30Days} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-md transition-colors cursor-pointer">30 dias</button>
            <button onClick={setPresetThisMonth} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-md transition-colors cursor-pointer">Este Mês</button>

            <button 
              onClick={() => { 
                setPresetThisMonth(); 
                setSelectedAreaIds([]); 
                setSelectedMaquina('all'); 
                setSelectedMotorista('all'); 
              }} 
              className="px-3 py-1.5 border border-slate-200 bg-white text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shrink-0 cursor-pointer ml-auto shadow-sm"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'producao' && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-white border-t-4 border-t-emerald-600 border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hectares</span>
                <Crop className="text-emerald-600 w-5 h-5" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-mono text-3xl font-black text-slate-800 tracking-tighter">{consolidatedStats.totalHectares.toLocaleString('pt-BR')}</span>
                <span className="text-xs text-slate-500 font-bold">ha</span>
              </div>
            </div>
            <div className="bg-white border-t-4 border-t-emerald-600 border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Produção</span>
                <Scale className="text-emerald-600 w-5 h-5" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-mono text-3xl font-black text-slate-800 tracking-tighter">{consolidatedStats.totalToneladas.toLocaleString('pt-BR')}</span>
                <span className="text-xs text-slate-500 font-bold">t</span>
              </div>
            </div>
            <div className="bg-white border-t-4 border-t-red-500 border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pagamento Base</span>
                <DollarSign className="text-red-500 w-5 h-5" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-sm font-bold text-slate-400 mr-0.5">R$</span>
                <span className="font-mono text-3xl font-black text-slate-800 tracking-tighter">{consolidatedStats.totalPagamento.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[350px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold text-slate-800 font-display">Relatório Detalhado: Produção</h3>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-sans text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <th className="py-4 px-4 w-28">Data</th>
                    <th className="py-4 px-4">Área / Fazenda</th>
                    <th className="py-4 px-4">Motorista</th>
                    <th className="py-4 px-4 text-right">Hectares</th>
                    <th className="py-4 px-4 text-right">Toneladas</th>
                    <th className="py-4 px-4 text-right">Tarifa</th>
                    <th className="py-4 px-4 text-right">Pagamento</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-700 divide-y divide-slate-100 font-medium">
                  {filteredProducoes.map((p, index) => {
                    const rate = getMotoristaRate(p.motoristaId);
                    const payment = p.hectares * rate;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="py-3 px-4 font-mono text-slate-500 group-hover:text-slate-800 font-bold">{p.date.split('-').reverse().join('/')}</td>
                        <td className="py-3 px-4"><span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getEntityColor(getAreaName(p.areaId)).bg} ${getEntityColor(getAreaName(p.areaId)).text} border ${getEntityColor(getAreaName(p.areaId)).border}`}>{getAreaName(p.areaId)}</span></td>
                        <td className="py-3 px-4"><span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getEntityColor(getMotoristaName(p.motoristaId)).bg} ${getEntityColor(getMotoristaName(p.motoristaId)).text} border ${getEntityColor(getMotoristaName(p.motoristaId)).border}`}>{getMotoristaName(p.motoristaId)}</span></td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-600">{p.hectares.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} ha</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-600">{p.toneladas.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} t</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-500">{formatBRL(rate)}</td>
                        <td className="py-3 px-4 text-right font-mono font-black text-red-600">{formatBRL(payment)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {(activeTab === 'maquina' || activeTab === 'caminhao') && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={`bg-gradient-to-br border-t-4 rounded-2xl p-6 shadow-sm ${activeTab === 'maquina' ? 'from-blue-50 to-blue-100 border-t-[#002046]' : 'from-purple-50 to-purple-100 border-t-purple-700'}`}>
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'maquina' ? 'text-[#002046]/70' : 'text-purple-700/70'}`}>
                  {activeTab === 'maquina' ? 'Horas Máquinas (Indicador)' : 'Horas Caminhões (Uso)'}
                </span>
                {activeTab === 'maquina' ? <Tractor className="text-[#002046] w-5 h-5" /> : <Truck className="text-purple-700 w-5 h-5" />}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className={`font-mono text-4xl font-black tracking-tighter ${activeTab === 'maquina' ? 'text-[#002046]' : 'text-purple-900'}`}>
                  {(activeTab === 'maquina' ? machineStats.totalHours : truckStats.totalHours).toLocaleString('pt-BR')}
                </span>
                <span className={`text-sm font-bold ${activeTab === 'maquina' ? 'text-[#002046]/70' : 'text-purple-700/70'}`}>hrs</span>
              </div>
            </div>
            <div className={`bg-white border-t-4 border border-slate-200 rounded-2xl p-6 shadow-sm ${activeTab === 'caminhao' ? 'border-t-red-500' : 'border-t-blue-500'}`}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {activeTab === 'caminhao' ? 'Custo Operacional de Caminhões' : 'Custo de Utilização Estimado'}
                </span>
                <DollarSign className={activeTab === 'caminhao' ? 'text-red-500 w-5 h-5' : 'text-blue-500 w-5 h-5'} />
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-sm font-bold text-slate-400 mr-0.5">R$</span>
                <span className="font-mono text-4xl font-black text-slate-800 tracking-tighter">
                  {(activeTab === 'maquina' ? machineStats.totalRevenue : truckStats.totalRevenue).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[350px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold text-slate-800 font-display">Relatório Detalhado: {activeTab === 'maquina' ? 'Máquinas' : 'Caminhões'}</h3>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-sans text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <th className="py-4 px-4 w-24">Data</th>
                    <th className="py-4 px-4">Fazenda</th>
                    <th className="py-4 px-4">Equipamento</th>
                    <th className="py-4 px-4">Operador</th>
                    <th className="py-4 px-4 text-center">Hr. Inic.</th>
                    <th className="py-4 px-4 text-center">Hr. Final</th>
                    <th className="py-4 px-4 text-right">Hrs Trabalhadas</th>
                    <th className="py-4 px-4 text-right">Tarifa</th>
                    <th className="py-4 px-4 text-right">Faturamento</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-700 divide-y divide-slate-100 font-medium">
                  {(activeTab === 'maquina' ? filteredMachineReadings : filteredTruckReadings).map((r, index) => {
                    return (
                      <tr key={index} className="hover:bg-slate-50 transition-colors group">
                        <td className="py-3 px-4 font-mono text-slate-500 group-hover:text-slate-800 font-bold">{r.dateStr}</td>
                        <td className="py-3 px-4"><span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getEntityColor(r.sheetName).bg} ${getEntityColor(r.sheetName).text} border ${getEntityColor(r.sheetName).border}`}>{r.sheetName}</span></td>
                        <td className="py-3 px-4 font-bold text-slate-800">{r.machineName}</td>
                        <td className="py-3 px-4"><span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getEntityColor(r.driver).bg} ${getEntityColor(r.driver).text} border ${getEntityColor(r.driver).border}`}>{r.driver}</span></td>
                        <td className="py-3 px-4 text-center font-mono text-slate-500">{r.initial}</td>
                        <td className="py-3 px-4 text-center font-mono text-slate-500">{r.final}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#002046] bg-[#002046]/5">{r.hours.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-500">{formatBRL(r.ratePerHour)}/h</td>
                        <td className="py-3 px-4 text-right font-mono font-black text-emerald-600">{formatBRL(r.revenue)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
